const express =require('express')
const router=express.Router()
const workspaceController=require("../../controllers/workspaceController/workspaceController")


router.post("/createWorkspace",workspaceController.createWorkspace)
router.post("/particularWorkspace",workspaceController.particularWorkspace)
router.delete("/deleteWorkspace/:workspaceId",workspaceController.deleteWorkspace)
router.put("/updateWorkspace/:currentWorkspaceId",workspaceController.updateWorkspace)


module.exports=router