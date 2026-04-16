import { useMemo, useState } from 'react';
import { getAvailableWeeks } from './data';

function StudentsPage({ students, onSetStatus }) {
  // "filters" reflects what user is typing/selecting in the form inputs.
  const [filters, setFilters] = useState({
    studentId: '',
    name: '',
    week: '',
  });
  // "appliedFilters" only changes when user clicks Apply.
  // This prevents filtering on every keystroke.
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const availableWeeks = useMemo(() => getAvailableWeeks(students), [students]);
  const defaultWeek = availableWeeks[0] ?? 1;

  // Default week is the first available week from attendance data.
  const activeWeek = appliedFilters.week ? Number(appliedFilters.week) : defaultWeek;

  // Build filtered rows from currently applied filters.
  const filteredStudents = useMemo(() => {
    const idFilter = appliedFilters.studentId;
    const nameFilter = appliedFilters.name.trim().toLowerCase();

    return students.filter((student) => {
      if (idFilter && student.id !== idFilter) {
        return false;
      }
      if (nameFilter && !student.name.toLowerCase().includes(nameFilter)) {
        return false;
      }
      return true;
    });
  }, [students, appliedFilters]);

  // Returns an input handler for one filter field.
  const handleFilterChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply current form inputs to the table.
  const handleApplyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  // Sends attendance update request through App -> attendanceApi service.
  // Backend team will replace mock mode with real DB persistence.
  const handleSetStatus = (studentId, status) => {
    const week = activeWeek || 1;
    onSetStatus(studentId, week, status);
  };

  return (
    <main className="students-main">
      <section className="students-header">
        <h2 className="students-title">Students</h2>
        <p className="students-subtitle">
          Manage attendance status by week. Changes are reflected in Analytics.
        </p>
      </section>

      <section className="students-filters">
        <form className="students-filters-form" onSubmit={handleApplyFilters}>
          <div className="students-filter-field">
            <label htmlFor="student-id" className="students-filter-label">
              Student ID
            </label>
            <select
              id="student-id"
              className="students-filter-select"
              value={filters.studentId}
              onChange={handleFilterChange('studentId')}
            >
              <option value="">All</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.id}
                </option>
              ))}
            </select>
          </div>

          <div className="students-filter-field students-filter-name-field">
            <label htmlFor="student-name" className="students-filter-label">
              Name
            </label>
            <textarea
              id="student-name"
              className="students-filter-textarea"
              rows={1}
              value={filters.name}
              onChange={handleFilterChange('name')}
              placeholder="Type a student name"
            />
          </div>

          <div className="students-filter-field">
            <label htmlFor="week-select" className="students-filter-label">
              Week
            </label>
            <select
              id="week-select"
              className="students-filter-select"
              value={filters.week}
              onChange={handleFilterChange('week')}
            >
              <option value="">{`Week ${defaultWeek}`}</option>
              {availableWeeks.map((weekNumber) => {
                return (
                  <option key={weekNumber} value={weekNumber}>
                    Week {weekNumber}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="students-filter-actions">
            <button type="submit" className="btn btn-primary students-apply-button">
              Apply
            </button>
          </div>
        </form>
      </section>

      <section className="students-table">
        <div className="students-table-header">
          <span>#</span>
          <span>Student ID</span>
          <span>Email</span>
          <span>Name</span>
          <span>Week</span>
          <span className="students-status-column">Status</span>
        </div>

        {filteredStudents.map((student, index) => {
          // If this week has no explicit value yet, treat it as present.
          const weeks = student.weeks || {};
          const status = weeks[activeWeek] || 'present';
          const isPresent = status === 'present';

          return (
            <div key={student.id} className="students-row">
              <span className="students-cell-index">{index + 1}</span>
              <span>{student.id}</span>
              <span>{student.email}</span>
              <span>{student.name}</span>
              <span>{`Week ${activeWeek}`}</span>
              <span className="students-status-buttons">
                <button
                  type="button"
                  className={`students-status-button students-status-absent${
                    !isPresent ? ' is-active' : ''
                  }`}
                  onClick={() => handleSetStatus(student.id, 'absent')}
                >
                  Absent
                </button>
                <button
                  type="button"
                  className={`students-status-button students-status-present${
                    isPresent ? ' is-active' : ''
                  }`}
                  onClick={() => handleSetStatus(student.id, 'present')}
                >
                  Present
                </button>
              </span>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default StudentsPage;

