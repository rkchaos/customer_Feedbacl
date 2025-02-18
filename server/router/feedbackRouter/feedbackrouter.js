const express =require('express')
const router=express.Router()
const feedbackController=require("../../controllers/feedbackController/feedbackController")


router.post("/feedback/Store",feedbackController.feedbackStore)
router.post("/GetFeedback/:fromid",feedbackController.getFedback)



module.exports=router