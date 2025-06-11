import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAttendance, AttendanceRecord } from '../../contexts/AttendanceContext';
import { mockUsers } from '../../data/mockData';
import { format, parseISO } from 'date-fns';
import { Download, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboardContent = () => {
  const { currentUser } = useAuth();
  const { attendanceRecords } = useAttendance();
  const [selectedDate] = useState(new Date());
  const [exportType, setExportType] = useState<'day' | 'week' | 'month'>('day');
  const [stats, setStats] = useState({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      try {
        const today = format(selectedDate, 'yyyy-MM-dd');
        const todayData = attendanceRecords.filter((record: AttendanceRecord) => record.date === today);
        
        const uniqueStaffIds = new Set(mockUsers.filter(user => user.role === 'staff').map((r: any) => r.id));
        
        setStats({
          totalStaff: uniqueStaffIds.size,
          presentToday: todayData.filter((r: AttendanceRecord) => r.status === 'present').length,
          absentToday: todayData.filter((r: AttendanceRecord) => r.status === 'absent').length,
          lateToday: todayData.filter((r: AttendanceRecord) => r.status === 'half-day').length
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
      }
    };

    calculateStats();
  }, [attendanceRecords, selectedDate]);

  const handleExport = () => {
    exportToCSV(attendanceRecords, exportType, selectedDate);
  };

  const monthlyAttendanceData = attendanceRecords.reduce((acc: { [key: string]: any }, record) => {
    const monthDay = format(parseISO(record.date), 'MM/dd');
    if (!acc[monthDay]) {
      acc[monthDay] = { name: monthDay, present: 0, absent: 0, late: 0, 'Half Day': 0 };
    }
    if (record.status === 'present') acc[monthDay].present++;
    if (record.status === 'absent') acc[monthDay].absent++;
    if (record.status === 'half-day') acc[monthDay]['Half Day']++;
    return acc;
  }, {});

  const barChartData = Object.values(monthlyAttendanceData).sort((a: any, b: any) => parseISO(a.name.replace('/', '-') + '-2024').getTime() - parseISO(b.name.replace('/', '-') + '-2024').getTime());

  const overallStatusCounts = attendanceRecords.reduce((acc: any, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {});

  const totalAttendanceRecords = attendanceRecords.length;
  const pieChartData = Object.keys(overallStatusCounts).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: overallStatusCounts[status],
    percentage: (overallStatusCounts[status] / totalAttendanceRecords) * 100
  }));

  const PIE_COLORS = {
    present: '#10b981',
    absent: '#ef4444',
    'half-day': '#f59e0b',
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as 'day' | 'week' | 'month')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-8 w-full sm:w-auto"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
          <button
            onClick={handleExport}
            className="btn btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stats-card bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-text-secondary text-sm">Total Employees</h3>
            <p className="text-indigo-700 text-xl md:text-2xl font-bold">{stats.totalStaff}</p>
          </div>
          <Users className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
        </div>
        <div className="stats-card bg-green-50 border-l-4 border-green-600 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-text-secondary text-sm">Present Today</h3>
            <p className="text-green-700 text-xl md:text-2xl font-bold">{stats.presentToday}</p>
          </div>
          <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
        </div>
        <div className="stats-card bg-red-50 border-l-4 border-red-600 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-text-secondary text-sm">Absent Today</h3>
            <p className="text-red-700 text-xl md:text-2xl font-bold">{stats.absentToday}</p>
          </div>
          <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
        </div>
        <div className="stats-card bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-text-secondary text-sm">Late Today</h3>
            <p className="text-yellow-700 text-xl md:text-2xl font-bold">{stats.lateToday}</p>
          </div>
          <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="edusync-glass-card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-text-primary mb-4">Monthly Attendance Overview</h2>
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                <Bar dataKey="Half Day" stackId="a" fill="#f59e0b" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="edusync-glass-card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-text-primary mb-4">Attendance Distribution</h2>
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name.toLowerCase().replace(' ','') as keyof typeof PIE_COLORS]} />
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

export default AdminDashboardContent; 