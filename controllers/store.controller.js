// controllers/store.controller.js
const mongoose = require('mongoose');
const Store = require('../models/store.model');
const Category = require('../models/category.model'); // to block delete when categories exist

exports.createStore = async (req, res) => {
  const store = await Store.create({ ...req.body, user: req.userId });
  console.log('req.body', req.body);
  res.status(201).json(store);
};

exports.getStores = async (req, res) => {
  const { parent } = req.query;
  const query = { user: req.userId };
  if (parent === 'null') query.parentStore = null;
  else if (parent) query.parentStore = parent;
  const stores = await Store.find(query);
  res.json(stores);
};

// NEW: update store
exports.updateStore = async (req, res) => {
  const { id } = req.params;
  const _id = new mongoose.Types.ObjectId(id);
  const _userId = new mongoose.Types.ObjectId(req.userId);

  // Guard: cannot set itself as its own parent
  if (req.body.parentStore && String(req.body.parentStore) === String(id)) {
    return res.status(400).json({ message: 'A store cannot be its own parent' });
  }

  const update = {
    name: req.body.name,
    image: req.body.image,
    parentStore: req.body.parentStore ?? null
  };

  Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

  const store = await Store.findOneAndUpdate(
    { _id, user: _userId },
    update,
    { new: true }
  );

  if (!store) return res.status(404).json({ message: 'Store not found' });
  res.json(store);
};

// NEW: delete store (block if has child stores or categories)
exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  const _id = new mongoose.Types.ObjectId(id);
  const _userId = new mongoose.Types.ObjectId(req.userId);

  const store = await Store.findOne({ _id, user: _userId });
  if (!store) return res.status(404).json({ message: 'Store not found' });

  // Child stores?
  const childStoreCount = await Store.countDocuments({ parentStore: _id, user: _userId });
  if (childStoreCount > 0) {
    return res.status(400).json({ message: 'Cannot delete: store has child stores' });
  }

  // Categories under this store?
  const catCount = await Category.countDocuments({ store: _id, user: _userId });
  if (catCount > 0) {
    return res.status(400).json({ message: 'Cannot delete: store has categories' });
  }

  await Store.deleteOne({ _id, user: _userId });
  res.json({ ok: true });
};
