const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: { type: String, required: true, minlength: 8, select: false },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  displayName: { type: String, trim: true },
  avatar: { type: Object, required: false, default: {
      public_id: '',
      secure_url: '',
    }, trim: true
  },
  bio: { type: String, maxlength: 500 },
  dateOfBirth: Date,
  phoneNumber: { type: String, trim: true },
  role: { type: String, 
    enum: ['user', 'admin', 'moderator'], default: 'user' },
  status: { type: String, 
    enum: ['active', 'inactive', 'suspended', 'deleted'], default: 'active' },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorSecret: { type: String, select: false},
  twoFactorEnabled: { type: Boolean, default: false },
  preferences: {
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' }
  },
  socialAccounts: [{
    provider: { type: String,
      enum: ['google', 'facebook', 'github', 'apple']},
    providerId: String,
    email: String,
    connectedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastLoginAt: Date,
  lastLoginIP: String,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ status: 1, role: 1 });

// Virtual for full name
userSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return await this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

module.exports = mongoose.model('User', userSchema);