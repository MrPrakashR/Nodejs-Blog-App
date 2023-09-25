const { Router } = require("express")
const path = require("path")
const multer = require("multer")
const Blog = require("../models/blog")
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./public/uploads"))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
})
const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    })
})

router.post("/", upload.single("CoverImage"),async (req,res)=>{
    console.log(req.file)
    console.log(req.body)
    const {title,body} = req.body
    const blog = await Blog.create(
        {
       title,
       body,
       createdBy: req.user._id,
       coverImageUrl: `uploads/${req.file.filename}`
    })
    res.redirect(`/blog/${blog._id}`)
})


module.exports = router