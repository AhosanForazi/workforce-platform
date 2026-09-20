const express = require('express');
const router = express.Router();
const { updateMe, uploadUserAvatar, deleteUserAvatar, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

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

router.put('/me', protect, updateMe);
router.post('/me/avatar', protect, handleAvatarUpload, uploadUserAvatar);
router.delete('/me/avatar', protect, deleteUserAvatar);
router.post('/me/profile-image', protect, handleAvatarUpload, uploadUserAvatar);
router.delete('/me/profile-image', protect, deleteUserAvatar);
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
