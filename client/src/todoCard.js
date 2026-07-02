import React from 'react'

export default function TodoCard({ task, col, moveTask }) {
  return (
    <div>
      <span>
        {task.title}-{task.description}
      </span>
        {col!=="done"&&(
          <div>
            {col==="todo"&&(
              <button
                onClick={()=>moveTask(task,"todo","inProgress")}
              >
                In Progress
              </button>           
            )}
            <button
              onClick={()=>moveTask(task,col,"done")}
            >
              Done
            </button>
          </div>
        )}     
    </div>
  )
}

