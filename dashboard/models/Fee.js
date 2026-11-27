const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    term: {
      type: String,
      required: [true, 'Fee term is required (e.g., Term 1, April-June)'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Fee amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    concession: {
      type: Number,
      default: 0,
      min: [0, 'Concession cannot be negative'],
    },
    paid_amount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    paid_status: {
      type: String,
      enum: {
        values: ['paid', 'partial', 'due'],
        message: '{VALUE} is not a valid fee status. Allowed: paid, partial, due',
      },
      default: 'due',
    },
    receipt_url: {
      type: String,
      trim: true,
      default: '',
    },
    paid_date: {
      type: Date,
      default: null,
    },
    due_date: {
      type: Date,
      default: null,
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'Online', 'Cheque', 'UPI', 'Bank Transfer', 'N/A'],
      default: 'N/A',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

feeSchema.index({ student_id: 1, term: 1 });
feeSchema.index({ paid_status: 1 });

module.exports = mongoose.model('Fee', feeSchema);
