import React, { useState } from 'react'

export default function Dice() {
  const [dice1,setDice1]=useState(1)
  const [dice2,setDice2]=useState(1)
  const [rounds, setRounds]=useState(0)
  const [credits, setCredits]=useState(10)
  const [goal, setGoal]=useState(-1)
  const [msg,setMsg]=useState('');

   const rollOneDie = () => Math.floor(Math.random() * 6) + 1;
  const handleRoleDice=()=>{
    if(credits<=0)return;
    let currentCredits=credits;
    let currentRounds=rounds+1;
    let currentGoal=-1;
    let d1=rollOneDie()
    let d2=rollOneDie()
    let total=d1+d2;
    setDice1(d1)
    setDice2(d2)
    if(total===7 || total===11){
      currentCredits+=1;
      setMsg(`Dice Total: ${total}-Win`)
    }else if(total===2|| total===3||total===12){
      currentCredits-=1;
      setMsg(`Dice Total: ${total}-Los`)
    }else{
      currentGoal=total;
      setMsg(`dice total: ${total} - The goal is ${currentGoal}`)
    }
    while(true){
      d1=rollOneDie();
      d2=rollOneDie();
      total=d1+d2;
      if(total===7){
        currentCredits-=1;
        break;
      }else if(total===currentGoal){
        currentCredits+=1;
        break;
      }
    }
    setCredits(currentCredits);
    setRounds(currentRounds)
    setGoal(currentGoal)
    if(currentCredits<=0){
      setMsg(`Game over - Rounds: ${currentRounds}`)
    }
  }
  return (
  <div className="page">
  <div className="dice-container">
    <h1 className="title">Dice Game</h1>

    <div className="dice-wrapper">
      <span className="dice">{dice1}</span>
      <span className="dice">{dice2}</span>
    </div>
    <p>Credits:{credits}</p>
    <p>Goal:{goal===-1? 'None':goal}</p>
    <p>Rounds:{rounds}</p>
    <p>{msg}</p>

    <button 
    className="dice-btn"
    disabled={credits <= 0}
    onClick={handleRoleDice}
    >
      Roll Dices
    </button>
  </div>
</div>
  )
}
