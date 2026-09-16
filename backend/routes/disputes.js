const express = require('express');
const router = express.Router();
const { createDispute, getMyDisputes, updateDispute } = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createDispute);
router.get('/my', protect, getMyDisputes);
router.put('/:id', protect, authorize('admin'), updateDispute);

module.exports = router;
