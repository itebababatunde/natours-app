const path = require('path')
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//Serving static files
//app.use(express.static(`${__dirname}/starter/public`))
app.use(express.static(path.join(__dirname, 'starter/public')))

const viewRouter = require('./routes/viewRoutes');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');


//MIDDLEWARE ---------------------------------------------------------------------------

//Set security http
app.use(helmet())

//Development api request log
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//To limit the number od requests to the API from an IP
const limiter = rateLimit({
  max:100,
  windowMs: 60*60*1000,
  message:"Too many requests from this IP, try again in one hour"
})
app.use('/api', limiter)

//Body parser for reading data into req.body
app.use(express.json({
  limit: '10kb'
}));

//Data sanitization against noSQL query injection
app.use(mongoSanitize())

//Data sanitization against XSS (malicious html code)
app.use(xss())

//Prevent parameter pollution - handle duplicate 
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}))


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


//Routes
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);




app.all('*', (req,res,next)=>{
  next(new AppError(`path ${req.originalUrl} is not defined`, 404));
})


app.use(globalErrorHandler)
//MOUNTING ROUTES--------------------------------------

//START SERVER -------------------------------------------------------------------------------------------

module.exports = app;
