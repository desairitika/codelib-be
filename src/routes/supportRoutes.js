const express = require('express');
const router = express.Router();

const SupportController = require('../controllers/supportController');

router.post('/submit', SupportController.submitQuery);

module.exports = router;