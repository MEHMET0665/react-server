import mongoose from "mongoose";

// const transactionSchema = new mongoose.Schema(
//   {
//     type: { type: String, required: true },
//     amount: { type: Number, required: true },
//     accountId: String,
//   },
//   { timestamps: true, _id: false }
// );

// const accountSchema = new mongoose.Schema({
//   accountId: { type: String, required: true, unique: true },
//   balance: { type: Number, required: true, default: 0 },
//   transactions: [transactionSchema],
// });
const transactionSchema=new mongoose.Schema(
  {
  type:{type:String, required:true},
  amount:{type:Number, required:true},
  accountId:String,
},
{timestamps:true,_id:false}
)
const accountSchema= new mongoose.Schema(
  {
    accoundId:{type:String, required:true, unique:true},
    balance:{type:Number, required:true, default:0},
    transaction:[transactionSchema]
  }
)

export default mongoose.model("Account", accountSchema);
