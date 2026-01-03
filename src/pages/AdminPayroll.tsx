import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { DollarSign, Users, Edit2, X } from 'lucide-react';
import { calculateSalary, getSalaryData, saveSalaryData, initializeDefaultSalaries, SalaryStructure } from '../utils/salaryCalculations';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

const EMPLOYEES_INFO = [
  { id: '1', employeeId: 'EMP001', name: 'John Doe', department: 'Engineering' },
  { id: '2', employeeId: 'EMP002', name: 'Jane Smith', department: 'Human Resources' },
  { id: '3', employeeId: 'EMP003', name: 'New Employee', department: 'Marketing' },
  { id: '4', employeeId: 'EMP004', name: 'Alice Johnson', department: 'Sales' },
  { id: '5', employeeId: 'EMP005', name: 'Bob Wilson', department: 'Engineering' },
];

export default function AdminPayroll() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeIdFromUrl = searchParams.get('employeeId');
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingSalary, setEditingSalary] = useState(false);
  const [newBaseSalary, setNewBaseSalary] = useState('');
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);

  useEffect(() => {
    initializeDefaultSalaries();
    loadEmployeesData();
  }, []);

  useEffect(() => {
    // If employeeId is in URL, auto-select that employee
    if (employeeIdFromUrl && employees.length > 0) {
      const employee = employees.find(e => e.employeeId === employeeIdFromUrl);
      if (employee) {
        handleSelectEmployee(employee);
      }
    }
  }, [employeeIdFromUrl, employees]);

  const loadEmployeesData = () => {
    const employeeList: Employee[] = EMPLOYEES_INFO.map(emp => {
      const salaryData = getSalaryData(emp.employeeId);
      return {
        ...emp,
        baseSalary: salaryData?.baseSalary || 0,
        allowances: salaryData?.allowances || 0,
        deductions: salaryData?.totalDeductions || 0,
        netSalary: salaryData?.netSalary || 0,
      };
    });
    setEmployees(employeeList);
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    const salaryData = getSalaryData(employee.employeeId);
    setSalaryStructure(salaryData);
    setEditingSalary(false);
  };

  const handleEditSalary = () => {
    setEditingSalary(true);
    setNewBaseSalary(selectedEmployee?.baseSalary.toString() || '');
  };

  const handleSaveSalary = () => {
    if (!selectedEmployee || !newBaseSalary) return;

    const baseSalary = parseInt(newBaseSalary);
    if (isNaN(baseSalary) || baseSalary < 0) {
      alert('Please enter a valid salary amount');
      return;
    }

    const updatedSalary = saveSalaryData(selectedEmployee.employeeId, baseSalary);
    setSalaryStructure(updatedSalary);
    setEditingSalary(false);
    
    // Reload employees data
    loadEmployeesData();
    
    // Update selected employee
    setSelectedEmployee({
      ...selectedEmployee,
      baseSalary: updatedSalary.baseSalary,
      allowances: updatedSalary.allowances,
      deductions: updatedSalary.totalDeductions,
      netSalary: updatedSalary.netSalary,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.netSalary, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Payroll Management</h1>
          <p className="text-sm text-gray-600">Manage employee compensation and salary structures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Employees</span>
              <Users className="w-5 h-5 text-[#714B67]" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{employees.length}</div>
            <div className="text-xs text-gray-500 mt-1">Active workforce</div>
          </div>

          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Annual Payroll</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(totalPayroll)}</div>
            <div className="text-xs text-gray-500 mt-1">Sum of all salaries</div>
          </div>

          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Average Salary</span>
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(employees.length > 0 ? totalPayroll / employees.length : 0)}</div>
            <div className="text-xs text-gray-500 mt-1">Per employee</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#714B67]" />
              <h2 className="text-gray-900">Employee Salary Overview</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(employee.baseSalary)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(employee.allowances)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(employee.deductions)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(employee.netSalary)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSelectEmployee(employee)}
                        className="text-sm text-[#714B67] hover:text-[#5f3f58]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedEmployee && salaryStructure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Salary Details - {selectedEmployee.name}</h2>
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setSalaryStructure(null);
                  setEditingSalary(false);
                  
                  // If came from employee profile, go back to it
                  if (employeeIdFromUrl) {
                    navigate(`/employee/${employeeIdFromUrl}`);
                  }
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Employee ID</div>
                  <div className="text-gray-900">{selectedEmployee.employeeId}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Department</div>
                  <div className="text-gray-900">{selectedEmployee.department}</div>
                </div>
              </div>

              {editingSalary ? (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Base Salary</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="baseSalary" className="block text-sm text-gray-700 mb-2">
                        Annual Base Salary
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          id="baseSalary"
                          value={newBaseSalary}
                          onChange={(e) => setNewBaseSalary(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                          placeholder="85000"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Other amounts will be calculated automatically based on this value
                      </p>
                    </div>

                    {newBaseSalary && parseInt(newBaseSalary) > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded p-4">
                        <div className="text-xs text-gray-600 mb-2">Preview Calculation:</div>
                        <div className="space-y-2 text-sm">
                          {(() => {
                            const preview = calculateSalary(parseInt(newBaseSalary));
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-700">Base Salary:</span>
                                  <span className="font-medium">{formatCurrency(preview.baseSalary)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-700">Allowances (12%):</span>
                                  <span className="font-medium">{formatCurrency(preview.allowances)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-700">Bonus:</span>
                                  <span className="font-medium">{formatCurrency(preview.bonus)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-purple-300">
                                  <span className="text-gray-700">Total Earnings:</span>
                                  <span className="font-medium">{formatCurrency(preview.totalEarnings)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-purple-300">
                                  <span>Tax (20%):</span>
                                  <span>-{formatCurrency(preview.tax)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span>Insurance:</span>
                                  <span>-{formatCurrency(preview.insurance)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span>Retirement (7%):</span>
                                  <span>-{formatCurrency(preview.retirement)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-purple-300 font-semibold">
                                  <span className="text-gray-900">Net Annual Salary:</span>
                                  <span className="text-[#714B67]">{formatCurrency(preview.netSalary)}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingSalary(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSalary}
                        className="flex-1 px-4 py-2 bg-[#714B67] text-white rounded hover:bg-[#5f3f58] transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm text-gray-600 mb-3">Compensation Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Base Salary</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(salaryStructure.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Allowances (12%)</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(salaryStructure.allowances)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Performance Bonus</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(salaryStructure.bonus)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="text-gray-900 font-medium">Total Earnings</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(salaryStructure.totalEarnings)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm text-gray-600 mb-3">Deductions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Income Tax (20%)</span>
                        <span className="text-gray-900">-{formatCurrency(salaryStructure.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Health Insurance</span>
                        <span className="text-gray-900">-{formatCurrency(salaryStructure.insurance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Retirement 401(k) (7%)</span>
                        <span className="text-gray-900">-{formatCurrency(salaryStructure.retirement)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="text-gray-900 font-medium">Total Deductions</span>
                        <span className="text-gray-900 font-medium">-{formatCurrency(salaryStructure.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">Net Annual Salary</span>
                      <span className="text-2xl text-[#714B67] font-semibold">{formatCurrency(salaryStructure.netSalary)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Monthly: {formatCurrency(salaryStructure.netSalary / 12)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleEditSalary}
                      className="flex items-center gap-2 px-4 py-2 bg-[#714B67] text-white rounded hover:bg-[#5f3f58] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Update Salary
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}