const express=require('express')
const app=express()
const nodemailer=require('nodemailer')
const users=require('./models/user')
const bodyParser=require('body-parser')
const cors=require('cors')
app.use(cors());
const path=require('path')
const multer=require('multer')

app.use(bodyParser());
let storage=multer.diskStorage({
   destination:(Req,file,cb)=>{
    cb(null,path.join(path.dirname(''),'../frontend/src/assets/uploaded files'))
   } ,
   filename:(req,file,cb)=>{
    console.log("inside filename",file.originalname)
    cb(null,file.originalname)
   }
})
let upload=multer({
    storage:storage
})

const mongoose=require('mongoose')
mongoose.set({strictQuery:false})
mongoose.connect("mongodb://127.0.0.1:27017/mentor_database",{
    useNewUrlParser: true,
   
    useUnifiedTopology: true
})
.then(()=>{
    console.log("connection successfull")
})
.catch(err=>{
    console.log(err)
})
app.post('/update_uploads',async (req,res)=>{
   users.findById(req.body._id)
    .then(data=>{
        console.log(Object.values(data.uploads),"asd")
        let a=Object.values(data.uploads)
        a.push(req.body.name)
        console.log(a,"adasdasd")
        users.findByIdAndUpdate(req.body._id,{uploads:a})
            .then(D=>{
                console.log(D?D+"!!!@!!!":"no d")
            })
            .catch(err=>{
                console.log(err)
            })
        
    })
})

app.get('/:id',(req,res)=>{
    console.log("inside get ")
    users.findById(req.params.id)
        .then(data=>{
            if(data){
                res.send({username:data.username,roll_no:data.roll_no,_id:data._id,uploads:data.uploads,attendance:data.attendance,role:data.role})
            }
        })
    
    
})
app.get("/chat_message",(req,res)=>{
    res.send({chats:"true"})
})
app.get('/mentors/data',(req,res)=>{
    console.log("inside mentors")
    let all_mentor_data=[]
    console.log("mentors")
    users.find({role:'mentor'})
        .then(data=>{
            if(data){
                console.log(data,"users")
                data.forEach(mentor_data=>{
                    
                    all_mentor_data.push({
                        _id:mentor_data._id,
                        name:mentor_data.username
                    })  
                    console.log(all_mentor_data)                  
                })
                if(data.length==all_mentor_data.length){
                    res.send(all_mentor_data)
                }
              
                
            }
        })
        .catch(err=>{
            console.log("error")
        })
})
app.post('/file',upload.single('file'),(req,res)=>{
    
    console.log("multer",req.body)
    res.send({"Saved":""})
})
app.get('/find_mentor/:id',(req,res)=>{
    console.log(req.params.id)
    users.findById(req.params.id)
        .then(data=>{
            if(data){
                console.log("found mentor",data)
                res.send([{username:data.username,_id:data._id,uploads:data.uploads}])
            }
        })
})
app.get('/find_student/:id',(req,res)=>{
    console.log(req.params.id)
    users.find({mentor_id:req.params.id})
    .then(data=>{
        let final_response=[]
        let i=0;
        while(data[i]){
            let response={
                _id:data[i]._id,
                username:data[i].username,
                roll_no:data[i].roll_no,
                uploads:data[i].uploads
            };
            final_response.push(response)
            i++;
        }
        if(i==data.length){
            res.send(final_response)
        }
        
    })
})
app.get('/username/:username',(req,res)=>{
    users.findOne({username:req.params.username})
    .then(data=>{
        if(data){
            res.json({uploads:data.uploads,username:data.username,mentor_id:data.mentor_id,_id:data._id,role:data.role,roll_no:data.roll_no})
        }
    })
})
app.post('/',(req,res)=>{
    let flag=false
    
    users.findOne(req.body)
    .then((data)=>{
        if(data){
            console.log(data,"dataaaaaa")
           flag=true
           res.send({true:true,true:true})
        }
        else{
            res.send({false:false})
        }

        
    })
    .catch(err=>{
        console.log(err)
    })
    
})
app.get('/roll_no/:no',(req,res)=>{
    users.findOne({roll_no:req.params.no})
        .then(data=>{
            if(data){
                res.send(data)
            }
        })
})
app.post('/data',(req,res)=>{
    let flag=true;
    let username=req.body.username;
    let roll_no=req.body.roll_no;
    let mentor_id=''
    if(req.body.mentor.length<1){
        mentor_id=null
    }
    else{
        mentor_id=req.body.mentor
    }

users.find({})
    .then(data=>{
        if(data){
            data.forEach(element=>{
               
              if(element.username==username || element.roll_no==roll_no){
                        flag=false;
                        
            }
              
            })
            if(flag && flag==true){

                let new_user=new users({
                    _id:new mongoose.Types.ObjectId(),
                    username:username,
                    password:req.body.password,
                    roll_no:roll_no,
                    mentor_id:req.body.mentor,
                    role:"student"
                })
                new_user.save()
                res.send({saved:true})
            }
            else{
                res.send({error:false})
                console.log("error existing data")
            }
        }
    })
    .catch(err=>{
        console.log(err?err:"success")
    })

})
app.get('/profile/:username',(req,res)=>{
    users.findOne({username:req.params.username}).then(data=>{
        if(data){
            console.log(data,"profile")
            res.send(data)
        }
        else{
            res.send({error:error})
        }
    })
    .catch(err=>{
        console.log(err)
        res.send({error:err})
    })
})
app.post("/update_attendance",(req,res)=>{
    users.findByIdAndUpdate(req.body._id,{attendence:req.body.attendence})
            .then(data=>{
                console.log(data)
                res.send(data)
            })
})

app.listen(3000,(err)=>{
    console.log(err?"error in port":"port activated")
})
