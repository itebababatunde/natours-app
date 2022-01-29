const catchAsync = require('./../utils/catchAsync')
const User = require('./../models/userModel');
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')
const {upload} = require('../utils/upload')




const filterObj = (obj, ...allowedFields) => {
    let newObj = {}
     Object.keys(obj).forEach(el=>{
         if (allowedFields.includes(el)){ newObj[el] = obj[el]}
     })
     return newObj
}

exports.uploadProfilePic = upload.single('photo')

exports.getAllUsers =  factory.getAll(User)
  

exports.getUser = factory.getOne(User)

exports.createUser = (req,res)=>{
    res
        .status(500)
        .json({
            status:"error",
            message: "Please use /signup to create user"
        })
}
exports.updateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)

exports.getMe = (req,res,next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMe = catchAsync( async (req,res,next)=>{
    //Create error if user posts password data
    if(req.body.password||req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates', 400))
    }

    //Filter body to only update certain fields
    const {name, email} = req.body

    updateObj = {
        name,
        email
    }
    if (req.file){
        updateObj.photo= req.file.path
    }
    //Udate user document

    const UpdatedUser = await User.findByIdAndUpdate(req.user.id, updateObj,{new:true, runValidators:true})

    res.status(200).json({
        status:'success',
        data:{
            user: UpdatedUser
        }
    })

}) 

exports.deleteMe = factory.deleteOne(User)

// exports.deleteMe = catchAsync( async (req,res,next)=>{

//     const user = await User.findByIdAndUpdate(req.user.id, {active: false})

//     res.status(204).json({
//         status:'success',
//         data: null
//     })

// }) 