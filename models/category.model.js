const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  image: String,
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Category', categorySchema);
