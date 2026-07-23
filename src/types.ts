export interface Student {
  id: string;
  nis: string;
  name: string;
  levelId: string;
  className: string;
}

export interface Level {
  id: string;
  name: string;
}

export interface ClassRoom {
  id: string;
  levelId: string;
  name: string;
}

export type AttendanceType = 'KBM_MASUK' | 'KBM_PULANG' | 'SHOLAT_DHUHA' | 'SHOLAT_DZUHUR';
export type AttendanceStatus = 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA' | 'TERLAMBAT';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  type: AttendanceType;
  status: AttendanceStatus;
  timestamp: number;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  password?: string;
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface Settings {
  entryTime: string; // HH:mm
  exitTime: string; // HH:mm
}
