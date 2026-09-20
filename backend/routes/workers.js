const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getWorkerById,
  updateMyWorkerProfile,
  upsertServiceOffer,
  addAvailability,
  uploadWorkerAvatar,
  deleteWorkerAvatar,
} = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

// Flexible middleware accepting avatar, profileImage, image, or file field
const handleAvatarUpload = (req, res, next) => {
  uploadAvatar.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    if (req.files) {
      req.file =
        req.files['avatar']?.[0] ||
        req.files['profileImage']?.[0] ||
        req.files['image']?.[0] ||
        req.files['file']?.[0];
    }
    next();
  });
};

router.get('/', getWorkers);
router.put('/me', protect, authorize('worker'), updateMyWorkerProfile);
router.post('/me/avatar', protect, authorize('worker'), handleAvatarUpload, uploadWorkerAvatar);
router.delete('/me/avatar', protect, authorize('worker'), deleteWorkerAvatar);
router.post('/me/profile-image', protect, authorize('worker'), handleAvatarUpload, uploadWorkerAvatar);
router.delete('/me/profile-image', protect, authorize('worker'), deleteWorkerAvatar);
router.post('/me/offers', protect, authorize('worker'), upsertServiceOffer);
router.post('/me/availability', protect, authorize('worker'), addAvailability);
router.get('/:id', getWorkerById);

module.exports = router;
