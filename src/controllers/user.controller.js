import {asynchandler} from "../utils/asynchandler.js";
import {APIError} from "../utils/apierror.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {APIResponse} from "../utils/apiresponse.js"

const registerUser=asynchandler(async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username and email
    // check for images, check for avatar
    // upload them to cloudinary, avtar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    console.log("Request Body ",req.body)
    const {fullname,email,username,password}=req.body
    console.log(fullname,email,username,password)

    // if(fullname===""){
    //     throw new APIError(400,"Fullname is required")
    // }

    if(
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new APIError(400,"All fields are required")
    }

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new APIError(409,"User already exists")
    }

    console.log("Request Files : ",req.files)
    const avatarLocalPath=req.files?.avatar[0]?.path;
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new APIError(400,"Avtar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new APIError(400,"Avtar file is required")
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new APIError(500,"Something went wrong while creating user")
    }

    return res.status(201).json(
        new APIResponse(200,createdUser,"User registered successfully")
    )
})

export {registerUser}