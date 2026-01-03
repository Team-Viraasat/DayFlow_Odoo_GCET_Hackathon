import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, Calendar, FileText, DollarSign } from 'lucide-react';

export default function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const modules = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: FileText, label: 'Leave Requests', path: '/leave' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
  ];

  return (
    <Layout>
      <div className="h-full flex items-center justify-center -mt-8">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back, {currentUser?.name}</h1>
            <p className="text-gray-600">What would you like to do today?</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {modules.map((module) => (
              <button
                key={module.label}
                onClick={() => navigate(module.path)}
                className="bg-white border-2 border-gray-200 hover:border-[#714B67] hover:shadow-xl transition-all p-8 rounded-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#714B67] w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <module.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-medium text-gray-900">{module.label}</div>
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