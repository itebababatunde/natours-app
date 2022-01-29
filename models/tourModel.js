const mongoose = require('mongoose');
const slugify = require('slugify')
const User = require('./userModel')

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      trim: true
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },

    maxGroupSize:{
      type: Number,
      required: [true, 'A tour must have a group size']
    },

    difficulty: {
      type: String,
      required:[true, 'A tour must have a difficulty']
    },
  
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: val => Math.round(val*10)/10
    },

    ratingsQuantity:{
      type: Number,
      default:0
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price']},

    
      priceDiscount: {
      type: Number
    },

    
    summary: {
      type: String,
      trim: true,
      required: true
    },

    slug:{
      type: String
    },


    description:{
      type: String,
      trim: true
    },


    imageCover:{
      type: String,
    },


    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },

    secretTour:{
      type: Boolean,
      default: false
    },
    
    startDates: [Date],

    //Location model - embedded in tours
    startLocation:{
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          emum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]

  }, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
   
  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
  })

  //Virtual populate
  tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: "_id"
  }) 

 


// Document middlewear : Runs before save and create command


//Code to embedd user(guides) into tour model

  tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next()
})


//Adding guides using referencing 




// Document middlewear : Runs after save and create command
// tourSchema.post('save', function(next,doc){
//     console.log(doc)
//   next()  
// })

//Query Middleware

tourSchema.index({price: 1, ratingsAverage: -1})
tourSchema.index({slug: 1})
tourSchema.index({startLocation: '2dsphere'})


tourSchema.pre(/^find/, function(next){
  this.find({secretTour:{$ne: true}})
  next()
})


tourSchema.pre(/^find/, function(next){
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  })
  next()
})


// //Aggregation Middleware
// tourSchema.pre('aggregate', function(next){
//   this.pipeline().unshift({
//     $match: {secretTour: {$ne:true}}
//   })
  
//   next()
// })
  const Tour = mongoose.model('Tour', tourSchema);
  
module.exports = Tour;