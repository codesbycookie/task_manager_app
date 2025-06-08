import { useApi } from "../../../context/ApiContext";
import "./Profile.css";

export default function AdminProfile() {
  const { admin } = useApi();

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="profile-card card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4 profile-heading">Admin Profile</h3>
        <p><strong className="text-green">Name:</strong> {admin.name}</p>
        <p><strong className="text-green">Email:</strong> {admin.email}</p>
        <p><strong className="text-green">Phone:</strong> {admin.phone_number}</p>
        <p><strong className="text-green">UID:</strong> {admin.uid}</p>
        <p><strong className="text-green">Address:</strong> {admin.address}</p>
        <p><strong className="text-green">ID:</strong> {admin._id}</p>
      </div>
    </div>
  );
}
