const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require ('fs');

const Tour = require('./../../../models/tourModel')
const Review = require('./../../../models/reviewModel')
const User = require('./../../../models/userModel')

dotenv.config({ path: './config.env' });

port = 3000;


mongoose.connect('mongodb+srv://ite:ite@cluster0.0xiwl.mongodb.net/natours?retryWrites=true', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
} ).then(con =>  console.log("db connection successful"));


//Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));


//Import Data Into Database
const importData = async () => {
    try{
        await Tour.create(tours);
        await User.create(users, {validateBeforeSave: false});
        await Review.create(reviews);
        console.log('Data Successfully Loaded')
      
    }
    catch(err){
        console.log(err)
    }
    process.exit()
}


//Delete all data from collection

const deleteData = async () =>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('Data Successfully deleted')
    }
    catch(err){
        console.log(err)
    }
    process.exit()
}


if(process.argv[2]==='--import'){
    importData();
}
else if (process.argv[2]==='--delete'){
    deleteData();
}


