import { useRef } from 'react';

function ProfilePage({ tutor, photoUrl, onPhotoChange }) {
  // Hidden file input is triggered by the visible "Change photo" button.
  const fileInputRef = useRef(null);

  const profile = {
    fullName: tutor?.name ?? '',
    role: tutor?.role ?? '',
    email: tutor?.email ?? '',
    phone: tutor?.phone ?? '',
    staffId: tutor?.staffId ?? '',
    faculty: tutor?.faculty ?? '',
    office: tutor?.office ?? '',
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only image files are supported for profile photo preview.
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        onPhotoChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="profile-main">
      <section className="profile-header">
        <h2 className="profile-title">Profile</h2>
        <p className="profile-subtitle">Tutor account information and contact details.</p>
      </section>

      <section className="profile-card">
        <div className="profile-avatar-column">
          <div className="profile-avatar-frame">
            <img
              src={photoUrl}
              alt="Tutor profile"
              className="profile-avatar"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="profile-photo-input"
            onChange={handlePhotoSelected}
          />
          <button
            type="button"
            className="btn btn-secondary profile-avatar-button"
            onClick={handlePickPhoto}
          >
            Change photo
          </button>
        </div>

        <div className="profile-details-column">
          <h3 className="profile-name">{profile.fullName}</h3>
          <p className="profile-role">{profile.role}</p>

          <div className="profile-details-grid">
            <article className="profile-detail-item">
              <span className="profile-detail-label">Email</span>
              <span className="profile-detail-value">{profile.email}</span>
            </article>
            <article className="profile-detail-item">
              <span className="profile-detail-label">Phone</span>
              <span className="profile-detail-value">{profile.phone}</span>
            </article>
            <article className="profile-detail-item">
              <span className="profile-detail-label">Staff ID</span>
              <span className="profile-detail-value">{profile.staffId}</span>
            </article>
            <article className="profile-detail-item">
              <span className="profile-detail-label">Faculty</span>
              <span className="profile-detail-value">{profile.faculty}</span>
            </article>
            <article className="profile-detail-item profile-detail-item-full">
              <span className="profile-detail-label">Office</span>
              <span className="profile-detail-value">{profile.office}</span>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
