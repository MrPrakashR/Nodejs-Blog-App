const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
require("dotenv").config()

const userRoutes = require('./routes/user')

const app = express()
const PORT = 8002

mongoose.connect(process.env.MONGODB_URL).then(e=>console.log("Mongodb connected..."))

app.set("view engine",'ejs')
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:true}))

app.use("/user",userRoutes)

app.get("/",(req,res)=>{
    res.render('home')
})

app.listen(PORT,()=>{
    console.log(
        `server running on PORT ${PORT}`
    )
})