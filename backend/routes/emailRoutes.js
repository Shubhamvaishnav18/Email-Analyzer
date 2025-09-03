const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/emailController');

// Connect to IMAP
router.post('/imap/connect', EmailController.connectIMAP);

// Disconnect from IMAP
router.post('/imap/disconnect', EmailController.disconnectIMAP);

// Analyze emails with subject filter
router.post('/analyze', EmailController.analyzeEmails);

// Get analysis results with filtering and pagination
router.get('/results', EmailController.getAnalysisResults);

module.exports = router;