const validationService = require('../js/validationService');
const employeeService = require('../js/employeeService');

describe('validationService', () => {
  beforeEach(() => {
    employeeService.getAll = jest.fn().mockResolvedValue({ data: [] });
  });

  test('validateSignup returns username error when missing', () => {
    const errors = validationService.validateSignup('', 'password123', 'password123');

    expect(errors.username).toBe('Username required');
  });

  test('validateLogin returns password error when missing', () => {
    const errors = validationService.validateLogin('user1', '');

    expect(errors.password).toBe('Password required');
  });

  test('validateEmployee detects duplicate email', async () => {
    employeeService.getAll = jest.fn().mockResolvedValue({
      data: [{ id: 5, email: 'john@example.com' }]
    });

    const data = {
      id: 10,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      department: 'Engineering',
      designation: 'Developer',
      salary: 60000,
      joinDate: '2025-01-01',
      status: 'Active'
    };

    const errors = await validationService.validateEmployee(data);

    expect(errors.email).toBe('Email already exists');
  });

  test('mapServerErrors converts API error object to field messages', () => {
    const mapped = validationService.mapServerErrors({
      errors: {
        email: ['Email already exists'],
        salary: ['Salary must be greater than 0']
      }
    });

    expect(mapped).toEqual({
      email: 'Email already exists',
      salary: 'Salary must be greater than 0'
    });
  });
});
