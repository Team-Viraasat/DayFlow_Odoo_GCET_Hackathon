import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    name: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Check if employee ID already exists
    const existingUsers = localStorage.getItem('registeredUsers');
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    
    if (users.some((u: any) => u.employeeId === formData.employeeId)) {
      setError('Employee ID already exists');
      setLoading(false);
      return;
    }

    if (users.some((u: any) => u.email === formData.email)) {
      setError('Email already registered');
      setLoading(false);
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      employeeId: formData.employeeId,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      department: formData.department,
      needsOnboarding: false,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    setLoading(false);
    
    alert('Account created successfully! You can now log in with your credentials.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Header */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-[#714B67] rounded mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Sign Up</h1>
          <p className="text-sm text-gray-500">Create your DayFlow account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Employee ID *
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="EMP001"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">HR / Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Min 8 chars with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Confirm Password *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              required
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#714B67] text-white py-2 rounded text-sm font-medium hover:bg-[#5f3f58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-[#714B67] hover:text-[#5f3f58]"
            >
              Already have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}