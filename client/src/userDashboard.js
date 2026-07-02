import React, { useEffect, useState } from 'react'

export default function UserDashboard() {

  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users")
      if (!res.ok) {
        setError('failed to get data')
        
      }
      const formatData = await res.json()
      setUser(formatData)
    }
    catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchData()
  },[])
  if(loading){
    return(
      <div>loaging</div>
    )
  }
    if(error){
    return(
      <div>error</div>
    )
  }

    const handleDelete = async (id) => {
      console.log('id',id)
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete user");
    }

    // remove deleted user from UI
    setUser((prevUsers) => prevUsers.filter((user) => user._id !== id));

    console.log(data.message);
  } catch (error) {
    console.error("Delete error:", error.message);
  }
};

    return (
      <div className='userCont'>
        {user?.map((user)=>(
          <div key={user.id} className='userRow'>
            <span>
              {user.name}
            </span>
            <span>
              {user.email}
            </span>
            <button onClick={()=>handleDelete(user._id)}>delete</button>
          </div>
        ))}

      </div>
    )
  }
