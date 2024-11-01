import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRouter from './route/user.route.js';
import messageRouter from './route/message.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

//middleware

app.use(express.json()); 
app.use(cookieParser());
//Routes

app.use('/api/v1/user', userRouter)
app.use('/api/v1/message', messageRouter)

app.listen(PORT,()=> {
    connectDB();
    console.log(`server is working on port ${PORT}`); 
}); 
