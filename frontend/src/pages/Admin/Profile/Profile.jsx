import { useApi } from "../../../context/ApiContext";
import "./Profile.css";

export default function AdminProfile() {
  const { admin } = useApi();

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-90 ms-0 ">
  <div className="profile-card card border-0 p-4 w-100" style={{ 
    maxWidth: "500px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    background: "#fff",
  }}>
    <div className="text-center mb-4">
      <img src="../download.png" alt="" height={80} width={80} className="profile-pic"/>
      <h3 className="profile-heading mb-0" style={{
        color: "#343a40",
        fontWeight: "600",
        letterSpacing: "0.5px"
      }}>Admin Profile</h3>
    </div>

    <div className="profile-details">
      {[
        { label: "Name", value: admin.name },
        { label: "Email", value: admin.email },
        { label: "Phone", value: admin.phone_number },
        { label: "UID", value: admin.uid },
        { label: "Address", value: admin.address },
        { label: "ID", value: admin._id }
      ].map((item, index) => (
        <div key={index} className="d-flex align-items-start mb-3" style={{
          borderBottom: "1px solid #e9ecef",
          paddingBottom: "12px"
        }}>
          <strong className="text-green me-2" style={{
            minWidth: "80px",
            color: "#8dc540",
            fontWeight: "600"
          }}>{item.label}:</strong>
          <span style={{
            color: "#495057",
            wordBreak: "break-word"
          }}>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}
