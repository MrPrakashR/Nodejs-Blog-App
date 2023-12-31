const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const Blog = require("./models/blog")
require("dotenv").config()

const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')

const { checkForAuthenticationCookie } = require("./middleware/authentication")

const app = express()
const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGODB_URL).then(e=>console.log("Mongodb connected..."))

app.set("view engine",'ejs')
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))
app.use('/blog', express.static('./public'))

app.get("/",async (req,res)=>{
    const blog = await Blog.find({})
    res.render('home',{
        user: req.user,
        blog:blog
    })
})


app.use("/user",userRoutes)
app.use("/blog",blogRoutes)

app.listen(PORT,()=>{
    console.log(
        `server running on PORT ${PORT}`
    )
})