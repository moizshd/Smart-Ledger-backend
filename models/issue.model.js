// models/issue.model.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  name: String,
  date: { type: Date, default: Date.now },
  quantity: { type: Number, required: true, min: 1 },
  approvingAuthority: String,
  category: String,
  issueTime: String,
  condition: String,
  action: { type: String, enum: ['ISSUE', 'UNISSUE'], default: 'ISSUE', required: true }, // NEW
  originalIssue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', default: null },   // optional linkage
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Issue', issueSchema);
