const Workspaceschema = require("../../models/Workspaceschema");
const mongoose = require("mongoose");
const client = require("../../client")
require("dotenv").config();



exports.particularWorkspace = async (req, res) => {
    try {
        let { ownerId } = req.body;
        let redisKey = `workspace:${ownerId}`;
        const cachedData = await client.get(redisKey)
        if (cachedData) {
            return res.status(200).json({ msg: "Cached Result", particularUser: JSON.parse(cachedData) })
        }

        let particularUser = await Workspaceschema.find({ ownerId })
        await client.set(redisKey, JSON.stringify(particularUser), "EX", 3600)
        res.status(200).json({ msg: "particular", particularUser })
    }
    catch (err) {
        console.error("Error:", err.message);
        res.status(400).json({ msg: "Server error" })
    }
}


exports.createWorkspace = async (req, res) => {
    try {
        let { workspacename, description, img, ownerId, company } = req.body;
        if (req.body) {
            let createWorkspace = await Workspaceschema.create({
                workspacename, description, img, ownerId, company
            })
            res.status(200).json({ msg: "workspaceCreated" })
        }
        else {
            res.status(400).json({ msg: "login again" })
        }
        await client.del(`workspace:${ownerId}`)
    }
    catch (err) {
        res.status(400).json({ msg: "Server error" })
    }
}
exports.deleteWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }
        const objectIdWorkspaceId = new mongoose.Types.ObjectId(workspaceId);

        const workspace = await Workspaceschema.findOne({ _id: objectIdWorkspaceId });
        // console.log(workspace)
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found or you do not have permission" });
        }
        await Workspaceschema.findByIdAndDelete({ _id: objectIdWorkspaceId });
        await client.del(`workspace:${workspace.ownerId}`);
        return res.status(200).json({ success: true, message: "Workspace deleted successfully" });
    } catch (error) {
        console.error("Error deleting workspace:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.updateWorkspace = async (req, res) => {
    try {
        let { currentWorkspaceId } = req.params;
        let { workspacename, description, img, company } = req.body;

        if (!currentWorkspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        let findWorkspace = await Workspaceschema.findById(currentWorkspaceId);

        if (!findWorkspace) {
            return res.status(404).json({ msg: "Workspace not found" });
        }

        let updatedWorkspace = await Workspaceschema.findByIdAndUpdate(
            currentWorkspaceId,
            { workspacename, description, img, company },
            { new: true }
        );

        if (!updatedWorkspace) {
            return res.status(500).json({ msg: "Failed to update workspace" });
        }

        let redisKey = `workspace:${findWorkspace.ownerId}`;
        await client.del(redisKey)

        res.status(200).json({ msg: "Updated successfully", data: updatedWorkspace });
    } catch (err) {
        console.error("Error updating workspace:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
