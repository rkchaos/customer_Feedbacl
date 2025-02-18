const mongoose=require('mongoose')
const Schema = mongoose.Schema;




const userSchema =  new Schema({
    userId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true },
    workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const UserSchema=mongoose.model('UserSchema',userSchema)

module.exports=UserSchema