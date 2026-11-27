const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide notice title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Please provide notice body/content'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ['Academic', 'Event', 'Holiday', 'Exam', 'General', 'Sports', 'Admission'],
        message: '{VALUE} is not a valid category',
      },
      default: 'General',
    },
    publish_date: {
      type: Date,
      default: Date.now,
    },
    visible_on_public_site: {
      type: Boolean,
      default: false,
    },
    target_class: {
      type: String,
      trim: true,
      default: 'All', // 'All' or specific class e.g. '10th'
    },
    attachment_url: {
      type: String,
      trim: true,
      default: '',
    },
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for public notices query and filtering
noticeSchema.index({ visible_on_public_site: 1, publish_date: -1 });
noticeSchema.index({ target_class: 1, publish_date: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
