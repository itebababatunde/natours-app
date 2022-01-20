const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')


exports.getOverview = catchAsync( async  (req,res, next) => {
    //Get tour data from collection
    const tours = await Tour.find()
    //build template
    //render template using data 
    res.status(200).render('overview', {
        title:'All Tours',
        tours
      })
})

exports.getTour = catchAsync( async  (req,res, next) => {
  //Get tour data from collection
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews', fields: 'review rating review'
  })
  
  res
  .status(200)
  .set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
})

// exports.getLogInForm = (req,res) => {
//   res.status(200).render('login'), {
//     title: 'Log in to your account'
//   }
// }
exports.getLogInForm = (req, res) => {
  res.status(200)
      .set(
          'Content-Security-Policy',
          "connect-src 'self' http://127.0.0.1:3000/"
      )
      .render('login', {
          title: 'Log into your account',
      });
};
// exports.setHeader = (req, res, next) => { 
//   res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js" ); 
//   next(); 
// }
