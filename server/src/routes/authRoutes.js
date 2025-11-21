const express = require('express');
const router = express.Router();
const { login, register, getUnverifiedUsers, verifyUser, forgotPassword, resetPassword, updateProfile, updateProfilePhoto, getUserData } = require('../controllers/authController');
const upload = require('../middleware/upload'); 
const authController = require('../controllers/authController');

router.post('/login', login);
router.post('/register', upload.fields([
  { name: 'studentId', maxCount: 1 },
  { name: 'studyLoad', maxCount: 1 }
]), register);
router.get('/unverified-users', getUnverifiedUsers);
router.post('/verify-user/:id', verifyUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/update-profile/:id', updateProfile);
router.get('/user/:userId', authController.getUserById);
router.put('/update-profile-photo/:id', upload.single('profileImage'), (req, res, next) => {
  if (req.file) {
    req.photoPath = '/uploads/' + req.file.filename;
  }
  next();
}, updateProfilePhoto);
router.get('/user/:id', getUserData);

module.exports = router;