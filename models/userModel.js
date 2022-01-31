const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },

    email:{
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, 'Kindly input a valid email']

    },

    photo:  {
        type: String,
        select: true
    },

    password:{
        type: String,
        required:[true, 'Kindly input password'],
        minlength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Kindly confirm your'],
        validate:{
            validator: function (el){
                return el === this.password
            },
            message: 'Passwords do not match'
        }
    },

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },

    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires: Date,
    active:{
        type: Boolean,
        default: true,
        select: false
    }

})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next()
    }
    else return next()
})


//Add password changed at field if password is reset or updated
userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.pre(/^find/, function(next){
    this.find({active: {$ne: false}})
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return  await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){

    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
  
        return JWTTimestamp < changedTimeStamp
    }
    
    return false
}


userSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10*60*1000
    return resetToken

}

const User = mongoose.model('User',  userSchema)

module.exports = User