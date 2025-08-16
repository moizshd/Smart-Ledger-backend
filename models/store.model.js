const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: String,
  image: String,
  parentStore: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Store', storeSchema);
