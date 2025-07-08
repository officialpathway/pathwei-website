// src/admin/utils/validators.ts

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Required field validation
 */
export function validateRequired(value: unknown, fieldName: string): ValidationError | null {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
}

/**
 * Minimum length validation
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): ValidationError | null {
  if (value && value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters long`,
    };
  }
  return null;
}

/**
 * Maximum length validation
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationError | null {
  if (value && value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be no more than ${maxLength} characters long`,
    };
  }
  return null;
}

/**
 * Numeric validation
 */
export function validateNumeric(value: string, fieldName: string): ValidationError | null {
  if (value && isNaN(Number(value))) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid number`,
    };
  }
  return null;
}

/**
 * Positive number validation
 */
export function validatePositiveNumber(
  value: string | number,
  fieldName: string
): ValidationError | null {
  const num = typeof value === 'string' ? Number(value) : value;
  if (!isNaN(num) && num <= 0) {
    return {
      field: fieldName,
      message: `${fieldName} must be a positive number`,
    };
  }
  return null;
}

/**
 * Date validation
 */
export function validateDate(value: string, fieldName: string): ValidationError | null {
  if (value && isNaN(Date.parse(value))) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid date`,
    };
  }
  return null;
}

/**
 * URL validation
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Enum validation
 */
export function validateEnum<T>(
  value: T,
  allowedValues: readonly T[],
  fieldName: string
): ValidationError | null {
  if (!allowedValues.includes(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
    };
  }
  return null;
}

/**
 * Comprehensive form validation
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, ((value: unknown) => ValidationError | null)[]>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, validators] of Object.entries(rules)) {
    const value = data[field];

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors.push(error);
        break; // Stop at first error for this field
      }
    }
  }

  return errors;
}