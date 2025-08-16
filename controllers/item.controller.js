const Item = require('../models/item.model');

exports.createItem = async (req, res) => {
  const item = await Item.create({ ...req.body, user: req.userId });
  res.status(201).json(item);
};

// controllers/item.controller.js

exports.getItems = async (req, res) => {
  const { category } = req.query;
  const query = { user: req.userId };

  if (category) {
    query.category = category;
  }

  const items = await Item.find(query).populate('category');
  res.json(items);
};

