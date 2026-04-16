import { useState } from 'react';
import DashboardPage from './DashboardPage';
import SupportPage from './SupportPage';
import MyClassesPage from './MyClassesPage';
import StudentsPage from './StudentsPage';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { INITIAL_STUDENTS } from './data';
import { CURRENT_TUTOR } from './data';
import { AUTH_CREDENTIALS } from './data';
import { updateStudentAttendance } from './services/attendanceApi';

// Seed data used to populate the dashboard and class screens on first load.
const INITIAL_CLASSES = [
  {
    id: 'isit312',
    session: 'Spring 2025',
    subjectCode: 'ISIT312',
    subjectName: 'Big Data Management',
    timeSlot: 'MON 10.30 AM - 12.30 PM',
    classType: 'Laboratory',
    totalStudents: 35,
    presentPercent: 0.96,
    assigned: true,
  },
  {
    id: 'csci218',
    session: 'Spring 2025',
    subjectCode: 'CSCI218',
    subjectName: 'Foundations of Artificial Intelligence',
    timeSlot: 'THU 8.30 AM - 10.30 AM',
    classType: 'Lecture',
    totalStudents: 35,
    presentPercent: 0.92,
    assigned: true,
  },
  {
    id: 'csit214',
    session: 'Spring 2025',
    subjectCode: 'CSIT214',
    subjectName: 'IT Project Management',
    timeSlot: 'WED 10.30 AM - 12.30 PM',
    classType: 'Lecture',
    totalStudents: 35,
    presentPercent: 0.89,
    assigned: true,
  },
  {
    id: 'csit213',
    session: 'Spring 2025',
    subjectCode: 'CSIT213',
    subjectName: 'Java Programming',
    timeSlot: 'TUE 8.30 AM - 10.30 AM',
    classType: 'Lecture',
    totalStudents: 35,
    presentPercent: 0.9,
    assigned: false,
  },
];

function App() {
  // `page` decides which main screen is shown in the content area.
  const [page, setPage] = useState('dashboard'); // 'dashboard' | 'classes' | 'support' | 'students' | 'analytics' | 'profile'
  // `classes` is shared state so child pages stay in sync when classes are added/removed.
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  // Shared student state powers both Students and Analytics pages.
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  // Tutor state is kept in App so all pages (and top bar) stay in sync.
  const [tutor, setTutor] = useState(CURRENT_TUTOR);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(CURRENT_TUTOR.photoUrl);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authCredentials, setAuthCredentials] = useState(AUTH_CREDENTIALS);

  // Helper to update UI state after a successful backend update.
  const applyLocalAttendanceStatus = (studentId, week, status) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        return {
          ...student,
          weeks: {
            ...(student.weeks || {}),
            [week]: status,
          },
        };
      }),
    );
  };

  // Returns an onClick handler that switches the current page.
  const handleNavClick = (target) => (e) => {
    e.preventDefault();
    setPage(target);
  };

  // Marks a class as assigned so it appears in "My classes" and dashboard totals.
  const handleAssignClass = (id) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, assigned: true } : cls)),
    );
  };

  // Marks a class as unassigned to remove it from active dashboard calculations.
  const handleRemoveClass = (id) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, assigned: false } : cls)),
    );
  };

  // Attendance write flow:
  // 1) Frontend sends update request through `services/attendanceApi.js`
  // 2) Backend persists it to DB
  // 3) Frontend updates UI state (or refetches, if backend team prefers that model)
  const handleSetStudentStatus = async (studentId, week, status) => {
    try {
      await updateStudentAttendance({ studentId, week, status });
      applyLocalAttendanceStatus(studentId, week, status);
    } catch (error) {
      // Keep this log for backend integration testing.
      console.error('Attendance update failed:', error);
    }
  };

  // Photo update flow for frontend prototype.
  // Later this can call backend upload API and persist returned URL in DB.
  const handleProfilePhotoChange = (newPhotoUrl) => {
    setProfilePhotoUrl(newPhotoUrl);
    setTutor((prev) => ({ ...prev, photoUrl: newPhotoUrl }));
  };

  // Temporary frontend auth logic.
  // Backend team can replace this with API token/session verification.
  const handleLogin = ({ email, password }) => {
    if (
      email.toLowerCase() === authCredentials.email.toLowerCase() &&
      password === authCredentials.password
    ) {
      setIsAuthenticated(true);
      return { ok: true };
    }
    return { ok: false, message: 'Incorrect email or password.' };
  };

  // Registration updates both login credentials and profile structure.
  // This keeps data format aligned with what Profile page displays.
  const handleRegister = (registrationData) => {
    if (Object.values(registrationData).some((value) => !String(value).trim())) {
      return { ok: false, message: 'Please fill all fields.' };
    }

    setTutor((prev) => ({
      ...prev,
      name: registrationData.fullName,
      email: registrationData.email,
      phone: registrationData.phone,
      staffId: registrationData.staffId,
      faculty: registrationData.faculty,
      office: registrationData.officeBuilding,
    }));
    setAuthCredentials({
      email: registrationData.email,
      password: registrationData.password,
    });
    setIsAuthenticated(true);
    setAuthMode('login');
    return { ok: true };
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setIsAuthenticated(false);
    setAuthMode('login');
  };

  if (!isAuthenticated) {
    if (authMode === 'register') {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onBackToLogin={() => setAuthMode('login')}
        />
      );
    }
    return <LoginPage onLogin={handleLogin} onOpenSignUp={() => setAuthMode('register')} />;
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar-bg">
          <h1 className="app-title">Automatic Student Attendance</h1>
          <div className="profile-picture-wrapper">
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className="profile-picture"
            />
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="nav-bar">
          <nav className="nav-items">
            <a
              href="#dashboard"
              className={`nav-item nav-item-dashboard${
                page === 'dashboard' ? ' is-active' : ''
              }`}
              onClick={handleNavClick('dashboard')}
            >
              <img src="/assets/icon-dashboard.svg" alt="" className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </a>

            <a
              href="#classes"
              className={`nav-item nav-item-my-classes${
                page === 'classes' ? ' is-active' : ''
              }`}
              onClick={handleNavClick('classes')}
            >
              <img src="/assets/tuition.png" alt="" className="nav-thumbnail" />
              <span className="nav-label">My classes</span>
            </a>

            <a
              href="#students"
              className={`nav-item nav-item-students${
                page === 'students' ? ' is-active' : ''
              }`}
              onClick={handleNavClick('students')}
            >
              <img
                src="/assets/student-male.png"
                alt=""
                className="nav-thumbnail"
              />
              <span className="nav-label">Students</span>
            </a>

            <a
              href="#analytics"
              className={`nav-item nav-item-analytics${
                page === 'analytics' ? ' is-active' : ''
              }`}
              onClick={handleNavClick('analytics')}
            >
              <img src="/assets/analytics.png" alt="" className="nav-thumbnail" />
              <span className="nav-label">Analytics</span>
            </a>

            <a
              href="#profile"
              className={`nav-item nav-item-profile${
                page === 'profile' ? ' is-active' : ''
              }`}
              onClick={handleNavClick('profile')}
            >
              <img src="/assets/icon-profile.svg" alt="" className="nav-icon" />
              <span className="nav-label">Profile</span>
            </a>

            <a
              href="#support"
              className={`nav-item nav-item-support${
                page === 'support' ? ' is-active' : ''
              }`}
              onClick={handleNavClick('support')}
            >
              <img
                src="/assets/online-support.png"
                alt=""
                className="nav-thumbnail"
              />
              <span className="nav-label">Support</span>
            </a>

            <div className="nav-spacer" />

            <a className="nav-item nav-item-logout" href="#logout" onClick={handleLogout}>
              <img src="/assets/icon-logout.svg" alt="" className="nav-icon" />
              <span className="nav-label">Log out</span>
            </a>
          </nav>
        </aside>

        {/* Render one page at a time based on sidebar selection. */}
        {page === 'dashboard' && (
          <DashboardPage
            classes={classes}
            tutorName={tutor.name}
            onAssignClass={handleAssignClass}
            onRemoveClass={handleRemoveClass}
          />
        )}
        {page === 'classes' && (
          <MyClassesPage classes={classes.filter((cls) => cls.assigned)} />
        )}
        {page === 'students' && (
          <StudentsPage
            students={students}
            onSetStatus={handleSetStudentStatus}
          />
        )}
        {page === 'analytics' && <AnalyticsPage classes={classes} students={students} />}
        {page === 'profile' && (
          <ProfilePage
            tutor={tutor}
            photoUrl={profilePhotoUrl}
            onPhotoChange={handleProfilePhotoChange}
          />
        )}
        {page === 'support' && <SupportPage />}
      </div>
    </div>
  );
}

export default App;
