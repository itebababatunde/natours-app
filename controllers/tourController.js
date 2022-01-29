
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const {upload} = require('../utils/upload')


//MIDDLEWARE  
exports.aliasTopTours = (req,res,next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage, price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

//catchAsync Errors
exports.uploadTourImages = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 5},
])

exports.getAllTours = factory.getAll(Tour)

// exports.getAllTours =  catchAsync(async (req, res, next) => {

//   const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate();
  
//   const allTours =  await features.query;


//   res.status(200).json({
//     status: 'success',
//     results: allTours.length,
//     data: {allTours}
// });
  
// })


exports.getTour = factory.getOne(Tour, {path: 'reviews'})

exports.createTour = factory.createOne(Tour)

//exports.updateTour = factory.updateOne(Tour)
exports.updateTour = catchAsync(async (req, res, next) => {
  
  const update = req.body


  if (req.files){
    const images = []
    if(req.files.imageCover){
      update.imageCover = req.files.imageCover[0].path
    }
    
    if(req.files.images){
      for (const file in req.files.images){
        images.push(req.files.images[file].path)
      } 
      update.images = images
    }

  }
  const tour = await Tour.findByIdAndUpdate(req.params.id,update,{new: true, runValidators: true})
  
  
  if(!tour){
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data:{tour: tour}
  });

})

exports.deleteTour = factory.deleteOne(Tour)
// exports.deleteTour = catchAsync(async(req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id)

  
//   if(!tour){
//     return next(new AppError('No tour found with that ID', 404))
//   }

//   res.status(204).json({
//     status: 'success',
//     message:'deleted'
//   });

// }) 

exports.getTourStats = catchAsync(async (req,res, next) =>{
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte:4.5}}  
    },
    {
      $group: {
        _id: '$difficulty',
        numRating: {$sum: 'ratingsQuantity'},
        numTours: {$sum: 1},
        avgRating: {$avg: '$ratingsAverage'},
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'}
      } 
    },

    {
      $sort: {
        avgPrice: 1
      }
    // },
    

    // {
    //   $match: {
    //     _id: {$ne: 'easy'}
    //   }
    },

  ])


  res.status(200).json({
    status: 'success',
    data:{stats}
  });
  

}) 

exports.getMonthlyPlan = catchAsync(async (req,res,next)=>{
  const year = req.params.year *1 ;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },

      {
        $match: {
          startDates:{
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
        
      },


      {
        $group: {
          _id: {$month: '$startDates'},
          numTourStarts: {$sum:  1},
          tours: {$push: '$name'}
        } 
      },


      {
        $addFields: {month:'$_id'}
      },


      {
        $project: {
          _id: 0
        }
      },

      {
        $sort:{
          numTourStarts: -1
        }
      },

      {
        $limit: 12
      }


    ])

    res.status(200).json({
      status: 'success',
      data:{plan}
    });
}) 

exports.getToursWithin = catchAsync(async(req,res,next) => {
  const {distance, latlng, unit} = req.params
  const[lat,lng] = latlng.split(',')

  const radius = unit==='mi' ? distance/3963.2 : distance/6378.1
  if(!lat||!lng){
    next(new AppError('Please provide latitude and longitude i format lat,lon', 400))
  }
  const tours = await Tour.find({startLocation: {$geoWithin: {$centerSphere:[[lng,lat], radius]}}})
  res.status(200).json({
    status:'success',
    results: tours.length,
    data:{data: tours}
  })
}) 


//Geospartial aggregations
exports.getDistances = catchAsync(async (req,res,next)=>{
  const {latlng, unit} = req.params
  const[lat,lng] = latlng.split(',')

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001
  if(!lat||!lng){
    next(new AppError('Please provide latitude and longitude i format lat,lon', 400))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng*1, lat*1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project:{
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status:'success',
    data:{data: distances}
  })


})
// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
// };
