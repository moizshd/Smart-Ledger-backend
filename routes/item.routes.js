const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { createItem, getItems , updateItem, deleteItem} = require('../controllers/item.controller');

router.post('/', auth, createItem);
 router.put('/:id', auth, updateItem);
    router.delete('/:id', auth, deleteItem);
router.get('/', auth, getItems);

module.exports = router;
