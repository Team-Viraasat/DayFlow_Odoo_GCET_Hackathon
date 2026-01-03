import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { DollarSign, Users, Edit2, X } from 'lucide-react';
import {
  calculateSalary,
  getSalaryData,
  saveSalaryData,
  initializeDefaultSalaries,
  SalaryStructure,
} from '../utils/salaryCalculations';

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
  const [searchParams] = useSearchParams();
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
    if (employeeIdFromUrl && employees.length > 0) {
      const emp = employees.find(e => e.employeeId === employeeIdFromUrl);
      if (emp) handleSelectEmployee(emp);
    }
  }, [employeeIdFromUrl, employees]);

  const loadEmployeesData = () => {
    const list = EMPLOYEES_INFO.map(emp => {
      const salary = getSalaryData(emp.employeeId);
      return {
        ...emp,
        baseSalary: salary?.baseSalary || 0,
        allowances: salary?.allowances || 0,
        deductions: salary?.totalDeductions || 0,
        netSalary: salary?.netSalary || 0,
      };
    });
    setEmployees(list);
  };

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setSalaryStructure(getSalaryData(emp.employeeId));
    setEditingSalary(false);
  };

  const handleEditSalary = () => {
    setEditingSalary(true);
    setNewBaseSalary(selectedEmployee?.baseSalary.toString() || '');
  };

  const handleSaveSalary = () => {
    if (!selectedEmployee || !newBaseSalary) return;
    const base = parseInt(newBaseSalary);
    if (isNaN(base) || base < 0) return alert('Invalid salary');
    const updated = saveSalaryData(selectedEmployee.employeeId, base);
    setSalaryStructure(updated);
    setEditingSalary(false);
    loadEmployeesData();
    setSelectedEmployee({
      ...selectedEmployee,
      baseSalary: updated.baseSalary,
      allowances: updated.allowances,
      deductions: updated.totalDeductions,
      netSalary: updated.netSalary,
    });
  };

  /** ✅ INR formatter */
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}`;

  const totalPayroll = employees.reduce((sum, e) => sum + e.netSalary, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Payroll Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border p-5">
            <span>Total Employees</span>
            <div className="text-2xl font-semibold">{employees.length}</div>
          </div>

          <div className="bg-white border p-5">
            <span>Total Payroll</span>
            <div className="text-2xl font-semibold">{formatCurrency(totalPayroll)}</div>
          </div>

          <div className="bg-white border p-5">
            <span>Average Salary</span>
            <div className="text-2xl font-semibold">
              {formatCurrency(employees.length ? totalPayroll / employees.length : 0)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
