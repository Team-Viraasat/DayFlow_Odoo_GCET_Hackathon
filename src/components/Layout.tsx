import { ReactNode, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, UserCircle, Calendar, FileText, DollarSign, LogOut, Users, Clock, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseOverRef = useRef<boolean>(false);

  const isSidebarVisible = sidebarLocked || sidebarHovered;

  useEffect(() => {
    checkTodayAttendance();
  }, [currentUser, location]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const checkTodayAttendance = () => {
    const storageKey = `attendance_${currentUser?.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const records = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = records.find((r: any) => r.date === today);
      setTodayAttendance(todayRecord || null);
    }
  };

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const storageKey = `attendance_${currentUser?.id}`;
    const stored = localStorage.getItem(storageKey);
    const records = stored ? JSON.parse(stored) : [];
    
    const existingIndex = records.findIndex((r: any) => r.date === today);
    
    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        checkIn: now,
        status: 'Present',
      };
    } else {
      records.push({
        date: today,
        checkIn: now,
        checkOut: null,
        status: 'Present',
      });
    }
    
    localStorage.setItem(storageKey, JSON.stringify(records));
    checkTodayAttendance();
    setShowCheckIn(false);
  };

  const handleCheckOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const storageKey = `attendance_${currentUser?.id}`;
    const stored = localStorage.getItem(storageKey);
    const records = stored ? JSON.parse(stored) : [];
    
    const updatedRecords = records.map((record: any) =>
      record.date === today ? { ...record, checkOut: now } : record
    );
    
    localStorage.setItem(storageKey, JSON.stringify(updatedRecords));
    checkTodayAttendance();
    setShowCheckIn(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Debounced hover handlers with ref tracking
  const handleMouseEnter = () => {
    isMouseOverRef.current = true;
    if (sidebarLocked) return; // Don't auto-expand if locked
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (isMouseOverRef.current) {
        setSidebarHovered(true);
      }
    }, 150); // 150ms delay before opening
  };

  const handleMouseLeave = () => {
    isMouseOverRef.current = false;
    if (sidebarLocked) return; // Don't auto-collapse if locked
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverRef.current) {
        setSidebarHovered(false);
        setShowCheckIn(false); // Close attendance dropdown when sidebar collapses
      }
    }, 300); // 300ms delay before closing
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ...(currentUser?.role === 'admin' ? [{ icon: Users, label: 'Employees', path: '/employees' }] : []),
    { icon: UserCircle, label: 'Profile', path: '/profile' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: FileText, label: 'Leave', path: '/leave' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all ease-in-out relative ${
          isSidebarVisible ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transitionProperty: 'width',
          transitionDuration: '250ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Logo & Hamburger */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isSidebarVisible ? (
            <>
              <div className="flex items-center gap-3 transition-opacity duration-200" style={{
                opacity: isSidebarVisible ? 1 : 0
              }}>
                <div className="w-10 h-10 bg-[#714B67] rounded-lg flex-shrink-0"></div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-gray-900 whitespace-nowrap">DayFlow</div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">HR Management</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarLocked(!sidebarLocked)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarLocked(true)}
              className="w-full flex justify-center p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          {isSidebarVisible ? (
            <div className="flex items-center gap-3 transition-opacity duration-200" style={{
              opacity: isSidebarVisible ? 1 : 0
            }}>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-6 h-6 text-[#714B67]" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</div>
                <div className="text-xs text-gray-500 truncate">{currentUser?.employeeId}</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-[#714B67]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`p-4 border-b border-gray-200 transition-all duration-200 ${!isSidebarVisible ? 'px-2' : ''}`}>
          <button
            onClick={() => setShowCheckIn(!showCheckIn)}
            className={`w-full flex items-center gap-2 py-2.5 bg-[#714B67] text-white rounded-lg hover:bg-[#5f3f58] transition-all shadow-sm ${
              !isSidebarVisible ? 'justify-center px-2' : 'justify-center px-4'
            }`}
            title={!isSidebarVisible ? 'Attendance' : ''}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            {isSidebarVisible && <span className="text-sm font-medium whitespace-nowrap">Attendance</span>}
          </button>

          {showCheckIn && isSidebarVisible && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in duration-200">
              <div className="text-xs text-gray-600 mb-2">
                {todayAttendance ? (
                  <>
                    In: {todayAttendance.checkIn || '-'}
                    {todayAttendance.checkOut && <> | Out: {todayAttendance.checkOut}</>}
                  </>
                ) : (
                  'Not checked in'
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCheckIn}
                  disabled={!!todayAttendance?.checkIn}
                  className="flex-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut}
                  className="flex-1 px-3 py-1.5 bg-[#714B67] text-white text-xs rounded hover:bg-[#5f3f58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-4 transition-all duration-200 ${!isSidebarVisible ? 'px-2' : ''}`}>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 py-2.5 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-purple-50 text-[#714B67] font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${!isSidebarVisible ? 'justify-center px-2' : 'px-4'}`}
                title={!isSidebarVisible ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarVisible && <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className={`p-4 border-t border-gray-200 transition-all duration-200 ${!isSidebarVisible ? 'px-2' : ''}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all ${
              !isSidebarVisible ? 'justify-center px-2' : 'px-4'
            }`}
            title={!isSidebarVisible ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarVisible && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full p-8">
          {children}
        </div>
      </main>
    </div>
  );
}