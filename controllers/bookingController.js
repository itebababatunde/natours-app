
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


exports.getCheckoutSession = catchAsync (async (req,res,next) => {
    //get currentlu booked tour
    const tour = await Tour.findById(req.params.tourID)

    //create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url:  `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        line_items: [
            {
                name:  `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price*100,
                currency: 'usd',
                quantity:1
            }
        ]
    })
    
    //send to client 
    res.status(200).json({
        status: 'success',
        session

    })

})