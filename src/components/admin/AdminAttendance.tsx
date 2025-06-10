import { useState, useEffect } from 'react';
import { useAttendance, AttendanceRecord } from '../../contexts/AttendanceContext';
import { mockUsers } from '../../data/mockData';
import { format } from 'date-fns';
import EmployeeDetailsDashboard from './EmployeeDetailsDashboard';

const AdminAttendance = () => {
  const { attendanceRecords, markAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  const todayAttendance = attendanceRecords.filter(
    record => record.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleMarkAttendance = (userId: number, status: 'present' | 'absent' | 'half-day') => {
    markAttendance(userId, status, format(selectedDate, 'yyyy-MM-dd'));
  };

  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee);
  };

  const handleCloseEmployeeDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-8">
      <div className="edusync-glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-6">Staff Attendance - {format(selectedDate, 'MMMM d, yyyy')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Punch In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Punch Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.filter(user => user.role === 'staff').map(user => {
                const attendance = todayAttendance.find(record => record.userId === user.id);
                return (
                  <tr
                    key={user.id}
                    onClick={() => handleEmployeeClick(user)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary">{user.name}</div>
                      <div className="text-sm text-text-secondary">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{user.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        attendance?.status === 'present'
                          ? 'bg-green-100 text-success'
                          : attendance?.status === 'absent'
                          ? 'bg-red-100 text-danger'
                          : attendance?.status === 'half-day'
                          ? 'bg-yellow-100 text-warning'
                          : 'bg-gray-100 text-text-secondary'
                      }`}>
                        {attendance?.status ? attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1) : 'Not Marked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {attendance?.punchInTime || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {attendance?.punchOutTime || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAttendance(user.id, 'present'); }}
                          className="opacity-50 bg-success px-4 py-1 border-none rounded-full text-text-light hover:opacity-100 transition-opacity"
                        >
                          Present
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAttendance(user.id, 'absent'); }}
                          className="opacity-50 bg-danger px-4 py-1 border-none rounded-full text-text-light hover:opacity-100 transition-opacity"
                        >
                          Absent
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAttendance(user.id, 'half-day'); }}
                          className="opacity-50 bg-warning px-4 py-1 border-none rounded-full text-text-light hover:opacity-100 transition-opacity"
                        >
                          Half Day
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEmployee && (
        <EmployeeDetailsDashboard
          employee={selectedEmployee}
          onClose={handleCloseEmployeeDetails}
        />
      )}
    </div>
  );
};

export default AdminAttendance; 