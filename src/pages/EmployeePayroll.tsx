import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { getSalaryData } from '../utils/salaryCalculations';

export default function EmployeePayroll() {
  const { currentUser } = useAuth();
  const [salaryData, setSalaryData] = useState<any>(null);

  useEffect(() => {
    if (currentUser?.employeeId) {
      setSalaryData(getSalaryData(currentUser.employeeId));
    }
  }, [currentUser]);

  /** ✅ INR formatter */
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}`;

  if (!salaryData) {
    return (
      <Layout>
        <p>No salary information available</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <h1 className="text-xl font-semibold mb-4">Payroll</h1>

        <div className="bg-white border p-6 mb-4">
          <div className="flex justify-between">
            <span>Base Salary</span>
            <span>{formatCurrency(salaryData.baseSalary)}</span>
          </div>

          <div className="flex justify-between mt-2 font-semibold">
            <span>Net Salary</span>
            <span>{formatCurrency(salaryData.netSalary)}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
