import React, { useEffect, useState, useMemo } from 'react'
import bankServer from './server/server'

export default function SamplePage() {
  const [accounts, setAccounts] = useState([])
  const [account, setAccount] = useState('')
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [val, setVal] = useState(0)
  const [dep, setDep] = useState(0)
  const [error, setError] = useState('')
  const [res, setRes] = useState('')
  const [transactionAccount, setTransactionAccount] = useState("");
const [transactions, setTransactions] = useState([]);
const [transactionError, setTransactionError] = useState("");


  const getAccounts = async () => {
    const data = await bankServer.getAccounts()
    setAccounts(data)
  }
  useEffect(() => {
    getAccounts()
  }, [])
  const handleSubmit = async () => {
    try{
      await bankServer.transfer(fromAccount, toAccount, val)
    }catch(err){
      setError(err.message||'Something weng wrong')
    }
    
  }
  const handleSubmitDep = async () => {
    try{
      const data= await bankServer.deposit(account,dep)
      setRes(data)
    }catch(err){
      setError(err.message||'Something weng wrong')
    }
    
  }
  const handleGetTransactions = async () => {
  try {
    setTransactionError("");

    const data = await bankServer.getTransactions(transactionAccount);
    setTransactions(data);
  } catch (error) {
    setTransactions([]);
    setTransactionError(error.message);
  }
};

  return (
    <div className='main-container'>
      <div className="transfer">
        <label htmlFor="fromAccount">From account:</label>
        <select id="fromAccount" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
          <option value="">Select an account</option>
          {accounts?.map((p) => (
            <option key={p.accountId}>
              {p.accountId}
            </option>
          ))}
        </select>
        <label htmlFor="toAccount">To account:</label>
        <select id="toAccount" value={toAccount} onChange={(e) => setToAccount(e.target.value)}>
          <option value="">Select an account</option>
          {accounts?.map((p) => (
            <option key={p.accountId}>
              {p.accountId}
            </option>
          ))}
        </select>
      
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button type='submit' onClick={handleSubmit}>submit</button>
      <p>{error}</p>
      </div>
      <div className="deposit">
        <label htmlFor="toAccount">To account:</label>
        <select id="toAccount" value={account} onChange={(e) => setAccount(e.target.value)}>
          <option value="">Select an account</option>
          {accounts?.map((p) => (
            <option key={p.accountId}>
              {p.accountId}
            </option>
          ))}
        </select>
        <input
        type="number"
        value={dep}
        onChange={(e) => setDep(e.target.value)}
      />
      <button type='submit' onClick={handleSubmitDep}>deposit</button>
        {res && (
    <div>
      <p>Deposit completed successfully.</p>
      <p>Account: {res.accountId}</p>
      <p>New balance: {res.balance}</p>
    </div>
  )}

  {error && <p>{error}</p>}
      </div>

<div className="transactions">
  <h2>Transaction History</h2>

  <select
    value={transactionAccount}
    onChange={(event) => setTransactionAccount(event.target.value)}
  >
    <option value="">Select an account</option>

    {accounts.map((account) => (
      <option key={account.accountId} value={account.accountId}>
        {account.accountId}
      </option>
    ))}
  </select>

  <button
    type="button"
    onClick={handleGetTransactions}
    disabled={!transactionAccount}
  >
    Get Transactions
  </button>

  {transactions.map((transaction, index) => (
    <div key={`${transaction.createdAt}-${index}`}>
      <p>Type: {transaction.type}</p>
      <p>Amount: {transaction.amount}</p>

      {transaction.accountId && (
        <p>Related account: {transaction.accountId}</p>
      )}

      <p>
        Date: {new Date(transaction.createdAt).toLocaleString()}
      </p>
    </div>
  ))}

  {transactions.length === 0 && (
    <p>No transactions found.</p>
  )}

  {transactionError && <p>{transactionError}</p>}
</div>

    </div>
  )
}
























// -------------------------------------------------------
// | Logo                     Search      Profile        |
// -------------------------------------------------------
// Search Products:
// [___________________________]
// +------------+ +------------+ +------------+
// | Product 1  | | Product 2  | | Product 3 |
// | Image      | | Image      | | Image      |
// | Price      | | Price      | | Price      |
// | Add Cart   | | Add Cart   | | Add Cart   |
// +------------+ +------------+ +------------+
// src={`https://covers.openlibrary.org/b/id/${photo.cover_id}-M.jpg`}
// alt={photo.title} 