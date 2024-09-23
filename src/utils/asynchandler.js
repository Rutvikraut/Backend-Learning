const asynchandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asynchandler}

// const asynchandler=(fn)=>async(req,res,next)=>{
//     try{

//     }catch(err){
//         res.status(500).json({success:false,msg:err.message})
//     }
// }