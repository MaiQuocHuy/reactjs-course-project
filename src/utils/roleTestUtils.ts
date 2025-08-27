// Utility functions for testing role name transformation

export const testRoleNameTransformation = () => {
  const testCases = [
    { input: 'admin user', expected: 'ADMIN USER' },
    { input: 'Student Role', expected: 'STUDENT ROLE' },
    { input: 'INSTRUCTOR', expected: 'INSTRUCTOR' },
    { input: 'super Admin', expected: 'SUPER ADMIN' },
    { input: '  content manager  ', expected: 'CONTENT MANAGER' },
    { input: 'teacher-assistant', expected: 'TEACHER-ASSISTANT' },
  ];

  console.log('Testing role name transformation:');
  
  testCases.forEach(({ input, expected }) => {
    const result = input.toUpperCase().trim();
    const passed = result === expected;
    console.log(`Input: "${input}" -> Result: "${result}" -> Expected: "${expected}" -> ${passed ? 'PASS' : 'FAIL'}`);
  });
};

export const validateRoleNameFormat = (name: string): { isValid: boolean; message?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Role name cannot be empty' };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Role name must be at least 2 characters long' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, message: 'Role name cannot exceed 50 characters' };
  }

  // Check for special characters that might cause issues
  const hasInvalidChars = /[<>\"'&]/.test(trimmedName);
  if (hasInvalidChars) {
    return { isValid: false, message: 'Role name contains invalid characters' };
  }

  return { isValid: true };
};
