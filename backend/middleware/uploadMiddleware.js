const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = (req.user && (req.user.id || req.user._id)) || 'user';
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `avatar-${userId}-${uniqueSuffix}${cleanExt}`);
  },
});

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed.');
    error.status = 400;
    cb(error, false);
  }
};

const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter,
});

// Helper to remove an uploaded avatar file from disk
const deleteAvatarFile = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string') return;
  
  // Only delete if it's a local upload
  if (avatarUrl.startsWith('/uploads/avatars/')) {
    const filename = path.basename(avatarUrl);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Failed to delete old avatar file ${filePath}:`, err.message);
      }
    }
  }
};

module.exports = {
  uploadAvatar,
  deleteAvatarFile,
  uploadDir,
};
