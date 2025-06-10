import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { format } from 'date-fns';
import { mockAttendance } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface AttendanceRecord {
  id: number;
  userId: number;
  date: string;
  status: 'present' | 'absent' | 'half-day';
  punchInTime?: string;
  punchOutTime?: string;
  notes?: string;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  userAttendance: AttendanceRecord[];
  markAttendance: (userId: number, status: 'present' | 'absent' | 'half-day', date?: string) => void;
  punchIn: (userId: number) => void;
  punchOut: (userId: number) => void;
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getAttendanceByUser: (userId: number) => AttendanceRecord[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

interface AttendanceProviderProps {
  children: ReactNode;
}

export const AttendanceProvider = ({ children }: AttendanceProviderProps) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Load initial data from localStorage or fall back to mock data
    const storedAttendance = localStorage.getItem('attendanceRecords');
    if (storedAttendance) {
      setAttendanceRecords(JSON.parse(storedAttendance));
    } else {
      setAttendanceRecords(mockAttendance);
    }
  }, []);

  // Save to localStorage whenever attendance records change
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords]);

  // Filter attendance for current user
  const userAttendance = attendanceRecords.filter(
    record => currentUser && record.userId === currentUser.id
  );

  const markAttendance = (userId: number, status: 'present' | 'absent' | 'half-day', date = format(new Date(), 'yyyy-MM-dd')) => {
    // Check if record already exists for this user and date
    const existingRecordIndex = attendanceRecords.findIndex(
      record => record.userId === userId && record.date === date
    );

    if (existingRecordIndex !== -1) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status,
        ...(status === 'present' && !updatedRecords[existingRecordIndex].punchInTime
          ? { punchInTime: format(new Date(), 'HH:mm:ss') }
          : {})
      };
      setAttendanceRecords(updatedRecords);
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: attendanceRecords.length + 1,
        userId,
        date,
        status,
        ...(status === 'present'
          ? { punchInTime: format(new Date(), 'HH:mm:ss') }
          : {})
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  const punchIn = (userId: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm:ss');
    
    const existingRecordIndex = attendanceRecords.findIndex(
      record => record.userId === userId && record.date === today
    );

    if (existingRecordIndex !== -1) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status: 'present',
        punchInTime: currentTime
      };
      setAttendanceRecords(updatedRecords);
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: attendanceRecords.length + 1,
        userId,
        date: today,
        status: 'present',
        punchInTime: currentTime
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  const punchOut = (userId: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm:ss');
    
    const existingRecordIndex = attendanceRecords.findIndex(
      record => record.userId === userId && record.date === today
    );

    if (existingRecordIndex !== -1) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        punchOutTime: currentTime
      };
      setAttendanceRecords(updatedRecords);
    }
  };

  const getAttendanceByDate = (date: string) => {
    return attendanceRecords.filter(record => record.date === date);
  };

  const getAttendanceByUser = (userId: number) => {
    return attendanceRecords.filter(record => record.userId === userId);
  };

  return (
    <AttendanceContext.Provider value={{
      attendanceRecords,
      userAttendance,
      markAttendance,
      punchIn,
      punchOut,
      getAttendanceByDate,
      getAttendanceByUser
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};
