const express=require('express')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const router= express.Router()
const User=require('../models/user')
const student = require('../models/student')

// .post to register account
router.post('/register',(req, res, next)=>{
    student.findOne({username:req.body.username})
    .then(user=>{
        if(user!=null){
            let err=new Error(`User ${req.body.username} already exists.`)
            res.status (400)
            return next(err)
        }
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err) return next(err)
            user=new student()
            user.username=req.body.username
            user.firstname=req.body.firstname
            user.lastname=req.body.lastname
            user.batch=req.body.batch
            user.course=req.body.course
            user.password = hash

            user.save().then(user=>{
                res.status(201).json({
                    'status':"User registered successfully",
                    userId:user._id,
                    username:user.username,
                    role:user.role
                })
            }).catch(next)

        })

    }).catch(next)
})



router.post('/login',(req, res, next)=>{
    student.findOne({username:req.body.username})
    .then(user=>{
        if(user == null){
            let err=new Error(`User ${req.body.username} has not register`)
            res.status(404)
            return next(err)
        }
        bcrypt.compare(req.body.password, user.password,
             (err, status)=>{
                if(err)return next(err)
                if(!status){
                    let err=new Error('password does not match')
                    res.status(401)
                    return next(err)
                }
                let data ={
                    userId: user._id, 
                    username: user.username,
                    role:user.role
                }
                jwt.sign(data, process.env.SECRET,
                     {'expiresIn':'1d'},(err,token)=>{
                        if(err) return next(err)
                        res.json({
                        status:"login sucess",
                        token:token    
                                   })
                     })
                
             })
    }).catch(next)
    

})

module.exports=router