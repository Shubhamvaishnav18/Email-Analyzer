const imapSimple = require('imap-simple');
const { simpleParser } = require('mailparser');
const imapConfig = require('../config/imap');
const ESPDetectionService = require('./espDetectionService');

class IMAPService {
  constructor() {
    this.connection = null;
  }

  //connect the IMAP
  async connect() {
    try {
      this.connection = await imapSimple.connect(imapConfig);
      console.log('IMAP connection established');
    } catch (error) {
      console.error('IMAP connection failed:', error);
      throw error;
    }
  }

  //Disconnect the IMAP
  async disconnect() {
    if (this.connection) {
      this.connection.end();
      console.log('IMAP connection closed');
    }
  }

  //extract email address
  extractEmailAddress(field) {
    if (!field) return 'unknown@unknown.com';
    
    if (typeof field === 'string') {
      return field;
    }
    
    if (field.text) {
      return field.text;
    }
    
    if (field.value && field.value.length > 0) {
      const firstAddress = field.value[0];
      if (firstAddress.address) {
        return firstAddress.address;
      }
      if (firstAddress.name) {
        return firstAddress.name;
      }
    }
    
    return 'unknown@unknown.com';
  }

  //function to fetch emails by their subject of email
  async fetchEmailsBySubject(subjectFilter) {
    if (!this.connection) {
      throw new Error('IMAP connection not established');
    }

    try {
      await this.connection.openBox('INBOX');
      
      const searchCriteria = ['ALL'];
      if (subjectFilter) {
        searchCriteria.push(['SUBJECT', subjectFilter]);
      }
      
      const fetchOptions = {
        bodies: [''],
        markSeen: false,
        struct: true
      };
      
      const messages = await this.connection.search(searchCriteria, fetchOptions);
      const results = [];
      
      console.log(`Found ${messages.length} emails to process`);

      for (const message of messages) {
        try {

          const entireMessage = message.parts.find(part => part.which === '');
          if (!entireMessage || !entireMessage.body) {
            console.log('No message body found');
            continue;
          }

          const parsed = await simpleParser(entireMessage.body);
          const headers = parsed.headers;
          
          let receivingChain = [];
          if (headers) {
            const receivedHeaders = headers.get('received');
            if (receivedHeaders) {
              receivingChain = Array.isArray(receivedHeaders) ? receivedHeaders : [receivedHeaders];
            }
          }
          
          const espType = headers ? ESPDetectionService.detectESP(headers) : 'Unknown';
          
          const messageId = headers && headers.get('message-id') 
            ? headers.get('message-id') 
            : `unknown-${message.attributes.uid}-${Date.now()}`;
          
          const emailData = {
            messageId: messageId,
            subject: parsed.subject || 'No Subject',
            rawHeaders: headers ? JSON.stringify(Object.fromEntries(headers)) : '{}',
            receivingChain: receivingChain,
            espType: espType || 'Unknown',
            from: this.extractEmailAddress(parsed.from),
            to: this.extractEmailAddress(parsed.to),
            date: parsed.date || new Date()
          };

          results.push(emailData);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }
}

module.exports = IMAPService;