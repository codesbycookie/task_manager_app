import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import urls from "../utils/ApiUrls";
import handleApiError from "../utils/HandleApiError";

const {
  registerUserUrl,
  loginUserUrl,
  updateUserUrl,
  deleteUserUrl,
  fetchUsersUrl,
  addTaskUrl,
  editTaskUrl,
  deleteTaskStatusUrl,
  getTasksForUserUrl,
  getTasksForAdminUrl,
  submitTaskUrl,
  createBranchUrl,
  fetchBranchesUrl,
  editBranchUrl,
  deleteBranchUrl,
  loginAdminUrl,
} = urls;

console.log("API URLs:", {
  registerUserUrl,
  loginUserUrl,
  updateUserUrl,
  deleteUserUrl,
  fetchUsersUrl,
  addTaskUrl,
  editTaskUrl,
  deleteTaskStatusUrl,
  getTasksForUserUrl,
  getTasksForAdminUrl,
  submitTaskUrl,
  createBranchUrl,
  fetchBranchesUrl,
  editBranchUrl,
  deleteBranchUrl,
  loginAdminUrl,
});

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [admin, setAdmin] = useState({});
  const [branches, setBranches] = useState([]);

  const { signup, loginFirebase, logoutFirebase, changePasswordFirebase } = useAuth();

  const fetchUserOrAdmin = async () => {
    const admin_uid = getCookie("admin_uid");

    if (admin_uid) {
      const res = await postRequest(loginAdminUrl, { uid: admin_uid });
      if (res?.admin) {
        console.log(res);
        setAdmin(res.admin);
        setBranches(res.branches);
        setUsers(res.users);
      }
    } else {
      const user_uid = getCookie("user_uid");
      if (user_uid) {
        const res = await postRequest(loginUserUrl, { uid: user_uid });
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
  console.log("user uid: ", getCookie("user_uid"));

  const navigate = useNavigate();

  const login = async (formData) => {
    console.log("Login function called with formData:", formData);
    setLoading(true);

    try {
      console.log(formData);
      removeCookie("admin_uid");
      removeCookie("user_uid");
      const user = await loginFirebase(formData.email, formData.password);
      if (user) {
        console.log(user.user);
        if (formData.isAdmin) {
          const data = await postRequest(loginAdminUrl, {
            uid: user.user.uid,
          });
          console.log(data.admin);
          setCookie("admin_uid", user.user.uid);
          fetchUserOrAdmin();
          navigate("/admin/");
          toast.success(`Welcome back! ${data.admin.name}`);
        } else {
          const data = await postRequest(loginUserUrl, {
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
          registerUserUrl,
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
        deleteUserUrl(userUid),
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
        fetchBranchesUrl,
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
        fetchUsersUrl,
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
      const response = await postRequest(createBranchUrl, branch, {
        admin_uid: admin.uid,
      });
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
        deleteBranchUrl(branchId),
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
      await putRequest(editBranchUrl(branchId), formData, {
        admin_uid: admin.uid,
      });
      fetchBranches();
      navigate("/admin/branches");
    } catch (err) {
      navigate("/admin/branches");
      handleApiError(err);
    }
  };

  const assignTask = async (task) => {
    try {
      const response = postRequest(addTaskUrl, task, { admin_uid: admin.uid });
      navigate(-1);
      console.log('assigned task',response);

      toast.success(response.message);
    } catch (err) {
      handleApiError(err);
    }
  };

  const editTask = async (task) => {
    try {
      console.log("Updated data:", task);
      const res = await putRequest(editTaskUrl(task._id), task, {
        admin_uid: admin.uid,
      });
      toast.success(res.message);
      navigate(-1);
    } catch (err) {
      handleApiError(err);
    }
  };

  const deleteTask = async (taskStatusId, userId, selectedDate) => {
    try {
      const response = await deleteRequest(
        deleteTaskStatusUrl(taskStatusId),
        {},
        { admin_uid: admin.uid }
      );
      toast.success(response.message);
      fetchTasksForAdmin(userId, selectedDate);
      console.log(response);
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchTasksForAdmin = async (userId, selectedDate) => {
    try {
      const response = await getRequest(
        getTasksForAdminUrl(userId),
        {},
        { admin_uid: admin.uid }
      );
      console.log(response);
      console.log(`response for the date ${selectedDate}`, response);
      setTasks([]);
      setTasks(response.tasks);
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchTasksForUser = async () => {
    setLoading(true);
    try {
      const response = await getRequest(
        getTasksForUserUrl(user._id),
        {},
        { user_uid: user._id }
      );
      console.log("Fetched tasks for user:", response);
      setUserTasks(response.tasks || []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const submitTask = async (taskId, taskStatusId) => {
    setLoading(true);
    try {
      const response = await postRequest(
        submitTaskUrl,
        {
          userId: user._id,
          taskId: taskId,
          taskStatusId: taskStatusId,
          date: new Date(),
        },
        { user_uid: user._id }
      );
      console.log("Task submitted successfully:", response);
      toast.success(response.message || "Task submitted successfully");
      fetchTasksForUser();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const changePasswordForUser = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    setLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
      const result = await changePasswordFirebase(currentPassword, newPassword);
      if (result.success) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(`Error: ${result.error}`);
      }
      navigate("/user");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
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
    fetchTasksForUser,
    userTasks,
    loading,
    submitTask,
    changePasswordForUser,
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
