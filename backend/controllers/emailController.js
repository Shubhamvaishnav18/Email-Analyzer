const EmailAnalysis = require('../models/EmailAnalysis');
const IMAPService = require('../services/imapService');

const imapService = new IMAPService();

class EmailController {
  //connection with IMAP
  static async connectIMAP(req, res) {
    try {
      await imapService.connect();
      res.json({ success: true, message: 'IMAP connected successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'IMAP connection failed', 
        error: error.message 
      });
    }
  }

  //disconnection with IMAP
  static async disconnectIMAP(req, res) {
    try {
      await imapService.disconnect();
      res.json({ success: true, message: 'IMAP disconnected successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'IMAP disconnection failed', 
        error: error.message 
      });
    }
  }

  //logic to analyze email with their subject
  static async analyzeEmails(req, res) {
    const { subjectFilter } = req.body;
    
    try {
      if (!imapService.connection) {
        await imapService.connect();
      }
      
      const emails = await imapService.fetchEmailsBySubject(subjectFilter);
      const savedEmails = [];
      const failedEmails = [];
      
      console.log(`Processing ${emails.length} emails...`);

      for (const email of emails) {
        try {
  
          const existingEmail = await EmailAnalysis.findOne({ 
            messageId: email.messageId 
          });
          
          if (existingEmail) {
            console.log(`Skipping duplicate: ${email.messageId}`);
            savedEmails.push(existingEmail);
            continue;
          }

          const emailData = {
            messageId: email.messageId,
            subject: email.subject || 'No Subject',
            rawHeaders: email.rawHeaders,
            receivingChain: email.receivingChain || [],
            espType: email.espType || 'Unknown',
            from: email.from || 'unknown@unknown.com',
            to: email.to || 'unknown@unknown.com',
            date: email.date || new Date()
          };

          const savedEmail = await EmailAnalysis.create(emailData);
          savedEmails.push(savedEmail);
          console.log(`Successfully saved email: ${email.messageId}`);
          
        } catch (error) {
          console.error('Error saving email:', error.message);
          console.error('Problematic email data:', {
            messageId: email.messageId,
            subject: email.subject,
            from: email.from,
            to: email.to,
            date: email.date
          });
          failedEmails.push({
            messageId: email.messageId,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Processed ${emails.length} emails, saved ${savedEmails.length} records, failed ${failedEmails.length}`,
        data: savedEmails,
        failures: failedEmails
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Email analysis failed', 
        error: error.message 
      });
    }
  }

  //logic to fetch analyze data 
  static async getAnalysisResults(req, res) {
    try {
      const { espType, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
      
      const query = {};
      
      if (espType && espType !== 'All') {
        query.espType = espType;
      }
      
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };
      
      const results = await EmailAnalysis.paginate(query, options);
      
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch analysis results', 
        error: error.message 
      });
    }
  }
}

module.exports = EmailController;