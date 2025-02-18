const express =require('express')
const router=express.Router()
const userController=require("../../controllers/userContoller/userController")


router.post("/storeUser",userController.storeuser)
router.post("/currentUser",userController.currentUser)



module.exports=router