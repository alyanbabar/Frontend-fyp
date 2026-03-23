import { useMemo, useState } from 'react';

// For analytics bars, percentage is calculated against total classes conducted.
// Example: 3 missed classes out of 15 -> 80% attendance.
const TOTAL_CLASSES_CONDUCTED = 15;

function AnalyticsPage({ classes, students }) {
  // Filter selections that drive the chart and table content.
  const [filters, setFilters] = useState({
    session: '',
    classId: '',
    timeSlot: '',
    week: '1',
  });

  const week = Number(filters.week) || 1;

  const sessionOptions = useMemo(
    () => Array.from(new Set(classes.map((cls) => cls.session))),
    [classes],
  );

  const classOptions = useMemo(
    () =>
      classes.filter((cls) => !filters.session || cls.session === filters.session),
    [classes, filters.session],
  );

  const timeSlotOptions = useMemo(
    () =>
      Array.from(
        new Set(
          classOptions
            .filter((cls) => !filters.classId || cls.id === filters.classId)
            .map((cls) => cls.timeSlot),
        ),
      ),
    [classOptions, filters.classId],
  );

  // Build quick lookup map so we can show class details for each student row.
  const classById = useMemo(
    () => Object.fromEntries(classes.map((cls) => [cls.id, cls])),
    [classes],
  );

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const cls = classById[student.classId];
        if (!cls) return false;
        if (filters.session && cls.session !== filters.session) return false;
        if (filters.classId && student.classId !== filters.classId) return false;
        if (filters.timeSlot && cls.timeSlot !== filters.timeSlot) return false;
        return true;
      }),
    [students, classById, filters],
  );

  const chartStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    filteredStudents.forEach((student) => {
      const status = student.weeks?.[week] || 'present';
      if (status === 'absent') {
        absent += 1;
      } else {
        present += 1;
      }
    });
    const total = present + absent;
    const presentPct = total ? Math.round((present / total) * 100) : 0;
    const absentPct = total ? 100 - presentPct : 0;
    return { present, absent, total, presentPct, absentPct };
  }, [filteredStudents, week]);

  const studentRows = useMemo(
    () =>
      filteredStudents.map((student) => {
        const missed = Object.values(student.weeks || {}).filter(
          (status) => status === 'absent',
        ).length;
        const attended = Math.max(TOTAL_CLASSES_CONDUCTED - missed, 0);
        const percentage = Math.round((attended / TOTAL_CLASSES_CONDUCTED) * 100);
        return { ...student, percentage };
      }),
    [filteredStudents],
  );

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => {
      if (field === 'session') {
        return { ...prev, session: value, classId: '', timeSlot: '' };
      }
      if (field === 'classId') {
        return { ...prev, classId: value, timeSlot: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  return (
    <main className="analytics-main">
      <section className="analytics-header">
        <h2 className="analytics-title">Analytics</h2>
        <p className="analytics-subtitle">
          Attendance stats by session, class, time, and week.
        </p>
      </section>

      <section className="analytics-filters">
        <div className="analytics-filter-field">
          <label htmlFor="analytics-session">Session</label>
          <select
            id="analytics-session"
            value={filters.session}
            onChange={handleFilterChange('session')}
          >
            <option value="">All sessions</option>
            {sessionOptions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>

        <div className="analytics-filter-field">
          <label htmlFor="analytics-class">Class</label>
          <select
            id="analytics-class"
            value={filters.classId}
            onChange={handleFilterChange('classId')}
          >
            <option value="">All classes</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.subjectCode} - {cls.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="analytics-filter-field">
          <label htmlFor="analytics-time">Time</label>
          <select
            id="analytics-time"
            value={filters.timeSlot}
            onChange={handleFilterChange('timeSlot')}
          >
            <option value="">All times</option>
            {timeSlotOptions.map((timeSlot) => (
              <option key={timeSlot} value={timeSlot}>
                {timeSlot}
              </option>
            ))}
          </select>
        </div>

        <div className="analytics-filter-field">
          <label htmlFor="analytics-week">Week</label>
          <select
            id="analytics-week"
            value={filters.week}
            onChange={handleFilterChange('week')}
          >
            {Array.from({ length: 13 }).map((_, index) => {
              const weekNumber = index + 1;
              return (
                <option key={weekNumber} value={String(weekNumber)}>
                  Week {weekNumber}
                </option>
              );
            })}
          </select>
        </div>
      </section>

      <section className="analytics-chart-card">
        <h3>Attendance Distribution</h3>
        <p className="analytics-chart-meta">
          Total students: {chartStats.total} | Week {week}
        </p>
        <div className="analytics-chart-content">
          <div
            className="analytics-pie"
            style={{
              backgroundImage: `conic-gradient(#3c458e 0 ${chartStats.presentPct}%, #b91c1c ${chartStats.presentPct}% 100%)`,
            }}
          />
          <div className="analytics-legend">
            <p>
              <span className="analytics-dot analytics-dot-present" />
              Present: {chartStats.present} ({chartStats.presentPct}%)
            </p>
            <p>
              <span className="analytics-dot analytics-dot-absent" />
              Absent: {chartStats.absent} ({chartStats.absentPct}%)
            </p>
          </div>
        </div>
      </section>

      <section className="analytics-table">
        <div className="analytics-table-header">
          <span>#</span>
          <span>Student ID</span>
          <span>Name</span>
          <span>Email</span>
          <span>Class</span>
          <span>Attendance %</span>
        </div>
        {studentRows.map((student, index) => {
          const cls = classById[student.classId];
          return (
            <div key={student.id} className="analytics-table-row">
              <span>{index + 1}</span>
              <span>{student.id}</span>
              <span>{student.name}</span>
              <span>{student.email}</span>
              <span>{cls ? cls.subjectCode : '-'}</span>
              <span className="analytics-percentage-cell">
                <span className="analytics-progress-track">
                  <span
                    className="analytics-progress-fill"
                    style={{ width: `${student.percentage}%` }}
                  />
                </span>
                <span className="analytics-progress-value">{student.percentage}%</span>
              </span>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default AnalyticsPage;
