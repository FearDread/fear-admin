const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

const userSchema = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: { type: String, required: true, minlength: 8, select: false },
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    displayName: { type: String, trim: true },
    avatar: {
        type: Object, required: false, default: {
            public_id: '',
            secure_url: '',
        }, trim: true
    },
    bio: { type: String, maxlength: 500 },
    dateOfBirth: Date,
    mobile: { type: String, trim: true, unique: false, required: false },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'], default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'deleted'], default: 'active'
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordChangedAt: Date,
    twoFactorSecret: { type: String, select: false },
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
        provider: {
            type: String,
            enum: ['google', 'facebook', 'github', 'apple']
        },
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
//userSchema.index({ email: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });
userSchema.index({ status: 1, role: 1 });

// Virtual for full name
userSchema.virtual('profile.fullName').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function () {
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
userSchema.methods.resetLoginAttempts = async function () {
    return await this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

// Generate a password reset token.
// Returns the PLAIN token (email this to the user); only its SHA-256 hash is stored.
// Caller must save the document afterwards: await user.save({ validateBeforeSave: false })
userSchema.methods.createPasswordResetToken = function (ttlMs = PASSWORD_RESET_TTL_MS) {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + ttlMs);
    return token;
};

// Clear any outstanding password reset token
userSchema.methods.clearPasswordResetToken = function () {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
};

// Check whether the user's JWT (iat in seconds) predates their last password change
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
    if (!this.passwordChangedAt) return false;
    return jwtIssuedAt < Math.floor(this.passwordChangedAt.getTime() / 1000);
};

// Find a user by a plain reset token, only if it has not expired
userSchema.statics.findByPasswordResetToken = function (token) {
    const hashed = crypto.createHash('sha256').update(String(token)).digest('hex');
    return this.findOne({
        passwordResetToken: hashed,
        passwordResetExpires: { $gt: Date.now() }
    }).select('+password +passwordResetToken +passwordResetExpires');
};

// Complete a reset: validates token, sets new password (hashed by pre-save hook),
// clears the token, and unlocks the account. Returns the user, or null if invalid/expired.
userSchema.statics.resetPasswordWithToken = async function (token, newPassword) {
    const user = await this.findByPasswordResetToken(token);
    if (!user) return null;

    user.password = newPassword;
    user.clearPasswordResetToken();
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    return user;
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.twoFactorSecret;
    delete obj.emailVerificationToken;
    delete obj.emailVerificationExpires;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    delete obj.passwordChangedAt;
    delete obj.loginAttempts;
    delete obj.lockUntil;
    return obj;
};

module.exports = mongoose.model('User', userSchema);