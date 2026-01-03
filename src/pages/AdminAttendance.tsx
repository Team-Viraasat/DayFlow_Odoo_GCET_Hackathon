import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar as CalendarIcon, Users } from 'lucide-react';

interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent' | 'Half-day' | 'Leave';
}

const EMPLOYEES = [
  { id: '1', employeeId: 'EMP001', name: 'John Doe' },
  { id: '2', employeeId: 'EMP002', name: 'Jane Smith' },
  { id: '3', employeeId: 'EMP003', name: 'New Employee' },
  { id: '4', employeeId: 'EMP004', name: 'Alice Johnson' },
  { id: '5', employeeId: 'EMP005', name: 'Bob Wilson' },
];

export default function AdminAttendance() {
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadAllAttendance();
  }, [selectedDate]);

  const loadAllAttendance = () => {
    const records: AttendanceRecord[] = [];

    EMPLOYEES.forEach(emp => {
      const storageKey = `attendance_${emp.id}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const empRecords = JSON.parse(stored);
        const dateRecord = empRecords.find((r: any) => r.date === selectedDate);

        if (dateRecord) {
          records.push({
            employeeId: emp.employeeId,
            employeeName: emp.name,
            ...dateRecord,
          });
        } else {
          records.push({
            employeeId: emp.employeeId,
            employeeName: emp.name,
            date: selectedDate,
            checkIn: null,
            checkOut: null,
            status: 'Absent',
          });
        }
      } else {
        records.push({
          employeeId: emp.employeeId,
          employeeName: emp.name,
          date: selectedDate,
          checkIn: null,
          checkOut: null,
          status: 'Absent',
        });
      }
    });

    setAllRecords(records);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Absent':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Half-day':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Leave':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const stats = {
    present: allRecords.filter(r => r.status === 'Present').length,
    absent: allRecords.filter(r => r.status === 'Absent').length,
    halfDay: allRecords.filter(r => r.status === 'Half-day').length,
    leave: allRecords.filter(r => r.status === 'Leave').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Attendance Records</h1>
          <p className="text-sm text-gray-600">Monitor and review employee attendance</p>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <label htmlFor="date" className="text-sm text-gray-700">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="px-4 py-3 bg-green-50 border border-green-200">
              <div className="text-xs text-green-700 mb-1">Present</div>
              <div className="text-2xl font-semibold text-green-900">{stats.present}</div>
            </div>
            <div className="px-4 py-3 bg-red-50 border border-red-200">
              <div className="text-xs text-red-700 mb-1">Absent</div>
              <div className="text-2xl font-semibold text-red-900">{stats.absent}</div>
            </div>
            <div className="px-4 py-3 bg-amber-50 border border-amber-200">
              <div className="text-xs text-amber-700 mb-1">Half-day</div>
              <div className="text-2xl font-semibold text-amber-900">{stats.halfDay}</div>
            </div>
            <div className="px-4 py-3 bg-blue-50 border border-blue-200">
              <div className="text-xs text-blue-700 mb-1">On Leave</div>
              <div className="text-2xl font-semibold text-blue-900">{stats.leave}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">Employee Attendance - {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{record.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.checkIn || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.checkOut || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs border rounded ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}