const express =require('express')
const router=express.Router()
const formController=require("../../controllers/formController/formController")





router.post("/createForm/:workspaceid",formController.formCreation)
router.post("/alreadyCreatedForm",formController.alreadyCreated)
router.post("/form/:id",formController.frombyid)
router.put("/form/update/:id",formController.updateForm)
router.delete("/form/delete/:id",formController.deleteform)













module.exports=router