/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie, setCookie, removeCookie } from "../utils/CookieService";
import { useAuth } from "./AuthContext";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/ApiService";
import handleFirebaseError from "../utils/HandleFirebaseError";
// import { toast } from "react-toastify";
// import Loading from "../pages/components/Loading/Loading";
// import { useNavigateOnce } from "../utils/UseNavigateOnce";
import urls from "../utils/ApiUrls";
import handleApiError from "../utils/HandleApiError";

const {
  addProductUrl,
  fetchAdminUrl,
  fetchOrdersUrl,
  fetchProducts,
  deleteProductUrl,
} = urls;
const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  // const fetchUserOrAdmin = async () => {
  //   const adminLoginUrl = "http://localhost:3000/api/admin/admin/login";
  //   const userLoginUrl = "http://localhost:3000/api/user/user-login";

  //   const admin_uid = getCookie("admin_uid");
  //   if (admin_uid) {
  //     const res = await postRequest(adminLoginUrl, {
  //       uid: admin_uid,
  //     });
  //     console.log(res)
  //     return res.admin;
  //   } else {
  //     const user_uid = getCookie("user_uid");
  //     if (user_uid) {
  //       const res = await postRequest(userLoginUrl, { uid: user_uid });
  //       return res.user;
  //     }
  //   }
  // };

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [admin, setAdmin] = useState({});
  const [branches, setBranches] = useState([]);

  const fetchUserOrAdmin = async () => {
    const adminLoginUrl = "http://localhost:3000/api/admin/admin/login";
    const userLoginUrl = "http://localhost:3000/api/user/user-login";

    const admin_uid = getCookie("admin_uid");

    if (admin_uid) {
      const res = await postRequest(adminLoginUrl, { uid: admin_uid });
      if (res?.admin) {
        console.log(res);
        setAdmin(res.admin);
        setBranches(res.branches);
        setUsers(res.users);
      }
    } else {
      const user_uid = getCookie("user_uid");
      if (user_uid) {
        const res = await postRequest(userLoginUrl, { uid: user_uid });
        if (res?.user) {
          setUser(res.user);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserOrAdmin();
  }, []);

  console.log(admin);

  console.log("admin uid: ", getCookie("admin_uid"));

  // console.log(getCookie("user_uid"));

  const { signup, loginFirebase, logoutFirebase } = useAuth();
  const navigate = useNavigate();

  const login = async (formData) => {
    console.log("Login function called with formData:", formData);
    setLoading(true);

    const adminLoginUrl = "http://localhost:3000/api/admin/admin/login";
    const userLoginUrl = "http://localhost:3000/api/user/user-login";
    try {
      console.log(formData);
      removeCookie("admin_uid");
      removeCookie("user_uid");
      const user = await loginFirebase(formData.email, formData.password);
      if (user) {
        console.log(user.user);
        if (formData.isAdmin) {
          const data = await postRequest(adminLoginUrl, {
            uid: user.user.uid,
          });
          console.log(data.admin);
          setCookie("admin_uid", user.user.uid);
          navigate("/admin/");
          toast.success(`Welcome back! ${data.admin.name}`);
        } else {
          const data = await postRequest(userLoginUrl, {
            uid: user.user.uid,
          });
          console.log(data);
          setUser(data.user);
          setCookie("user_uid", user.user.uid);
          navigate("/user/");
          toast.success(`Welcome back! ${data.user.name}`);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (formData) => {
    setLoading(true);
    try {
      const user = await signup(
        formData.email,
        (formData.password = "12345678")
      );
      if (user) {
        console.log(user.user.uid);
        console.log({ uid: user.user.uid, ...formData });
        const response = await postRequest(
          "http://localhost:3000/api/user/user-register",
          {
            uid: user.user.uid,
            branchId: formData.branch,
            ...formData,
          },
          { admin_uid: admin.uid }
        );
        fetchUsers();
        console.log(response);
        toast.success(response.message || "User added successfully");
        navigate("/admin/users");
      } else {
        toast.error("User Registration Failed! Please try again.");
      }
    } catch (error) {
      handleApiError(error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userUid) => {
    try {
      const res = await deleteRequest(
        `http://localhost:3000/api/user/admin/user-delete/${userUid}`,
        {},
        { admin_uid: admin.uid }
      );
      fetchUsers();
      toast.success(res.message);
    } catch (err) {
      handleApiError(err);
      handleFirebaseError(err);
    }
  };

  const fetchBranches = async () => {
    try {
      console.log(admin.uid);
      const response = await getRequest(
        "http://localhost:3000/api/branch/admin/branches",
        {},
        { admin_uid: admin.uid }
      );
      setBranches([]);
      setBranches(response.branches);
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getRequest(
        "http://localhost:3000/api/user/get-all-users",
        {},
        { admin_uid: admin.uid }
      );
      setUsers(response.users);
    } catch (err) {
      handleApiError(err);
    }
  };

  const createBranch = async (branch) => {
    try {
      const response = await postRequest(
        "http://localhost:3000/api/branch/admin/create-branch",
        branch,
        { admin_uid: admin.uid }
      );
      navigate("/admin/branches");
      fetchBranches();
      toast.success(response.message);
    } catch (err) {
      handleApiError(err);
    }
  };

  const deleteBranch = async (branchId) => {
    try {
      const response = await deleteRequest(
        "http://localhost:3000/api/branch/admin/delete-branch/" + branchId,
        {},
        { admin_uid: admin.uid }
      );
      fetchBranches();
      navigate("/admin/branches");
      console.log(response);
    } catch (err) {
      navigate("/admin/branches");
      handleApiError(err);
    }
  };

  const editBranch = async (branchId, formData) => {
    try {
      console.log("Updated data:", formData);
      await putRequest(
        `http://localhost:3000/api/branch/admin/edit-branch/${branchId}`,
        formData,
        { admin_uid: admin.uid }
      );
      fetchBranches();
      navigate("/admin/branches");
    } catch (err) {
      navigate("/admin/branches");
      handleApiError(err);
    }
  };

  const assignTask = async (task) => {
    try {
      const response = postRequest(
        "http://localhost:3000/api/tasks/admin/add-task",
        task,
        { admin_uid: admin.uid }
      );
      navigate("/admin/users");
      toast.success(response.message);
    } catch (err) {
      handleApiError(err);
    }
  };

  const editTask = async (task) => {
    try {
      console.log("Updated data:", task);
      const res = await putRequest(
        `http://localhost:3000/api/tasks/admin/edit-task/${task._id}`,
        task,
        { admin_uid: admin.uid }
      );
      toast.success(res.message);
      navigate(-1);
    } catch (err) {
      handleApiError(err);
    }
  };

  const deleteTask = async (taskId, userId) => {
    try {
      const response = await deleteRequest(
        "http://localhost:3000/api/tasks/admin/delete-task/" + taskId,
        {},
        { admin_uid: admin.uid }
      );
      toast.success(response.message);
      fetchTasksForAdmin(userId);
      console.log(response);
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchTasksForAdmin = async (userId) => {
    try {
      const response = await getRequest(
        `http://localhost:3000/api/tasks/fetch-tasks-for-user/${userId}`,
        { userId: userId }
      );
      console.log(response);
      setTasks([]);
      setTasks(response.tasks);
    } catch (err) {
      handleApiError(err);
    }
  };

  const logout = async () => {
    try {
      logoutFirebase();
      removeCookie("admin_uid");
      removeCookie("user_uid");
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (err) {
      handleApiError(err);
      handleFirebaseError(err);
    }
  };

  // ///ERROR HANDLING FOR LOADINGS AND ERRORS

  const value = {
    login,
    admin,
    addUser,
    fetchBranches,
    fetchUsers,
    users,
    deleteUser,
    branches,
    editBranch,
    deleteBranch,
    tasks,
    assignTask,
    editTask,
    deleteTask,
    createBranch,
    fetchTasksForAdmin,
    logout,
    fetchUserOrAdmin,
    user,
  };
  return (
    <ApiContext.Provider value={value}>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {children}
    </ApiContext.Provider>
  );
}
