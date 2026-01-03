import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, Edit2, X, Upload, ArrowLeft } from 'lucide-react';
import { getSalaryData, saveSalaryData } from '../utils/salaryCalculations';

interface EmployeeData {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  department: string;
  role: string;
  profilePhoto?: string;
}

export default function EmployeeProfile() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EmployeeData>>({});
  const [salaryInfo, setSalaryInfo] = useState<any>(null);

  const isAdmin = currentUser?.role === 'admin';
  const isOwnProfile = currentUser?.employeeId === employeeId;

  useEffect(() => {
    loadEmployeeData();
  }, [employeeId]);

  const loadEmployeeData = () => {
    // Mock employee data
    const mockEmployees = [
      {
        id: '1',
        employeeId: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@dayflow.com',
        phone: '+1-555-0123',
        department: 'Engineering',
        role: 'employee',
        address: '123 Main St, San Francisco, CA',
      },
      {
        id: '2',
        employeeId: 'EMP002',
        name: 'Jane Smith',
        email: 'jane.smith@dayflow.com',
        phone: '+1-555-0124',
        department: 'Human Resources',
        role: 'admin',
        address: '456 Oak Ave, San Francisco, CA',
      },
      {
        id: '3',
        employeeId: 'EMP003',
        name: 'New Employee',
        email: 'new.employee@dayflow.com',
        department: 'Marketing',
        role: 'employee',
      },
      {
        id: '4',
        employeeId: 'EMP004',
        name: 'Alice Johnson',
        email: 'alice.johnson@dayflow.com',
        phone: '+1-555-0125',
        department: 'Sales',
        role: 'employee',
        address: '789 Pine St, San Francisco, CA',
      },
      {
        id: '5',
        employeeId: 'EMP005',
        name: 'Bob Wilson',
        email: 'bob.wilson@dayflow.com',
        phone: '+1-555-0126',
        department: 'Engineering',
        role: 'employee',
        address: '321 Elm St, San Francisco, CA',
      },
    ];

    let foundEmployee = mockEmployees.find(e => e.employeeId === employeeId);

    // Check registered users
    const registered = localStorage.getItem('registeredUsers');
    if (registered && !foundEmployee) {
      const registeredUsers = JSON.parse(registered);
      foundEmployee = registeredUsers.find((u: any) => u.employeeId === employeeId);
    }

    if (foundEmployee) {
      setEmployee(foundEmployee);
      setFormData(foundEmployee);

      // Load salary data if admin
      if (isAdmin && employeeId) {
        const salary = getSalaryData(employeeId);
        setSalaryInfo(salary);
      }
    }
  };

  const handleSave = () => {
    if (!employee) return;

    const updated = { ...employee, ...formData };
    setEmployee(updated);

    // Update in localStorage if it's a registered user
    const registered = localStorage.getItem('registeredUsers');
    if (registered) {
      const users = JSON.parse(registered);
      const index = users.findIndex((u: any) => u.employeeId === employeeId);
      if (index !== -1) {
        users[index] = { ...users[index], ...formData };
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
    }

    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!employee) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Employee not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#714B67] hover:text-[#5f3f58]"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const canEdit = isAdmin || isOwnProfile;

  return (
    <Layout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Employee Profile</h1>
              <p className="text-sm text-gray-600">{employee.name} • {employee.employeeId}</p>
            </div>
          </div>
          
          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#714B67] text-white text-sm hover:bg-[#5f3f58] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}

          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(employee);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#714B67] text-white text-sm hover:bg-[#5f3f58] transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Photo Section */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Profile Photo</h3>
          <div className="flex items-center gap-4">
            {formData.profilePhoto || employee.profilePhoto ? (
              <img
                src={formData.profilePhoto || employee.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#714B67] flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            {isEditing && canEdit && (
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Name</label>
              {isEditing && isAdmin ? (
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900">{employee.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <div className="px-3 py-2 text-gray-600 bg-gray-50 rounded border border-gray-200">
                {employee.email}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Phone</label>
              {isEditing && canEdit ? (
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900">{employee.phone || 'Not provided'}</div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Address</label>
              {isEditing && canEdit ? (
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent resize-none"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900">{employee.address || 'Not provided'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Job Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Employee ID</label>
              <div className="px-3 py-2 text-gray-600 bg-gray-50 rounded border border-gray-200">
                {employee.employeeId}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Role</label>
              {isEditing && isAdmin ? (
                <select
                  value={formData.role || employee.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">HR / Admin</option>
                </select>
              ) : (
                <div className="px-3 py-2 text-gray-600 bg-gray-50 rounded border border-gray-200">
                  {employee.role === 'admin' ? 'HR / Admin' : 'Employee'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Department</label>
              {isEditing && isAdmin ? (
                <select
                  value={formData.department || employee.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              ) : (
                <div className="px-3 py-2 text-gray-600 bg-gray-50 rounded border border-gray-200">
                  {employee.department}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Salary Information - Admin Only */}
        {isAdmin && salaryInfo && (
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Salary Information</h3>
              <button
                onClick={() => navigate(`/payroll?employeeId=${employeeId}`)}
                className="text-sm text-[#714B67] hover:text-[#5f3f58]"
              >
                Manage Salary →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Base Salary</div>
                <div className="text-gray-900 font-medium">{formatCurrency(salaryInfo.baseSalary)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Net Salary</div>
                <div className="text-gray-900 font-medium">{formatCurrency(salaryInfo.netSalary)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}