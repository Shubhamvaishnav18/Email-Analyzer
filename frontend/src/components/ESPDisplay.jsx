import React from 'react';
import { Mail, Mailbox, Send, Inbox, AtSign, FileText, HelpCircle } from "lucide-react";

const ESPDisplay = ({ espType = 'Unknown' }) => {
  const getESPDetails = (esp) => {
    const espConfig = {
      'Gmail': { icon: Mail, color: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-200' },
      'Outlook': { icon: Mailbox, color: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
      'Zoho': { icon: Send, color: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
      'Amazon SES': { icon: Inbox, color: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-200' },
      'Yahoo': { icon: AtSign, color: 'bg-purple-100', textColor: 'text-purple-800', borderColor: 'border-purple-200' },
      'Mailchimp': { icon: FileText, color: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
      'SendGrid': { icon: FileText, color: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
      'Unknown': { icon: HelpCircle, color: 'bg-gray-100', textColor: 'text-gray-800', borderColor: 'border-gray-200' }
    };

    return espConfig[esp] || espConfig['Unknown'];
  };

  const { icon: Icon, color, textColor, borderColor } = getESPDetails(espType);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Service Provider (ESP)</h3>
      <div className={`flex items-center p-4 rounded-lg border ${borderColor} ${color}`}>
        <Icon className={`h-8 w-8 ${textColor} mr-3`} />
        <div>
          <h4 className={`font-bold ${textColor}`}>{espType}</h4>
          <p className="text-sm text-gray-600">Detected ESP</p>
        </div>
      </div>
    </div>
  );
};

export default ESPDisplay;