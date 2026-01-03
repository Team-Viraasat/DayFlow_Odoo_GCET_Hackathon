import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { getSalaryData } from '../utils/salaryCalculations';

export default function EmployeePayroll() {
  const { currentUser } = useAuth();
  const [salaryData, setSalaryData] = useState<any>(null);

  useEffect(() => {
    if (currentUser?.employeeId) {
      const data = getSalaryData(currentUser.employeeId);
      setSalaryData(data);
    }
  }, [currentUser]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!salaryData) {
    return (
      <Layout>
        <div className="max-w-3xl">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Payroll</h1>
            <p className="text-sm text-gray-500">View your salary information</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-12 text-center">
            <p className="text-sm text-gray-500">No salary information available</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Payroll</h1>
          <p className="text-sm text-gray-500">View your salary information</p>
        </div>

        {/* Salary Overview */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Salary Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Base Salary</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(salaryData.baseSalary)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Gross Salary</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(salaryData.grossSalary)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Deductions</span>
              <span className="text-sm font-medium text-red-600">-{formatCurrency(salaryData.totalDeductions)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-purple-50 -mx-6 px-6 mt-3">
              <span className="text-sm font-semibold text-gray-900">Net Salary</span>
              <span className="text-lg font-semibold text-purple-600">{formatCurrency(salaryData.netSalary)}</span>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Earnings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Base Salary</span>
              <span className="text-gray-900">{formatCurrency(salaryData.baseSalary)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">HRA ({salaryData.hraPercent}%)</span>
              <span className="text-gray-900">{formatCurrency(salaryData.hra)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Special Allowance</span>
              <span className="text-gray-900">{formatCurrency(salaryData.specialAllowance)}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total Earnings</span>
              <span className="font-medium text-gray-900">{formatCurrency(salaryData.grossSalary)}</span>
            </div>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="bg-white border border-gray-200 rounded p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Deductions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Provident Fund ({salaryData.pfPercent}%)</span>
              <span className="text-gray-900">{formatCurrency(salaryData.pf)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Professional Tax</span>
              <span className="text-gray-900">{formatCurrency(salaryData.professionalTax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Income Tax (TDS)</span>
              <span className="text-gray-900">{formatCurrency(salaryData.incomeTax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total Deductions</span>
              <span className="font-medium text-red-600">{formatCurrency(salaryData.totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}