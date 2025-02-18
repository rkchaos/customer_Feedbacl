const express=require('express')
const app=express()
const userRouter=require("../server/router/userRouter/userrouter")
const workSpace=require("./router/worksapce/workspacerouter")
const form=require("./router/formRouter/formrouter")
const feedback=require("./router/feedbackRouter/feedbackrouter")
const dotenv=require('dotenv').config()
const cors=require('cors')
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOURL)
.then(()=>{
    console.log('Database connected')
})
.catch((err)=>{
    console.log(err)
})


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// app.get("/raj",(req,res)=>{
//     res.send("Welcome to the project")
// })

app.use(userRouter)
app.use(workSpace)
app.use(form)
app.use(feedback)




app.listen(8080,()=>{
    console.log(`server is running on port 8080`)
})