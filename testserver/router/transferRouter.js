import express from'express'
import Account from'../models/account'
const router=express.Router();

router.post('/', async (req, res)=>{
  const {fromAccount, toAccount}=req.body?? {};
  const amount = Number(req.body?.amount)
  if(!Number.isFinite(amount)|| amount<=0){
    return res.status(400).json({error:"Amount must be positive"})
  }
  if(fromAccount===toAccount){
    return res.status(400).json({error:"Acoounts must be different"})
  }
  const accounts= await Account.find({
    accountId:{$in:[fromAccount,toAccount]}
  })
  if(accounts.length!==2){
    return res.status(404).json({error:"account not found"})
  }
  const sender= accounts.find((account)=>account.accountId===fromAccount)
  const receiver= accounts.find((account)=>account.accountId===tomAccount)
if(sender.balance<amount){
  return res.status(400).json({error:"Insufficient balance"})
}
sender.balance-=amount;
receiver.balance+=amount;
sender.transactions.push({type:"transder-out",amount, accountId:toAccount})
receiver.transactions.push({type:"transder-in",amount, accountId:fromAccount})
await Promise.all[sender.save(), receiver.save()]
res.status(201).json({
  fromAccount:sender.balance,
  toAccount:receiver.balance
})
})
export default router;