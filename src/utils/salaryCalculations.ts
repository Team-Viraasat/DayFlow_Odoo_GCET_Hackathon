// Salary calculation utilities
export interface SalaryStructure {
  employeeId: string;
  baseSalary: number;
  allowances: number;
  bonus: number;
  totalEarnings: number;
  tax: number;
  insurance: number;
  retirement: number;
  totalDeductions: number;
  netSalary: number;
}

export function calculateSalary(baseSalary: number): SalaryStructure {
  // Allowances: 12% of base salary
  const allowances = Math.round(baseSalary * 0.12);
  
  // Performance bonus: Fixed at $5000
  const bonus = 5000;
  
  // Total earnings
  const totalEarnings = baseSalary + allowances + bonus;
  
  // Tax: 20% of total earnings
  const tax = Math.round(totalEarnings * 0.20);
  
  // Health Insurance: Fixed at $3000
  const insurance = 3000;
  
  // Retirement (401k): 7% of base salary
  const retirement = Math.round(baseSalary * 0.07);
  
  // Total deductions
  const totalDeductions = tax + insurance + retirement;
  
  // Net salary
  const netSalary = totalEarnings - totalDeductions;
  
  return {
    employeeId: '',
    baseSalary,
    allowances,
    bonus,
    totalEarnings,
    tax,
    insurance,
    retirement,
    totalDeductions,
    netSalary,
  };
}

export function getSalaryData(employeeId: string): SalaryStructure | null {
  const stored = localStorage.getItem('salaryData');
  if (stored) {
    const salaries = JSON.parse(stored);
    return salaries[employeeId] || null;
  }
  return null;
}

export function saveSalaryData(employeeId: string, baseSalary: number): SalaryStructure {
  const salaryStructure = calculateSalary(baseSalary);
  salaryStructure.employeeId = employeeId;
  
  const stored = localStorage.getItem('salaryData');
  const salaries = stored ? JSON.parse(stored) : {};
  salaries[employeeId] = salaryStructure;
  localStorage.setItem('salaryData', JSON.stringify(salaries));
  
  return salaryStructure;
}

// Initialize default salaries for demo employees
export function initializeDefaultSalaries() {
  const stored = localStorage.getItem('salaryData');
  if (!stored) {
    const defaultSalaries = {
      'EMP001': calculateSalary(85000),
      'EMP002': calculateSalary(120000),
      'EMP003': calculateSalary(75000),
      'EMP004': calculateSalary(90000),
      'EMP005': calculateSalary(95000),
    };
    
    // Add employee IDs
    Object.keys(defaultSalaries).forEach(empId => {
      defaultSalaries[empId].employeeId = empId;
    });
    
    localStorage.setItem('salaryData', JSON.stringify(defaultSalaries));
  }
}
