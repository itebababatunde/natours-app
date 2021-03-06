const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app.js');
port = process.env.PORT || 3000;

process.on('uncaughtException', err=>{
  console.log('uncaught exceptions, shutting down')
  server.close(()=>{
  process.exit(1)
})
})

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
} ).then(con =>  console.log("db collection successful"));


const server = app.listen(port, () => {
  console.log(`Server started in ${process.env.NODE_ENV} mode`);
})


process.on('unhandledRejection', err=>{
  console.log('Unhandled rejection, shutting down')
    server.close(()=>{
    process.exit(1)
  })
})

