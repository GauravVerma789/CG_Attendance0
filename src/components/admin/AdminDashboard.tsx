import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAttendance, AttendanceRecord } from '../../contexts/AttendanceContext';
import { mockUsers } from '../../data/mockData';
import { format, parseISO } from 'date-fns';
import { Download, Calendar } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import EmployeeDetailsDashboard from './EmployeeDetailsDashboard';
import Sidebar from '../Sidebar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AdminDashboardContent from './AdminDashboardContent';
import AdminAttendance from './AdminAttendance';
import AdminEmployees from './AdminEmployees';
import AdminCalendar from './AdminCalendar';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { attendanceRecords, markAttendance } = useAttendance();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exportType, setExportType] = useState<'day' | 'week' | 'month'>('day');
  const [stats, setStats] = useState({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0
  });
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  useEffect(() => {
    const calculateStats = () => {
      try {
        const today = format(selectedDate, 'yyyy-MM-dd');
        const todayData = attendanceRecords.filter((record: AttendanceRecord) => record.date === today);
        
        // Get unique staff members from attendance data
        const uniqueStaffIds = new Set(attendanceRecords.map((r: AttendanceRecord) => r.userId));
        
        setStats({
          totalStaff: uniqueStaffIds.size,
          presentToday: todayData.filter((r: AttendanceRecord) => r.status === 'present').length,
          absentToday: todayData.filter((r: AttendanceRecord) => r.status === 'absent').length,
          lateToday: todayData.filter((r: AttendanceRecord) => r.status === 'half-day').length
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateStats();
  }, [attendanceRecords, selectedDate]);

  const handleMarkAttendance = (userId: number, status: 'present' | 'absent' | 'half-day') => {
    markAttendance(userId, status, format(selectedDate, 'yyyy-MM-dd'));
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(attendanceRecords, exportType, selectedDate);
    } else {
      exportToPDF(attendanceRecords, exportType, selectedDate);
    }
  };

  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee);
  };

  const handleCloseEmployeeDetails = () => {
    setSelectedEmployee(null);
  };

  // Get today's attendance records
  const todayAttendance = attendanceRecords.filter(
    record => record.date === format(selectedDate, 'yyyy-MM-dd')
  );

  // Prepare data for the chart
  const chartData = [
    { name: 'Present', value: stats.presentToday },
    { name: 'Absent', value: stats.absentToday },
    { name: 'Late', value: stats.lateToday }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen page-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-background">
      <Sidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<AdminDashboardContent />} />
          <Route path="dashboard" element={<AdminDashboardContent />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="calendar" element={<AdminCalendar />} />
        </Routes>
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

export default AdminDashboard;
