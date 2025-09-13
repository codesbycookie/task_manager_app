import { toast } from "react-toastify";

// Capitalizes error messages (e.g., "admin_name" → "Admin Name")
export const capitalize = (s) => {
  return s[0].toUpperCase() + s.slice(1).split("_").join(" ");
};

// Generic form validation function
export const validateForm = (formData, rules) => {
  let checked = true;
  let errors = {};

  for (let key in rules) {
    const value = formData[key];
    const rule = rules[key];

    // Required Field Check
    if (
      rule.required &&
      (value === "" || value === null || value === undefined)
    ) {
      errors[key] = `${capitalize(key)} is required.`;
      checked = false;
    }

    // Min Length Check
    if (rule.minLength && value?.length < rule.minLength) {
      errors[key] = `${capitalize(key)} must be at least ${
        rule.minLength
      } characters.`;
      checked = false;
    }

    // Max Length Check
    if (rule.maxLength && value?.length > rule.maxLength) {
      errors[key] = `${capitalize(key)} must be less than ${
        rule.maxLength
      } characters.`;
      checked = false;
    }

    // Number Validation
    if (rule.isNumber && isNaN(value)) {
      errors[key] = `${capitalize(key)} must be a number.`;
      checked = false;
    }

    // Email Validation
    if (rule.isEmail && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[key] = "Invalid email address.";
      checked = false;
    }

    // Password Matching
    if (rule.matches && formData[rule.matches] !== value) {
      errors[key] = `${capitalize(key)} does not match.`;
      checked = false;
    }

    // Custom Validator Function
    if (rule.custom && typeof rule.custom === "function") {
      const customError = rule.custom(value, formData);
      if (customError) {
        errors[key] = customError;
        checked = false;
      }
    }
  }

  // Show errors using toast
  if (!checked) {
    Object.values(errors).forEach((err) => toast.error(err));
  }

  return { checked, errors };
};
