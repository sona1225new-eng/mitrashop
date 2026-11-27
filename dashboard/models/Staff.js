const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide staff name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject/department'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide qualification (e.g., M.Sc, B.Ed)'],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
      default: 'Teacher', // e.g. 'Principal', 'PGT Teacher', 'TGT Teacher', 'Lab Assistant'
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    joining_date: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.index({ designation: 1 });

module.exports = mongoose.model('Staff', staffSchema);
