const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['present', 'absent', 'leave'],
        message: '{VALUE} is not a valid status. Allowed: present, absent, leave',
      },
      default: 'present',
    },
    marked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User who marked attendance is required'],
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

// Compound index on student_id and date for quick student history lookups
attendanceSchema.index({ student_id: 1, date: 1 });
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
