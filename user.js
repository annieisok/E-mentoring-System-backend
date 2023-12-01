const mongoose=require('mongoose')
const users=mongoose.model("users",{
    _id:mongoose.Schema.Types.ObjectId,
    username:{},
    password:{},
    contact_no:{type:Number},
    roll_no:{},
    uploads:{type:Array,default:[]},
    role:{},
    mentor_id:{type:mongoose.Schema.Types.ObjectId,default:null},
    attendence:{type:Array,default:['N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A','N/A',]}
})
module.exports=users
