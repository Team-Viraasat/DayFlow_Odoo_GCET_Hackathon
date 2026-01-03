import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User, Mail, Phone, Briefcase, ChevronRight } from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  profilePhoto?: string;
  address?: string;
}

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    // Load from mock users and registered users
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

    // Add registered users
    const registered = localStorage.getItem('registeredUsers');
    if (registered) {
      const registeredUsers = JSON.parse(registered);
      registeredUsers.forEach((user: any) => {
        if (!mockEmployees.find(e => e.employeeId === user.employeeId)) {
          mockEmployees.push({
            id: user.id,
            employeeId: user.employeeId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            department: user.department,
            role: user.role,
            address: user.address,
            profilePhoto: user.profilePhoto,
          });
        }
      });
    }

    setEmployees(mockEmployees);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Employee Management</h1>
          <p className="text-sm text-gray-600">View and manage all employees</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 p-4">
          <input
            type="text"
            placeholder="Search by name, employee ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
          />
        </div>

        {/* Employee Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} found
          </p>
        </div>

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => navigate(`/employee/${employee.employeeId}`)}
              className="bg-white border border-gray-200 p-6 hover:border-[#714B67] hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start gap-4">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {employee.profilePhoto ? (
                    <img
                      src={employee.profilePhoto}
                      alt={employee.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#714B67] flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                {/* Employee Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{employee.name}</h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{employee.employeeId}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    
                    {employee.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-50 text-[#714B67] border border-purple-200 rounded">
                      {employee.department}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No employees found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
