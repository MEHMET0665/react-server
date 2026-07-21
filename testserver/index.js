import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose';
import accountRouter from "./router/accountRouter"
import transferRouter from "./router/transferRouter"
dotenv.config();
const app=express();
const PORT= process.env.PORT||5000;
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
  res.json({
    message:"server is running at localhost:5000",
    endpoints:[
      "GET / accounts/:accountId/balance",
      "GET / accounts/:accountId/transactions",
      "POST / accounts/:accountId/deposits",
      "POST / transfers",
    ]
  })
})
const startServer=async ()=>{
try{
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Mongo connected')
  app.use("/accounts", accountRouter)
  app.use("/transfers", transferRouter)

}catch(err){
  console.error("Server error:",err)
}
}
startServer()
