const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Task', taskSchema);
