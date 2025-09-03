class ESPDetectionService {
  static detectESP(headers) {
    const receivedHeaders = headers.get('received') || [];
    const messageId = headers.get('message-id') || '';
    const receivedSPF = headers.get('received-spf') || '';
    const xMailer = headers.get('x-mailer') || '';
    
    // Convert all to lowercase for case-insensitive matching
    const allHeaders = [
      ...receivedHeaders,
      messageId,
      receivedSPF,
      xMailer
    ].map(h => h.toLowerCase());
    
    const headerString = allHeaders.join(' ');
    
    if (headerString.includes('google') || headerString.includes('gmail')) {
      return 'Gmail';
    } else if (headerString.includes('microsoft') || headerString.includes('outlook') || headerString.includes('hotmail')) {
      return 'Outlook';
    } else if (headerString.includes('zoho')) {
      return 'Zoho';
    } else if (headerString.includes('amazon') || headerString.includes('ses')) {
      return 'Amazon SES';
    } else if (headerString.includes('yahoo')) {
      return 'Yahoo';
    } else if (headerString.includes('sendgrid')) {
      return 'SendGrid';
    } else if (headerString.includes('mailchimp')) {
      return 'Mailchimp';
    }
    
    return 'Unknown';
  }
}

module.exports = ESPDetectionService;