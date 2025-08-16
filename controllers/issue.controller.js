// controllers/issue.controller.js
const Issue = require('../models/issue.model');
const Item = require('../models/item.model');

exports.issueItem = async (req, res) => {
  try {
    const { item, quantity, name, date, approvingAuthority, category, issueTime, condition } = req.body;
    const qty = Number(quantity);
    if (!item || !Number.isFinite(qty) || qty <= 0) return res.status(400).json({ message: 'Invalid item or quantity' });
    if (!name ||  !approvingAuthority || !category ) return res.status(400).json({ message: 'Missing required fields' });

    const updated = await Item.findOneAndUpdate(
      { _id: item, quantity: { $gte: qty } },
      { $inc: { quantity: -qty } },
      { new: true }
    );
    if (!updated) return res.status(400).json({ message: 'Insufficient quantity' });

    const issue = await Issue.create({ ...req.body, quantity: qty, action: 'ISSUE', user: req.userId });
    return res.status(201).json({ issue, item: updated });
  } catch (err) {
    console.error('issueItem error:', err);
    return res.status(500).json({ message: err.message || 'Error issuing item' });
  }
};

exports.unissueItem = async (req, res) => {
  try {
    const { item, quantity, originalIssue, name, date, approvingAuthority, category, issueTime, condition } = req.body;
    const qty = Number(quantity);
    if (!item || !Number.isFinite(qty) || qty <= 0) return res.status(400).json({ message: 'Invalid item or quantity' });
    if (!name || !approvingAuthority || !category ) return res.status(400).json({ message: 'Missing required fields' });

    const updated = await Item.findOneAndUpdate(
      { _id: item },
      { $inc: { quantity: +qty } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Item not found' });

    const record = await Issue.create({
      item,
      quantity: qty,
      name,
      date,
      approvingAuthority,
      category,
      issueTime,
      condition,
      action: 'UNISSUE',
      originalIssue: originalIssue || null,
      user: req.userId,
    });

    return res.status(201).json({ issue: record, item: updated });
  } catch (err) {
    console.error('unissueItem error:', err);
    return res.status(500).json({ message: err.message || 'Error unissuing item' });
  }
};
exports.unissueById = async (req, res) => {
  try {
    const { issueId } = req.body;
    if (!issueId) return res.status(400).json({ message: 'issueId is required' });

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const qty = Number(issue.quantity) || 0;
    const itemId = issue.item;
    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId },
      { $inc: { quantity: +qty } },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Related item not found' });

    await Issue.deleteOne({ _id: issueId });
    return res.status(200).json({ ok: true, item: updatedItem });
  } catch (err) {
    console.error('unissueById error:', err);
    return res.status(500).json({ message: err.message || 'Error unissuing item' });
  }
}
exports.getIssues = async (req, res) => {
  const filters = { user: req.userId, ...req.query };
  // allow filtering by action=ISSUE|UNISSUE, item, date, etc.
  const issues = await Issue.find(filters);
  res.json(issues);
};
