import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Loader2, ChevronLeft } from "lucide-react";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="profile-page animate-fade">
      <div className="profile-container glass">
        <Link to="/" className="back-btn">
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="profile-header">
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">Your personal information</p>
        </div>

        <div className="profile-content">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="profile-avatar"
              />
              <label className={`upload-btn ${isUpdatingProfile ? "disabled" : ""}`}>
                <Camera className="camera-icon" size={20} />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="upload-hint">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="info-section">
            <div className="info-group">
              <label className="info-label">
                <User size={18} />
                Full Name
              </label>
              <div className="info-value">{authUser?.fullName}</div>
            </div>

            <div className="info-group">
              <label className="info-label">
                <Mail size={18} />
                Email Address
              </label>
              <div className="info-value">{authUser?.email}</div>
            </div>
          </div>

          <div className="account-details">
            <h2 className="section-title">Account Information</h2>
            <div className="details-list">
              <div className="detail-item">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="detail-item">
                <span>Account Status</span>
                <span className="status-badge">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;