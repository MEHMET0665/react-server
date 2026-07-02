<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref(null)

const form = ref({
  name: '',
  email: ''
})



const fetchUsers = async () => {
loading.value=true

  try {
    const res = await fetch('http://localhost:5000/api/users')

    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`)
    }
    const data= await res.json();
    users.value=data;


  } catch (err) {
   error.value=err.message
  } finally {
  loading.value=false
  }
}


onMounted(fetchUsers)
const dltUser=(id)=>{
  users.value=users.value.filter((val)=>val.id!==id)
}
const addUser=()=>{
  if(!form.value.name||!form.value.email) return -1
    users.value.push({
    id: Date.now(),
    name: form.value.name,
    email: form.value.email
  })

  form.value = { name: '', email: '' } 
}

</script>

<template>
  <div class="container">
    <h2>User Management</h2>

    <form class="form" @submit.prevent="addUser">
      <input v-model="form.name" placeholder="Name" />
      <input v-model="form.email" placeholder="Email" />
      <button type="submit">Add User</button>
    </form>

    

    <ul class="list">
      <li v-for='val in users' :key='val.id'>
        <span>{{val.name}} ({{val.email}})</span>
        <!-- <span class="id">#{{ val.id }}</span> -->
        <button @click='dltUser(val.id)'> delete user</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
}

.form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 12px;
  background: #42b883;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #369f72;
}

.loading {
  color: #555;
  text-align: center;
}

.error {
  color: red;
  text-align: center;
}

.list {
  list-style: none;
  padding: 0;
}

.list li {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.id {
  color: #999;
  font-size: 12px;
}
</style>