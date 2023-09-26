const {Schema,model} = require("mongoose")

const commentSchema = Schema({
    content: {
        type: String,
        require: true
    },
    blogId : {
        type: Schema.Types.ObjectId,
        ref: "blog"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
},{timestamps:true})

module.exports = model("comment",commentSchema)