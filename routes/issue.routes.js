const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { issueItem, getIssues ,unissueItem, unissueById} = require('../controllers/issue.controller');

router.post('/', auth, issueItem);
router.post('/unissue', auth, unissueItem); // NEW
router.post('/unissue-by-id', auth, unissueById); // NEW

router.get('/', auth, getIssues);

module.exports = router;
