
/**
 * Input validation utilities
 */
const ValidationService = {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is email valid
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result
   */
   validatePassword: (password) => {
    if (!password) {
      return { isValid: false, message: "Password is required" };
    }
    if (password.length < 6) {
      return { isValid: false, message: "Password must be at least 6 characters long" };
    }
    return { isValid: true };
  },

  /**
   * Validate login input
   * @param {object} data - Login data
   * @returns {object} Validation result
   */
    validateLoginInput: ({ email, password }) => {
    if (!email || !password) {
      return { isValid: false, message: "Email and password are required" };
    }
    if (!ValidationService.isValidEmail(email)) {
      return { isValid: false, message: "Please provide a valid email address" };
    }
    return { isValid: true };
  },

  /**
   * Validate registration input
   * @param {object} data - Registration data
   * @returns {object} Validation result
   */
   validateRegistrationInput: (data) => {
    const { email, password, firstname, lastname, name } = data;

    if (!email) {
      return { isValid: false, message: "Email is required" };
    }

    if (!ValidationService.isValidEmail(email)) {
      return { isValid: false, message: "Please provide a valid email address" };
    }

    const passwordValidation = ValidationService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }

    const fullName = firstname && lastname ? `${firstname} ${lastname}` : name;
    if (!fullName) {
      return { isValid: false, message: "Name is required" };
    }

    return { isValid: true, name: fullName };
  }
}

exports.ValidationService = ValidationService;
module.exports = ValidationService;