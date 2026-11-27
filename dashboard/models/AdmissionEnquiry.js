const mongoose = require('mongoose');

const admissionEnquirySchema = new mongoose.Schema(
  {
    student_name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    guardian_contact: {
      type: String,
      required: [true, 'Please provide guardian contact number'],
      trim: true,
    },
    grade_applying_for: {
      type: String,
      required: [true, 'Please provide the grade/class applying for'],
      trim: true,
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
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'assessment', 'enrolled', 'rejected'],
        message: '{VALUE} is not a valid enquiry status. Allowed: new, contacted, assessment, enrolled, rejected',
      },
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index on status and createdAt for filtering recent enquiries
admissionEnquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('AdmissionEnquiry', admissionEnquirySchema);
