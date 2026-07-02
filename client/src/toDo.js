import React, { useState } from 'react'
import TodoCard from './todoCard'

export default function ToDo() {
const [title, setTitle]=useState('')
const [description, setDescription]=useState('')
const [tasks,setTasks]=useState({
  todo:[],
  inProgress:[],
  done:[]
})
const gridList=["todo", "inProgress", "done"]
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!title || !description){
      alert('both title and description are required')
      return;
    }
    const newTask={
      id:Date.now(),
      title,
      description
    }
    setTasks((prev)=>({
      ...prev,
      todo:[...prev.todo,newTask]
    }))
    setTitle('');
    setDescription('')
  }
  const moveTask=(task,from,to)=>{
    setTasks((prev)=>{
      const updatedFrom=prev[from].filter((t)=>t.id!==task.id)
      const updatedTo=[...prev[to],task];
      return{
        ...prev,
        [from]:updatedFrom,
        [to]:updatedTo
      }
    })
  }
  return (
    <div style={{display:"flex", gap:'20px'}}>
      <div>
      <h1>Task Dahsboard</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={title}
          placeholder='enter title'
          onChange={(e)=>setTitle(e.target.value)}
        />
          <input 
          type="text" 
          value={description}
          placeholder='enter description'
          onChange={(e)=>setDescription(e.target.value)}
        />
        <button type='submit'>add new task</button>

      </form>
      </div>
{gridList.map((col)=>(
  <div
          key={col}
          style={{
            width: "30%",
            border: "1px solid gray",
            padding: "10px",
          }}
  >
    <h2>{col==="todo"
        ?"TO DO"
        :col==="inProgress"
        ?"IN PROGRESS"
        :"DONE"}
    </h2>
    {tasks[col].map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              col={col}
              moveTask={moveTask}
            />
          ))}
  </div>
))}
    </div>
  )
}
