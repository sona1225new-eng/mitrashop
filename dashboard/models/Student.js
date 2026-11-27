const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    class: {
      type: String,
      required: [true, 'Please provide class (e.g., Nursery, 1st, 10th)'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Please provide section (e.g., A, B, C)'],
      trim: true,
      uppercase: true,
      default: 'A',
    },
    roll_number: {
      type: String,
      trim: true,
      default: '',
    },
    guardian_name: {
      type: String,
      required: [true, 'Please provide guardian/parent name'],
      trim: true,
    },
    guardian_contact: {
      type: String,
      required: [true, 'Please provide guardian contact number'],
      trim: true,
    },
    guardian_email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    admission_status: {
      type: String,
      enum: {
        values: ['enquiry', 'assessment', 'enrolled', 'tc_issued'],
        message: '{VALUE} is not a valid status. Allowed: enquiry, assessment, enrolled, tc_issued',
      },
      default: 'enrolled',
    },
    dob: {
      type: Date,
      required: [true, 'Please provide date of birth'],
    },
    admission_date: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup by class and section
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ admission_status: 1 });

module.exports = mongoose.model('Student', studentSchema);
