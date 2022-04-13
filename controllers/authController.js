const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const {promisify} = require('util')
const Email = require('./../utils/email')
const crypto = require('crypto')

const signToken = id =>{
    return token = jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:  process.env.JWT_EXPIRES_IN})

}

const cookieOptions = {
    expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
    httpOnly:true
}
if (process.env.NODE_ENV === 'production') cookieOptions.secure = true


const createSendToken =(user, statusCode, res) => {
    const token = signToken(user._id)

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token: token,
        data: user
    })
}

exports.signUp = catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/me`
    //await new Email(newUser, url).sendWelcome()

    createSendToken(newUser, 201, res)
}) 

exports.logIn = catchAsync( async (req,res,next) => {
    const {email,password} = req.body;
    //Check if email and password exists
    if(!email||!password){
       return next(new AppError('Please provide email and password',400))
    }
    //Check if user exits 
    const user = await User.findOne({email}).select('+password')


    //Check if password matches

    if(!user||!(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }

    //Send JWT
    createSendToken(user, 200, res)

}) 

exports.logOut = catchAsync( async (req,res,next) => {
    res.cookie('jwt', '', {
        maxAge: 1,
    })
    res.status(200).json({success: true, message: 'logged out successfully'})
}) 



exports.protect = catchAsync(async (req,res,next) =>{ 
    let token
    //Check for token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        next(new AppError('You are not logged in, log in for access', 401))
    }


    //Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //Check if user exists 
    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError('The user no longer exists', 401))
    }
    //Check for password modification after token was issued 
    if(currentUser.changedPasswordAfter(decoded.iat)){
        
        return next(new AppError('Recently changed password, please log in again', 401))
    }

    //Grant access to the protected route 
    req.user = currentUser
    next()
})


exports.restrictTo = (...roles) => {
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next()
    }
}


exports.forgotPasword =catchAsync( async (req,res,next) => {
    //Get user based on email
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next(new AppError('There is no user with this email', 404))
    }



    //generate random token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    //send as an email
    const resetURL = `${req.protocol}/${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    
    try{
        await new Email (user, resetURL).sendPasswordReset()

        // await  sendEmail({
        //     email: user.email,
        //     subject: 'Password request token - valid for 10mins',
        //     message
        // })
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to mail'
        })
    

    }

    catch(err) {
        user.createPasswordResetToken = undefined
        user.createPasswordResetExpires = undefined
        await user.save({validateBeforeSave: false})
        console.log(err)
        return next(new AppError('There was an error sending the email, try later', 500))

    }
    
})

exports.resetPassword =catchAsync( async (req,res,next) => {
    //Get user based on token || Check that user exists and if token hasn't expired
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })

    if(!user){
        return next(new AppError('Token is Invalid or has expired', 400)
    )}


    
    //Update changedPasswordAt
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()


    //Log the user in and send JWT
    createSendToken(user, 200, res)

}) 


exports.updatePassword = catchAsync( async (req,res,next) => {
    //Get user from collection
    const user = await User.findById(req.user.id).select('+password')

    //Check if the current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401))
    }

    //Update to desired
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    

    //Log user in with updated password
    createSendToken(user, 200, res)

})