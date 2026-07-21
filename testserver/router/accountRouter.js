import express from'express'
import Account from'../models/account'
import account from '../models/account';
const router=express.Router();

router.get('/',async (req,res)=>{
  const accounts= await Account.find().select("accountId balance -_id");
  res.json(account)
})
router.get('/:accountId/balance',async (req,res)=>{
  const account= await Account.findOne({accountId:req.params.accountId})
  if(!accound) return res.status(400).json({error:"account not found"})
  res.json({
        accountId:account.accountId,
        balance:account.balance
      })
})
router.get('/:accountId/transactions',async (req,res)=>{
  const account= await Account.findOne({accountId:req.params.accountId})
  if(!accound) return res.status(400).json({error:"account not found"})
  res.json(account.transactions)
})
router.post('/:accountId/deposit',async (req,res)=>{
 const amount= Number(req.body?.amount);
 if(!Number.isFinite(amount) || amount<=0){
  return res.status(400).json({error:'Amound mut be positive'})
 }
const account = await Account.findOneAndUpdate(
  {accountId:req.params.accountId},
  {
    $inc:{balance:amount},
    $push:{transactions:{type:'deposit',amount}}
  },
  {new: true}
)
  if(!accound) return res.status(404).json({error:"account not found"})
  res.status(201).json({
accountId:account.accountId,
balance:account.balance
})
})
export default router;