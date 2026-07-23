import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Student, Level, ClassRoom, AttendanceRecord, Teacher, Holiday, Settings } from './types';
import { getFirestoreData, updateFirestoreData, subscribeToFirestore } from './lib/firestore';
import { googleSignIn } from './lib/firebase';

interface AppData {
  students: Student[];
  levels: Level[];
  classes: ClassRoom[];
  attendance: AttendanceRecord[];
  teachers: Teacher[];
  holidays: Holiday[];
  settings: Settings;
}

const LOCAL_STORAGE_KEY = 'absenqr_data';

const getInitialData = (): AppData => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(error);
  }
  return {
    students: [],
    levels: [],
    classes: [],
    attendance: [],
    teachers: [],
    holidays: [],
    settings: { entryTime: '07:00', exitTime: '15:00' }
  };
};

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  role: 'admin' | 'piket' | null;
  setRole: React.Dispatch<React.SetStateAction<'admin' | 'piket' | null>>;
  isSyncing: boolean;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  levels: Level[];
  setLevels: React.Dispatch<React.SetStateAction<Level[]>>;
  classes: ClassRoom[];
  setClasses: React.Dispatch<React.SetStateAction<ClassRoom[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  holidays: Holiday[];
  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  handleGoogleLogin: () => Promise<void>;
  handlePiketLogin: (username: string, password?: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return window.localStorage.getItem('absenqr_auth') === 'true';
  });
  const [role, setRole] = useState<'admin' | 'piket' | null>(() => {
    return window.localStorage.getItem('absenqr_role') as 'admin' | 'piket' | null;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [appData, setAppData] = useState<AppData>(getInitialData);
  const isUpdatingFromRemote = useRef(false);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    window.localStorage.setItem('absenqr_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (role) {
      window.localStorage.setItem('absenqr_role', role);
    } else {
      window.localStorage.removeItem('absenqr_role');
    }
  }, [role]);

  useEffect(() => {
    if (isAuthenticated && role) {
      loadRemoteData();
      const unsubscribe = subscribeToFirestore((data) => {
        if (data) {
          isUpdatingFromRemote.current = true;
          setAppData(prev => {
            const newData = { ...prev, ...data };
            return newData;
          });
          setTimeout(() => {
            isUpdatingFromRemote.current = false;
          }, 100);
        }
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated, role]);

  const loadRemoteData = async () => {
    setIsSyncing(true);
    try {
      const data = await getFirestoreData();
      if (data) {
        setAppData(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Failed to load drive data", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateRemote = useCallback((newData: AppData) => {
    if (isUpdatingFromRemote.current) return;
    if (isAuthenticated) {
      updateFirestoreData(newData).catch(console.error);
    }
  }, [isAuthenticated]);

  const updateField = <K extends keyof AppData>(field: K) => {
    return (value: React.SetStateAction<AppData[K]>) => {
      setAppData(prev => {
        const newValue = value instanceof Function ? (value as any)(prev[field]) : value;
        const newData = { ...prev, [field]: newValue };
        updateRemote(newData);
        return newData;
      });
    };
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleSignIn();
      const email = res.user.email;
      
      const isAdmin = email === 'naffelahmad@gmail.com';
      
      setIsAuthenticated(true);
      if (isAdmin) {
        setRole('admin');
      } else {
        setRole('piket');
      }
      
      await loadRemoteData();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handlePiketLogin = async (username: string, password?: string) => {
    let teachersList = appData.teachers;
    try {
      setIsSyncing(true);
      const remoteData = await getFirestoreData();
      if (remoteData && remoteData.teachers) {
        teachersList = remoteData.teachers;
        setAppData(prev => ({ ...prev, ...remoteData }));
      }
    } catch (e) {
      console.error("Failed to fetch remote data for login", e);
    } finally {
      setIsSyncing(false);
    }

    const isTeacher = teachersList.some((t: Teacher) => t.username === username && t.password === password);
    if (isTeacher) {
      setIsAuthenticated(true);
      setRole('piket');
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated, setIsAuthenticated,
        role, setRole,
        isSyncing,
        students: appData.students, setStudents: updateField('students'),
        levels: appData.levels, setLevels: updateField('levels'),
        classes: appData.classes, setClasses: updateField('classes'),
        attendance: appData.attendance, setAttendance: updateField('attendance'),
        teachers: appData.teachers, setTeachers: updateField('teachers'),
        holidays: appData.holidays, setHolidays: updateField('holidays'),
        settings: appData.settings, setSettings: updateField('settings'),
        handleGoogleLogin,
        handlePiketLogin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
