const express = require('express')
const app = express()
require('dotenv').config()
const path = require("path");
const db = require('./db')



// Database configuration
db()


app.use(express.json())
app.use('/api/auth' , require('./router/auth'))
app.use("/api/users", require("./router/user"));
app.use("/images", express.static(path.join(__dirname, "images")));


const PORT = process.env.PORT || 6000
// server
app.listen(PORT, ()=>{
  console.log(`Server is running on port : ${PORT}`)
})