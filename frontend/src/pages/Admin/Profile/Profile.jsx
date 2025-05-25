import { useApi } from "../../../context/ApiContext";


export default function AdminProfile() {

const {admin} = useApi();


  return (
    <div className="container mt-5">
      <h2>Admin Profile</h2>
      <div className="card p-4 mt-3">
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Phone:</strong> {admin.phone_number}</p>
        <p><strong>UID:</strong> {admin.uid}</p>
        <p><strong>Address:</strong> {admin.address}</p>
        <p><strong>ID:</strong> {admin._id}</p>
      </div>
    </div>
  );
}
