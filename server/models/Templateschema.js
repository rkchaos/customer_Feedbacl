
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TemplateSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "UserSchema", required: true },
  name: { type: String },
  fields: [Schema.Types.Mixed], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})


TemplateSchema.pre("save", function (next) {
  this.markModified("fields")
  next()
})

module.exports = mongoose.model("Template", TemplateSchema)

