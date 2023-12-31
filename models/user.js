const {Schema,model} = require("mongoose")
const { createHmac, randomBytes } = require("node:crypto")
const { createUserToken } = require("../services/authentication")

const userSchema = Schema({
    fullName: {
        type:String,
        require:true
    },
    email: {
        type:String,
        require:true,
        unique:true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    profileImageURL: {
        type: String,
        default:"/images/user_avtar.png"
    },
    role: {
      type: String,
      enum: ["USER","ADMIN"],
      default: "USER"
    }
},{ timestamps : true})

userSchema.pre("save",function (next) {
    const user = this

    if (!user.isModified("password")) return
    
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex")

    this.salt = salt
    this.password = hashedPassword

    next()
})

userSchema.static("matchPasswordAndGenerateToken",async function (email,password)  {
    const user = await this.findOne({email})
    if (!user) throw new Error("User Not Found")

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex")

    if (hashedPassword != userProvidedHash) throw new Error("Incorrect Password")

    const token = createUserToken(user)
    return token
})

module.exports = model("user",userSchema)