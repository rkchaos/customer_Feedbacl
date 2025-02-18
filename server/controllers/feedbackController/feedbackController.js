const feedbackschema = require("../../models/feedbackschema")
const client=require("../../client")





exports.feedbackStore=async(req,res)=>{
try{
    
    let{formValue,formid}=req.body
    

    if(!formValue || !formid){
        return res.status(400).json({msg:"formid and formvalue required"})
    }
     let rediskey=`feedback:${formid}`
    let storeFormdata=await feedbackschema.create({
        templateId:formid,
        data:formValue
     
    })
    client.del(rediskey)
    res.status(200).json({msg:"successfully submited",storeFormdata})
}
catch(err){
    res.status(400).json({msg:'server error'})
}

}

// exports.getFedback=async(req,res)=>{
//     try{
//         let{fromid}=req.params
      
//         if(!fromid){
//             return res.status(400).json({msg:"from id required"})
//         }
//         let formbyId=await feedbackschema.find({templateId:fromid})
//         if(!formbyId){
//             return res.status(400).json({msg:"form not found"})
//         }
//         res.status(200).json({msg:"fetch by id",form:formbyId})

//     }
//     catch(err){
//         res.status(400).json({msg:'server error'})
     
//     }

// }

exports.getFedback=async(req,res)=>{
    try{
        let{fromid}=req.params
        if(!fromid){
            return res.status(400).json({msg:"from id required"})
        }
        let rediskey=`feedback:${fromid}`
        let cachData=await client.get(rediskey)
        if(cachData){
            return res.status(200).json({msg:"catchedata",form:JSON.parse(cachData)})
        }
        let formbyId=await feedbackschema.find({templateId:fromid})
        if(!formbyId){
            return res.status(400).json({msg:"form not found"})
        }
        await client.set(rediskey,JSON.stringify(formbyId),"EX",3600)
        res.status(200).json({msg:"fetch by id",form:formbyId})

    }
    catch(err){
        res.status(400).json({msg:'server error'})
     
    }

}

