const mongoose = require("mongoose");
const Templateschema = require("../../models/Templateschema");
const client = require("../../client");





exports.formCreation = async (req, res) => {
    try {
        let { workspaceid } = req.params
        let { data, currentid, name } = req.body
        if (!workspaceid && !data && !currentid) {
            return res.status(400).json({ msg: 'workspaceid and formdata is required' })
        } else {
            let redisKey = `form:${workspaceid}`
            let createForm = await Templateschema.create({
                workspaceId: workspaceid, fields: data, ownerId: currentid, name: name
            })
            await client.del(redisKey)
            res.status(200).json({ msg: 'created success', createForm })
        }

    }
    catch (err) {
        console.log(err.message)
        res.status(400).json({ msg: "Server error" })

    }
}
exports.alreadyCreated = async (req, res) => {
    try {
        const { ownerId, workspaceid } = req.body;
        // console.log(req.body);
        if (!ownerId || !workspaceid) {
            return res.status(400).json({ msg: 'Both workspaceid and ownerid are required' });
        }
        let redisKey = `form:${workspaceid}`
        let chachesData = await client.get(redisKey)
        if (chachesData) {
            return res.status(200).json({ msg: "Cachedata", workspace: JSON.parse(chachesData) })
        }
        const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

        // Use find to get an array of workspaces
        const workspaces = await Templateschema.find({ workspaceId: workspaceid });

        if (workspaces.length === 0) {
            return res.status(404).json({ msg: 'Workspace not found' });
        }

        // Check each workspace for a matching ownerId
        const matchingWorkspace = workspaces.find(workspace => workspace.ownerId.equals(ownerObjectId));

        if (matchingWorkspace) {
            await client.set(redisKey, JSON.stringify(workspaces), 'EX', 3600)
            return res.status(200).json({
                msg: 'Workspace found successfully',
                workspace: workspaces,
            });
        } else {
            return res.status(403).json({
                msg: 'Owner ID does not match the workspace owner',
            });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
};

exports.frombyid = async (req, res) => {
    let { id } = req.params;
    let { currentid } = req.body;
    try {
        if (!id) {
            return res.status(400).json({ msg: 'Form id is required' });
        }

        let findfrom = await Templateschema.findById(id);
        if (!findfrom) {
            return res.status(404).json({ msg: 'Form not found' });
        }
        const ownerObjectId = new mongoose.Types.ObjectId(currentid);
        const isOwner = findfrom.ownerId.equals(ownerObjectId);

        return res.status(200).json({
            msg: 'Form found successfully',
            findfrom,
            isOwner, 
        });
    } catch (err) {
        let findfrom = await Templateschema.findById(id);
        if (!findfrom) {
            return res.status(404).json({ msg: 'Form not found' });
        }
        if(err.message==="input must be a 24 character hex string, 12 byte Uint8Array, or an integer"){
            return res.status(200).json({
                msg: 'Form found successfully',
                findfrom,
                isOwner:false, 
            });
        }
        return res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateForm = async (req, res) => {
    try {
        let { id } = req.params
        if (!id) {
            return res.status(400).json({ msg: 'id required' })
        }
        let { formdata, ownerId } = req.body
        if (!formdata || !ownerId) {
            return res.status(400).json({ msg: 'formdata workspace ownerid required' })
        }
        let template = await Templateschema.findById(id)
        if (!template) {
            return res.status(400).json({ msg: 'template not found' })
        }
        const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
        const isOwner = template.ownerId.equals(ownerObjectId);
        if (isOwner) {
            let redisKey = `form:${template.workspaceId}`
            let templates = await Templateschema.findByIdAndUpdate(id, { fields: formdata })
            await client.del(redisKey)
            return res.status(200).json({ msg: 'form found', templates })
        }
        else {
            return res.status(400).json({ msg: 'template not found' })
        }
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
}

exports.deleteform = async (req, res) => {
    try {
        let { id } = req.params
        // console.log(id)
        let { ownerId } = req.query


        if (!id || !ownerId) {
            return res.status(400).json({ msg: 'id and current not found' })
        }
        let findformId = await Templateschema.findById(id)

        if (!findformId) {
            return res.status(400).json({ msg: 'No form found' })
        }
        const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

        const isOwner = findformId.ownerId.equals(ownerObjectId);
        if (isOwner) {
            let template = await Templateschema.findByIdAndDelete(id)
            let redisKey = `form:${findformId.workspaceId}`
            await client.del(redisKey)
            return res.status(200).json({ msg: 'form delete', template })
        }
        else {
            return res.status(400).json({ msg: 'template not found' })
        }

    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
}