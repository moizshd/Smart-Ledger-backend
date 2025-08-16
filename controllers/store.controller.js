const Store = require('../models/store.model');

exports.createStore = async (req, res) => {
  const store = await Store.create({ ...req.body, user: req.userId });
  console.log('req.nody', req.body);
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
