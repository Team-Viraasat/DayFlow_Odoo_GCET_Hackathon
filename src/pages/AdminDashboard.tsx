import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Users, Calendar, FileCheck, DollarSign, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 5,
    presentToday: 0,
    pendingLeaves: 0,
    totalPayroll: 0,
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    // Calculate present today
    const today = new Date().toISOString().split('T')[0];
    let presentCount = 0;
    
    for (let i = 1; i <= 5; i++) {
      const attendance = localStorage.getItem(`attendance_${i}`);
      if (attendance) {
        const records = JSON.parse(attendance);
        const todayRecord = records.find((r: any) => r.date === today);
        if (todayRecord?.status === 'Present') {
          presentCount++;
        }
      }
    }

    // Calculate pending leaves
    const leaveRequests = localStorage.getItem('leaveRequests');
    const pendingCount = leaveRequests 
      ? JSON.parse(leaveRequests).filter((r: any) => r.status === 'Pending').length 
      : 0;

    setStats({
      totalEmployees: 5,
      presentToday: presentCount,
      pendingLeaves: pendingCount,
      totalPayroll: 450000,
    });
  };

  const quickStats = [
    {
      label: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-[#714B67]',
    },
    {
      label: 'Present Today',
      value: stats.presentToday,
      icon: Calendar,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: AlertCircle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Total Payroll',
      value: `$${(stats.totalPayroll / 1000).toFixed(0)}K`,
      icon: DollarSign,
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
  ];

  const modules = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'View and manage employee records',
      path: '/employees',
    },
    {
      icon: Calendar,
      title: 'Attendance Records',
      description: 'Monitor employee attendance',
      path: '/attendance',
    },
    {
      icon: FileCheck,
      title: 'Leave Approvals',
      description: 'Review and approve leave requests',
      path: '/leave',
    },
    {
      icon: DollarSign,
      title: 'Payroll Management',
      description: 'Manage compensation and salaries',
      path: '/payroll',
    },
  ];

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Management Modules */}
        <div className="flex-1">
          <h2 className="font-medium text-gray-900 mb-4">Management Modules</h2>
          <div className="grid grid-cols-2 gap-6">
            {modules.map((module) => (
              <button
                key={module.title}
                onClick={() => navigate(module.path)}
                className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-[#714B67] hover:shadow-lg transition-all p-6 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#714B67] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}