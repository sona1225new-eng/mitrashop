const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [300, 'Caption cannot exceed 300 characters'],
      default: '',
    },
    event_tag: {
      type: String,
      trim: true,
      default: 'General', // e.g., 'Annual Day', 'Sports Day', 'Science Exhibition', 'Campus'
    },
    public_id: {
      type: String, // Cloudinary asset public ID
      trim: true,
      default: '',
    },
    uploaded_at: {
      type: Date,
      default: Date.now,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ event_tag: 1, uploaded_at: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);
