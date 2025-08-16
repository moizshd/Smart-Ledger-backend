const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
  const category = await Category.create({ ...req.body, user: req.userId });
  res.status(201).json(category);
};

// controllers/category.controller.js

exports.getCategories = async (req, res) => {
  const { store } = req.query;
  const query = { user: req.userId };

  if (store) {
    query.store = store;
  }

  const categories = await Category.find(query);
  res.json(categories);
};

