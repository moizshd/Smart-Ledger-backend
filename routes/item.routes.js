const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { createItem, getItems } = require('../controllers/item.controller');

router.post('/', auth, createItem);
router.get('/', auth, getItems);

module.exports = router;
