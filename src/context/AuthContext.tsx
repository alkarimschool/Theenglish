import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Level } from '../types';
import { setApiAuthContext } from '../services/api';

interface StudentSession {
  studentId?: string;
  name: string;
  className: string;
  levelId: string;
}

interface AuthContextType {
  currentUser: User | null;
  activeRole: UserRole;
  studentSession: StudentSession | null;
  assignedLevels: string[];
  loginUser: (user: User) => void;
  logout: () => void;
  startStudent: (name: string, className: string, levelId: string, studentId?: string) => void;
  clearStudent: () => void;
  switchToStudentView: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('alkarim_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [studentSession, setStudentSession] = useState<StudentSession | null>(() => {
    try {
      const saved = localStorage.getItem('alkarim_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const activeRole: UserRole = currentUser ? currentUser.role : 'student';

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('alkarim_user', JSON.stringify(currentUser));
      setApiAuthContext(currentUser.role, currentUser.assignedLevelIds || []);
    } else {
      localStorage.removeItem('alkarim_user');
      setApiAuthContext('student', []);
    }
  }, [currentUser]);

  useEffect(() => {
    if (studentSession) {
      localStorage.setItem('alkarim_student', JSON.stringify(studentSession));
    } else {
      localStorage.removeItem('alkarim_student');
    }
  }, [studentSession]);

  const loginUser = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const startStudent = (name: string, className: string, levelId: string, studentId?: string) => {
    setStudentSession({
      name,
      className,
      levelId,
      studentId,
    });
  };

  const clearStudent = () => {
    setStudentSession(null);
  };

  const switchToStudentView = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        studentSession,
        assignedLevels: currentUser?.assignedLevelIds || [],
        loginUser,
        logout,
        startStudent,
        clearStudent,
        switchToStudentView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
