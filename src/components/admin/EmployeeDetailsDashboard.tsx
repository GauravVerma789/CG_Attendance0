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
import { CheckCircle, XCircle, Clock } from 'lucide-react'; // Import icons

interface EmployeeDetailsDashboardProps {
  employee: User | null;
  onClose: () => void;
}

const EmployeeDetailsDashboard: React.FC<EmployeeDetailsDashboardProps> = ({ employee, onClose }) => {
  const { attendanceRecords } = useAttendance();

  if (!employee) {
    return null;
  }

  const employeeAttendance = attendanceRecords.filter(record => record.userId === employee.id);

  // Calculate numerical summaries
  const presentDays = employeeAttendance.filter(record => record.status === 'present').length;
  const absentDays = employeeAttendance.filter(record => record.status === 'absent').length;
  const halfDays = employeeAttendance.filter(record => record.status === 'half-day').length;

  // Prepare data for Line Chart (Daily attendance status over time)
  const dailyAttendanceData = employeeAttendance.reduce((acc: any, record) => {
    const date = format(parseISO(record.date), 'MMM dd');
    if (!acc[date]) {
      acc[date] = { present: 0, absent: 0, halfDay: 0, date: date };
    }
    if (record.status === 'present') acc[date].present++;
    if (record.status === 'absent') acc[date].absent++;
    if (record.status === 'half-day') acc[date].halfDay++;
    return acc;
  }, {});

  const lineChartData = Object.values(dailyAttendanceData).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prepare data for Bar Chart (Monthly attendance summary)
  const monthlyAttendanceData = employeeAttendance.reduce((acc: any, record) => {
    const month = format(parseISO(record.date), 'MMM yyyy');
    if (!acc[month]) {
      acc[month] = { present: 0, absent: 0, halfDay: 0, name: month };
    }
    if (record.status === 'present') acc[month].present++;
    if (record.status === 'absent') acc[month].absent++;
    if (record.status === 'half-day') acc[month].halfDay++;
    return acc;
  }, {});

  const barChartData = Object.values(monthlyAttendanceData).sort((a: any, b: any) => new Date(a.name).getTime() - new Date(b.name).getTime());

  // Prepare data for Pie Chart (Overall attendance distribution)
  const overallStatusCounts = employeeAttendance.reduce((acc: any, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(overallStatusCounts).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: overallStatusCounts[status]
  }));

  const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280']; // Success, Danger, Warning, Secondary

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="edusync-glass-card w-full max-w-6xl h-[90vh] overflow-y-auto p-6 relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-text-primary mb-6">Attendance Details for {employee.name}</h2>

        {/* New section for numerical attendance summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats-card bg-green-50 border-l-4 border-green-600 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-sm">Total Days Present</h3>
              <p className="text-green-700 text-2xl font-bold">{presentDays}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="stats-card bg-red-50 border-l-4 border-red-600 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-sm">Total Days Absent</h3>
              <p className="text-red-700 text-2xl font-bold">{absentDays}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="stats-card bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-sm">Total Days Half Day</h3>
              <p className="text-yellow-700 text-2xl font-bold">{halfDays}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="chart-container flex flex-col">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Daily Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" className="text-text-secondary" />
                <YAxis className="text-text-secondary" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="var(--success)" activeDot={{ r: 8 }} name="Present" />
                <Line type="monotone" dataKey="absent" stroke="var(--danger)" activeDot={{ r: 8 }} name="Absent" />
                <Line type="monotone" dataKey="halfDay" stroke="var(--warning)" activeDot={{ r: 8 }} name="Half Day" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="chart-container flex flex-col">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Monthly Attendance Summary</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" className="text-text-secondary" />
                <YAxis className="text-text-secondary" />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="var(--success)" name="Present" />
                <Bar dataKey="absent" fill="var(--danger)" name="Absent" />
                <Bar dataKey="halfDay" fill="var(--warning)" name="Half Day" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="chart-container lg:col-span-2 flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Overall Attendance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
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
  );
};

export default EmployeeDetailsDashboard; 