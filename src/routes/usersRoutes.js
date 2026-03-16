const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/usersController');
const { authorizeRole, authenticateUser } = require('../middleware/authMiddleware');
const Roles = require('../constants/roles')

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([
   { name: 'img', maxCount: 1 },
   { name: 'cover', maxCount: 1 }
 ]);

router.get('/', authenticateUser, authorizeRole(Roles.ADMIN), UserController.getAllUsers);
router.post('/', authenticateUser, authorizeRole(Roles.ADMIN), UserController.createUser);
router.get('/:userId', authenticateUser, authorizeRole([Roles.ADMIN, Roles.USER]), UserController.getUserById);
router.put('/:userId', authenticateUser, authorizeRole([Roles.ADMIN, Roles.USER]), uploadFields, UserController.updateUser);
router.delete('/:userId', authenticateUser, authorizeRole([Roles.ADMIN]), UserController.deleteUser);

module.exports = router;