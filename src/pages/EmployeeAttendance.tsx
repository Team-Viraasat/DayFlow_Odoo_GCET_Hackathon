import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
}

export default function EmployeeAttendance() {
  const { currentUser } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [view, setView] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    loadAttendanceRecords();
  }, [currentUser]);

  const loadAttendanceRecords = () => {
    const storageKey = `attendance_${currentUser?.id}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const records = JSON.parse(stored);
      setAttendanceRecords(records.sort((a: AttendanceRecord, b: AttendanceRecord) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  };

  const todayRecord = attendanceRecords.find(r => r.date === new Date().toISOString().split('T')[0]);

  // Get records for current week
  const getWeekRecords = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return attendanceRecords.filter(r => {
      const date = new Date(r.date);
      return date >= weekStart && date <= weekEnd;
    });
  };

  const displayRecords = view === 'weekly' ? getWeekRecords() : attendanceRecords;

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Attendance</h1>
          <p className="text-gray-600">Track and manage your attendance records</p>
        </div>

        {/* Today's Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Today's Status</h3>
              <p className="text-sm text-gray-600">
                {todayRecord ? (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      In: {todayRecord.checkIn || '-'}
                    </span>
                    {todayRecord.checkOut && (
                      <span className="ml-4 inline-flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Out: {todayRecord.checkOut}
                      </span>
                    )}
                  </>
                ) : (
                  'Not checked in yet'
                )}
              </p>
            </div>
            {todayRecord && (
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                todayRecord.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {todayRecord.status}
              </span>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Attendance History</h3>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('daily')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'daily'
                  ? 'bg-white text-[#714B67] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setView('weekly')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'weekly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayRecords.length > 0 ? (
                  displayRecords.map((record) => {
                    const hours = record.checkIn && record.checkOut ? 
                      Math.round((new Date(`2000-01-01 ${record.checkOut}`).getTime() - 
                                  new Date(`2000-01-01 ${record.checkIn}`).getTime()) / 3600000 * 10) / 10 
                      : '-';
                    
                    return (
                      <tr key={record.date} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.checkIn || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.checkOut || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{hours !== '-' ? `${hours}h` : '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                            record.status === 'Present' ? 'bg-green-100 text-green-700' :
                            record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                            record.status === 'Half-day' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {record.status === 'Present' && <CheckCircle className="w-3 h-3" />}
                            {record.status === 'Absent' && <XCircle className="w-3 h-3" />}
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-sm text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}