import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useAttendance } from '../../contexts/AttendanceContext';
import { User } from '../../contexts/AuthContext'; // Assuming User type is exported
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Clock, X } from 'lucide-react';

interface EmployeeDetailsDashboardProps {
  employee: User | null;
  onClose: () => void;
}

const EmployeeDetailsDashboard: React.FC<EmployeeDetailsDashboardProps> = ({ employee, onClose }) => {
  const { attendanceRecords } = useAttendance();

  if (!employee) return null;

  // Filter attendance for the current employee
  const employeeAttendance = attendanceRecords.filter(record => record.userId === employee.id);

  // Summaries
  const presentDays = employeeAttendance.filter(record => record.status === 'present').length;
  const absentDays = employeeAttendance.filter(record => record.status === 'absent').length;
  const halfDays = employeeAttendance.filter(record => record.status === 'half-day').length;

  // Line chart data (daily)
  const dailyAttendanceData = employeeAttendance.reduce<Record<string, any>>((acc, record) => {
    const date = format(parseISO(record.date), 'MMM dd yyyy'); // Use yyyy for proper sorting
    if (!acc[date]) acc[date] = { date, present: 0, absent: 0, halfDay: 0 };
    if (record.status === 'present') acc[date].present++;
    else if (record.status === 'absent') acc[date].absent++;
    else if (record.status === 'half-day') acc[date].halfDay++;
    return acc;
  }, {});

  const lineChartData = Object.values(dailyAttendanceData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Bar chart data (monthly)
  const monthlyAttendanceData = employeeAttendance.reduce<Record<string, any>>((acc, record) => {
    const month = format(parseISO(record.date), 'MMM yyyy');
    if (!acc[month]) acc[month] = { name: month, present: 0, absent: 0, halfDay: 0 };
    if (record.status === 'present') acc[month].present++;
    else if (record.status === 'absent') acc[month].absent++;
    else if (record.status === 'half-day') acc[month].halfDay++;
    return acc;
  }, {});

  const barChartData = Object.values(monthlyAttendanceData).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  // Pie chart data (overall)
  const overallStatusCounts = employeeAttendance.reduce<Record<string, number>>((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(overallStatusCounts).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
  }));

  const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280']; // Green, Red, Yellow, Gray

  return (
    <div className="h-full bg-white shadow-lg overflow-y-auto">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">Employee Details</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Employee Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl md:text-3xl">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-text-primary">{employee.name}</h3>
              <p className="text-text-secondary">ID: emp{employee.id}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="stats-card bg-green-50 border-l-4 border-green-600 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-sm">Total Days Present</h3>
              <p className="text-green-700 text-xl md:text-2xl font-bold">{presentDays}</p>
            </div>
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
          </div>
          <div className="stats-card bg-red-50 border-l-4 border-red-600 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-sm">Total Days Absent</h3>
              <p className="text-red-700 text-xl md:text-2xl font-bold">{absentDays}</p>
            </div>
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
          </div>
          <div className="stats-card bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-sm">Total Days Half Day</h3>
              <p className="text-yellow-700 text-xl md:text-2xl font-bold">{halfDays}</p>
            </div>
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Line Chart */}
          <div className="edusync-glass-card p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-4">Daily Attendance Trend</h3>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#10b981" activeDot={{ r: 8 }} name="Present" />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" activeDot={{ r: 8 }} name="Absent" />
                  <Line type="monotone" dataKey="halfDay" stroke="#f59e0b" activeDot={{ r: 8 }} name="Half Day" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="edusync-glass-card p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-4">Monthly Attendance Summary</h3>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  <Bar dataKey="halfDay" fill="#f59e0b" name="Half Day" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="edusync-glass-card p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-4">Overall Attendance Distribution</h3>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsDashboard;
