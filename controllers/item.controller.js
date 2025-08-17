const Item = require('../models/item.model');
    const Issue = require('../models/issue.model');
const mongoose = require('mongoose');

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

exports.updateItem = async (req, res) => {
      const { id } = req.params;
      const update = {
        name: req.body.name,
        description: req.body.description,
        condition: req.body.condition,
        quantity: req.body.quantity,
      };
      const item = await Item.findOneAndUpdate(
        { _id: id, user: req.userId },
        update,
        { new: true }
      );
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.json(item);
    };

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const _id = new mongoose.Types.ObjectId(id);
  const _userId = new mongoose.Types.ObjectId(userId);

  // Ensure the item exists and belongs to the user
  const item = await Item.findOne({ _id, user: _userId });
  if (!item) return res.status(404).json({ message: 'Item not found' });

  // Compute current net issued for this item
  const agg = await Issue.aggregate([
    { $match: { user: _userId, item: _id } },
    {
      $group: {
        _id: '$item',
        net: {
          $sum: {
            $cond: [
              { $eq: ['$action', 'ISSUE'] },
              '$quantity',
              { $multiply: ['$quantity', -1] }
            ]
          }
        }
      }
    }
  ]);

  const net = agg[0]?.net || 0;
  if (net > 0) {
    return res.status(400).json({
      message: 'Cannot delete, item currently issued. Please unissue first.'
    });
  }

  await Item.deleteOne({ _id, user: _userId });
  res.json({ ok: true });
};

