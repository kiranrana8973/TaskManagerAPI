const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    }
}, { timestamps: true });
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    notes: [notesSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
