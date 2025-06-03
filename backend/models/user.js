const { name } = require('ejs')
const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

const userSchema= new mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    email:String,
    password:String,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
    profilepic:{
        type:String,
        default:"default.jpeg"
    }


})

module.exports=mongoose.model('user',userSchema);