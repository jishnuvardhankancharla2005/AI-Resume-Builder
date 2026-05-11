import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  personal_info: { type: mongoose.Schema.Types.Mixed, default: {} },
  professional_summary: { type: String, default: '' },
  experience: { type: Array, default: [] },
  education: { type: Array, default: [] },
  project: { type: Array, default: [] },
  skills: { type: Array, default: [] },
  template: { type: String, default: 'classic' },
  accent_color: { type: String, default: '#3B82F6' },
  public: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
