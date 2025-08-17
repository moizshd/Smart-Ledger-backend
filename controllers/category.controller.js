// controllers/category.controller.js
const mongoose = require('mongoose');
const Category = require('../models/category.model');
const Item = require('../models/item.model'); // for dependency checks

exports.createCategory = async (req, res) => {
  const category = await Category.create({ ...req.body, user: req.userId });
  res.status(201).json(category);
};

exports.getCategories = async (req, res) => {
  const { store } = req.query;
  const query = { user: req.userId };

  if (store) {
    query.store = store;
  }

  const categories = await Category.find(query);
  res.json(categories);
};

// NEW: update category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const _id = new mongoose.Types.ObjectId(id);
  const _userId = new mongoose.Types.ObjectId(req.userId);

  // Do not allow a category to be its own parent
  if (req.body.parentCategory && String(req.body.parentCategory) === String(id)) {
    return res.status(400).json({ message: 'A category cannot be its own parent' });
  }

  const update = {
    name: req.body.name,
    image: req.body.image,
    parentCategory: req.body.parentCategory ?? null,
    store: req.body.store
  };

  // Only update provided (non-undefined) fields
  Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

  const category = await Category.findOneAndUpdate(
    { _id, user: _userId },
    update,
    { new: true }
  );

  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

// NEW: delete category (block if children or items exist)
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const _id = new mongoose.Types.ObjectId(id);
  const _userId = new mongoose.Types.ObjectId(req.userId);

  const category = await Category.findOne({ _id, user: _userId });
  if (!category) return res.status(404).json({ message: 'Category not found' });

  // Check for child categories
  const childCount = await Category.countDocuments({ parentCategory: _id, user: _userId });
  if (childCount > 0) {
    return res.status(400).json({ message: 'Cannot delete: category has child categories' });
  }

  // Check for items under this category
  const itemCount = await Item.countDocuments({ category: _id, user: _userId });
  if (itemCount > 0) {
    return res.status(400).json({ message: 'Cannot delete: category is in use by items' });
  }

  await Category.deleteOne({ _id, user: _userId });
  res.json({ ok: true });
};
