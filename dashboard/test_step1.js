require('dotenv').config();
const models = require('./models');

console.log('--- DPS SCHOOL ERP - STEP 1 VERIFICATION ---');
console.log('Loaded Models:', Object.keys(models));

// Verify Schema Fields
const schemas = {
  User: Object.keys(models.User.schema.paths),
  Student: Object.keys(models.Student.schema.paths),
  AdmissionEnquiry: Object.keys(models.AdmissionEnquiry.schema.paths),
  Attendance: Object.keys(models.Attendance.schema.paths),
  Fee: Object.keys(models.Fee.schema.paths),
  Notice: Object.keys(models.Notice.schema.paths),
  Gallery: Object.keys(models.Gallery.schema.paths),
  Staff: Object.keys(models.Staff.schema.paths),
};

console.log('\n--- MODEL SCHEMA PATHS ---');
for (const [modelName, paths] of Object.entries(schemas)) {
  console.log(`✓ ${modelName} (${paths.length} fields): ${paths.slice(0, 6).join(', ')}...`);
}

console.log('\nStep 1 verified successfully!');
