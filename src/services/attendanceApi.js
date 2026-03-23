// Backend integration layer for attendance updates.
// -----------------------------------------------------------------------------
// Backend team: replace these placeholders with real API calls and auth headers.
//
// Suggested endpoint:
//   PATCH /api/attendance
//
// Suggested request body:
// {
//   "studentId": "S1001",
//   "week": 3,
//   "status": "present" // or "absent"
// }
//
// Suggested success response:
// {
//   "ok": true,
//   "attendance": {
//     "studentId": "S1001",
//     "week": 3,
//     "status": "present"
//   }
// }
//
// Suggested error response:
// {
//   "ok": false,
//   "message": "Student not found"
// }
// -----------------------------------------------------------------------------

// Set this to `true` when backend endpoint is ready.
const USE_BACKEND_ATTENDANCE_API = false;

export async function updateStudentAttendance({ studentId, week, status }) {
  if (!USE_BACKEND_ATTENDANCE_API) {
    // Frontend-only mode for UI demo/testing until backend is integrated.
    return {
      ok: true,
      source: 'frontend-mock',
      attendance: { studentId, week, status },
    };
  }

  const response = await fetch('/api/attendance', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`, // TODO: backend auth integration
    },
    body: JSON.stringify({ studentId, week, status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update attendance on server.');
  }

  return response.json();
}
