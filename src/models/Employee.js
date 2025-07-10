import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  employeeId: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  position: String,
  department: String,
  salary: Number,
  hireDate: Date,
  birthDate: Date,
  address: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  status: { type: String, default: 'active' },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
