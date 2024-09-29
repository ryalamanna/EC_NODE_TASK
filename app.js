import express from 'express';
import logger from 'morgan'
import {cityRouter} from './src/routes/city.route.js'
import mongoose from 'mongoose';
import errorHandler from './src/utils/errorMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/city', cityRouter);

app.use(errorHandler)

app.listen('3200' , async()=>{
    await mongoose.connect(process.env.DB_URL, {});
    console.log('LIsting at 3200');
})
export default app;