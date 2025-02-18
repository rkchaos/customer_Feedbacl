const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const FeedbackSchema = new Schema({
    templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
    // workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    data: [Schema.Types.Mixed],
    submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
