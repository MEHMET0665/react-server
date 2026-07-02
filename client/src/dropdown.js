import React from 'react'

export default function Dropdown({option,onChange}) {
  const handleChange=(e)=>{
    onChange(e.target.value)
  }
  return (
    <div>
      <select name="" id="" onChange={handleChange}>
      <option value="">select one</option>
      {option.map((val)=>(
        <option value={val}>{val}</option>
      ))}
      </select>
      

    </div>
  )
}
