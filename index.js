require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const port=3000
const path=require('path')
const student_routes=require('./routes/student-route')
const user_routes=require('./routes/user-route')



mongoose.connect('mongodb://127.0.0.1:27017/students')
.then(()=>{
    console.log('connected to mongoDB server')
    app.listen(port,()=>{
        console.log(`App is running on port:${port}`)
    })
}).catch((err)=>console.log(err))

app.use((req,res,next)=>{
    console.log(`${req.method} ${req.path}`)
    next()
})
app.use(express.json())

app.use('/student',student_routes)
app.use('/users',user_routes)
app.use((err,req,res,next)=>{
    console.log(err.stack)
    if(res.statusCode==200)res.status(500)
    res.json({"err":err.message})
})