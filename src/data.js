// Semester start used by "My Classes" to compute teaching week.
export const UNIVERSITY_WEEK1_START = new Date('2025-02-24T00:00:00');
export const TERM_TOTAL_WEEKS = 13;
export const CURRENT_TUTOR = {
  name: 'Mathew Joseph Ryan',
  role: 'Tutor',
  email: 'mathew.ryan@uow.edu.au',
  phone: '+61 4 1234 5678',
  staffId: 'T-2025-009',
  faculty: 'Faculty of Engineering and Information Sciences',
  office: 'Building 17, Room 2.19',
  photoUrl: '/assets/profile-picture.png',
};

// Demo login credentials for frontend flow.
export const AUTH_CREDENTIALS = {
  email: 'mathew.ryan@uow.edu.au',
  password: 'mathew123',
};

// Shared student data used by Students and Analytics pages.
export const INITIAL_STUDENTS = [
  {
    id: 'S1001',
    email: 's1001@uow.edu.au',
    name: 'Uday WASVANI',
    classId: 'isit312',
    weeks: { 1: 'present', 2: 'present', 3: 'absent' },
  },
  {
    id: 'S1002',
    email: 's1002@uow.edu.au',
    name: 'Alyan Babar ALAM',
    classId: 'isit312',
    weeks: { 1: 'present', 2: 'absent', 3: 'present' },
  },
  {
    id: 'S1003',
    email: 's1003@uow.edu.au',
    name: 'Puvannesan SANDRANESAN',
    classId: 'isit312',
    weeks: { 1: 'present', 2: 'present', 3: 'present' },
  },
  {
    id: 'S1004',
    email: 's1004@uow.edu.au',
    name: 'Adel Al JASRY',
    classId: 'csci218',
    weeks: { 1: 'present', 2: 'absent', 3: 'absent' },
  },
  {
    id: 'S1005',
    email: 's1005@uow.edu.au',
    name: 'Eric',
    classId: 'csci218',
    weeks: { 1: 'present', 2: 'present', 3: 'present' },
  },
];

// Derive all unique week numbers available in attendance data.
export function getAvailableWeeks(students) {
  const weekSet = new Set();
  students.forEach((student) => {
    Object.keys(student.weeks || {}).forEach((weekKey) => {
      const parsedWeek = Number(weekKey);
      if (!Number.isNaN(parsedWeek) && parsedWeek > 0) {
        weekSet.add(parsedWeek);
      }
    });
  });
  return [...weekSet].sort((a, b) => a - b);
}

// Highest available week in the provided data.
export function getMaxAvailableWeek(students) {
  const weeks = getAvailableWeeks(students);
  return weeks.length ? weeks[weeks.length - 1] : 1;
}
