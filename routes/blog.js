const { Router } = require("express")
const path = require("path")
const multer = require("multer")
const Blog = require("../models/blog")
const Comment = require("../models/comment")
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

router.get("/:id",async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy")
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy")

    res.render("blog",{
        user:req.user,
        blog:blog,
        comments: comments
    })
})

//Comments
router.post("/comment/:blogId",async (req,res)=>{
    const comment = await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy: req.user._id
    })

    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router