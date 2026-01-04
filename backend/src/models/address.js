const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['home', 'work', 'billing', 'shipping', 'other'], default: 'billing' },
  isDefault: { type: Boolean, default: false },
  name: { type: String, trim: true, maxlength: 50 },
  line1: { type: String, required: true, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, default: 'US', uppercase: true },
  coordinates: { type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }},
  phoneNumber: { type: String, trim: true },
  deliveryInstructions: { type: String, trim: true, maxlength: 500 }
}, {
  timestamps: true
});

// Indexes
addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.index({ coordinates: '2dsphere' });

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

module.exports = mongoose.model('Address', addressSchema);