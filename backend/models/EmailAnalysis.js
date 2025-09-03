const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const EmailAnalysisSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true,
    default: 'No Subject'
  },
  rawHeaders: {
    type: String,
    required: true
  },
  receivingChain: {
    type: [String],
    required: true,
    default: []
  },
  espType: {
    type: String,
    required: true,
    default: 'Unknown'
  },
  from: {
    type: String,
    required: true,
    default: 'unknown@unknown.com'
  },
  to: {
    type: String,
    required: true,
    default: 'unknown@unknown.com'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries
EmailAnalysisSchema.index({ messageId: 1 });
EmailAnalysisSchema.index({ createdAt: 1 });
EmailAnalysisSchema.index({ espType: 1 });

EmailAnalysisSchema.plugin(mongoosePaginate);

module.exports = mongoose.models.EmailAnalysis || mongoose.model('EmailAnalysis', EmailAnalysisSchema);