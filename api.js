const express=require("express")
const mongo=require("mongodb").MongoClient
const ObjectID=require("mongodb").ObjectId
const router=express.Router()
const app=express()
const bodyparser=require("body-parser")
app.use(bodyparser.json({limit: '50mb'}))
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
const url="mongodb://127.0.0.1:27017/"
var d
var c
mongo.connect(url,(err,db)=>{
    if(err) throw err;
    console.log("Database created")
    var dbs=db.db("mydb")
    d=dbs

    // dbs.createCollection("data",(err)=>{
    //     if(err) throw err
    //     console.log("Collection created")
    //     db.close()
    // })


    
})


router.post('/register',(req,res)=>{
    let data=req.body
    var obj={email:data.email,password:data.password}
    d.collection('data').insertOne(obj,(err)=>{
        if(err) throw err
        console.log("data inserted")
        res.send(JSON.stringify("data inserted"))
    })
})

router.post('/login',(req,res)=>{
    let data=req.body
    d.collection("data").findOne({email:data.email},(error,usr)=>{
        if(error){
            console.log(error)
        }
        else{
           if(!usr){
            res.send(JSON.stringify('invaliduser'))
           }else{
            if(usr.password!==data.password){
                res.send(JSON.stringify('invalidpassword'))
            }else{
                res.status(200).send(JSON.stringify("validuser"))
            }
           }
        }
    })
})

router.post('/file',(req,res)=>{
    let data=req.body
    async function run(){
        let x=d.collection("new")
        let y=await x.estimatedDocumentCount()
        if(y==0){
            d.collection("new").createIndex({"sno":1},{unique:true})  
        
            for(let i=0;i<data.length;i++){ 
                const dat={
                    sno:data[i]['sno'],
                    drawingnumber:data[i]['drawingnumber'],
                    componentname:data[i]['componentname'],
                    partname:data[i]['partname'],
                    material:data[i]['material'],
                    sequencename:data[i]['sequencename'],
                    opn:data[i]['opn'],
                    bar:data[i]['bar'],
                    insertspec:data[i]['insertspec'],
                    noofedge:data[i]['noofedge'],
                    edgelife:data[i]['edgelife'],
                    make:data[i]['make'],
                    supplier:data[i]['supplier'],
                    rate:data[i]['rate'],
                    insertlife:data[i]['insertlife'],
                    alternateinsert:data[i]['alternateinsert'],
                    noofedgeforalternative:data[i]['noofedgeforalternative']
                
        
                    
                }
        
                d.collection("new").insertMany([dat],{upsert:true})
            }
            res.send(JSON.stringify("data loaded"))
            
        }
        
        else{
            res.send(JSON.stringify("Data exist"))
        
        }

    }
    run()
    
})

router.post('/getdata',(req,res)=>{
    let data=req.body
    d.collection("new").find({drawingnumber:data.drawingnumber}).toArray((err,dat)=>{
        res.send(JSON.stringify(dat)).status(200)
    })

})

router.post('/getdatanew',(req,res)=>{
    let data=req.body
    d.collection("new").find({drawingnumber:data.drawingnumber,partname:data.partname,sequencename:data.sequencename}).toArray((err,dat)=>{
        res.send(JSON.stringify(dat)).status(200)
    })

})

router.post('/getupdate',(req,res)=>{
    let data=req.body
    console.log(data.drawingnumber)
    d.collection("new").findOneAndUpdate({_id:ObjectID(data._id)},{$set:{drawingnumber:data.drawingnumber,componentname:data.componentname,partname:data.partname,
    material:data.material,sequencename:data.sequencename,opn:data.opn,bar:data.bar,insertspec:data.insertspec,noofedge:data.noofedge
    ,edgelife:data.edgelife,make:data.make,supplier:data.supplier,rate:data.rate,insertlife:data.insertlife,alternateinsert:data.alternateinsert,
    noofedgeforalternative:data.noofedgeforalternative}},(err,res)=>{
        console.log(res)
    })
})

router.post('/grid',(req,res)=>{
    let data=req.body
    async function run(){
    let x=d.collection("new")
    let count=await x.estimatedDocumentCount()
    
    if(data){
        for(let i=0;i<data.length;i++){
            
            const dat={
                sno:count+1,
                drawingnumber:data[i]['drawingnumbernew'],
                componentname:data[i]['componentnamenew'],
                partname:data[i]['partnamenew'],
                material:data[i]['materialnew'],
                sequencename:data[i]['sequencenamenew'],
                opn:data[i]['opnnew'],
                bar:data[i]['barnew'],
                insertspec:data[i]['insertspecnew'],
                noofedge:data[i]['noofedgenew'],
                edgelife:data[i]['edgelifenew'],
                make:data[i]['makenew'],
                supplier:data[i]['suppliernew'],
                rate:data[i]['ratenew'],
                insertlife:data[i]['insertlifenew'],
                alternateinsert:data[i]['alternateinsertnew'],
                noofedgeforalternative:data[i]['noofedgeforalternativenew']
            }
    
            d.collection("new").insert([dat],{upsert:true})
        }
    
        res.send(JSON.stringify("data inserted"))
    
    }
    else{
        res.send("Input not found")
    }
    

    }
    run()
    
})

router.post('/delete',(req,res)=>{
    let data=req.body
    d.collection("new").remove({_id:ObjectID(data._id)},(err,x)=>{
        res.send(x)
    })
})


module.exports=router