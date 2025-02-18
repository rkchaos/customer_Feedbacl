
const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const WorkspaceSchema = new Schema({
    workspacename: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    img: { type: String},
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    templates: [{ type: Schema.Types.ObjectId, ref: 'Template' }],
    feedbackData: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  module.exports = mongoose.model('Workspace', WorkspaceSchema);
  