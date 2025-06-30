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
  getTasksForAddUser,
} = urls;

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [userTasks, setUserTasks] = useState([]);
  const [sheetUser, setSheetUser] = useState({});
  const [admin, setAdmin] = useState({});
  const [branches, setBranches] = useState([]);

  const { signup, loginFirebase, logoutFirebase, changePasswordFirebase } =
    useAuth();

  const fetchUserOrAdmin = async () => {
    const admin_uid = getCookie("admin_uid");
    setLoading(true);
    setLoaderMessage("Fetching the details");

    try {
      if (admin_uid) {
        const res = await postRequest(loginAdminUrl, { uid: admin_uid });
        if (res?.admin) {
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
            await fetchTasksForUser(res.user._id);
          }
        }
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  useEffect(() => {
    fetchUserOrAdmin();
  }, []);

  const navigate = useNavigate();

  const login = async (formData) => {
    setLoading(true);
    setLoaderMessage("Loggging in");

    try {
      removeCookie("admin_uid");
      removeCookie("user_uid");
      removeCookie("role");
      const user = await loginFirebase(formData.email, formData.password);
      if (user) {
        if (formData.isAdmin) {
          const data = await postRequest(loginAdminUrl, {
            uid: user.user.uid,
          });
          setCookie("admin_uid", user.user.uid);
          setCookie("role", "admin");
          fetchUserOrAdmin();
          navigate("/admin/");
          toast.success(`Welcome back! ${data.admin.name}`);
        } else {
          const data = await postRequest(loginUserUrl, {
            uid: user.user.uid,
          });
          setUser(data.user);
          setCookie("user_uid", user.user.uid);
          setCookie("role", "user");
          navigate("/user/");
          toast.success(`Welcome back! ${data.user.name}`);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const addUser = async (formData) => {
    setLoading(true);
    setLoaderMessage("Adding the user to the database");
    try {
      const user = await signup(
        formData.email,
        (formData.password = "12345678")
      );
      if (user) {
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
      setLoaderMessage("");
    }
  };

  const deleteUser = async (userUid) => {
    setLoading(true);
    setLoaderMessage("Deleting the user");

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
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const fetchBranches = async () => {
    setLoading(true);
    setLoaderMessage("Fetching the branches from the database");

    try {
      const response = await getRequest(
        fetchBranchesUrl,
        {},
        { admin_uid: admin.uid }
      );
      setBranches([]);
      setBranches(response.branches);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setLoaderMessage("Fetching the users from the database");

    try {
      const response = await getRequest(
        fetchUsersUrl,
        {},
        { admin_uid: admin.uid }
      );
      setUsers(response.users);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const editUser = async (userId, updatedData) => {
    setLoading(true);
    setLoaderMessage("Updating the user to the database");

    try {
      const response = await putRequest(updateUserUrl(userId), updatedData);
      toast.success(response.message || "User updated successfully");
      navigate(-1);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const createBranch = async (branch) => {
    setLoading(true);
    setLoaderMessage("Creating a new branch to the database");

    try {
      const response = await postRequest(createBranchUrl, branch, {
        admin_uid: admin.uid,
      });
      navigate("/admin/branches");
      fetchBranches();
      toast.success(response.message);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const deleteBranch = async (branchId) => {
    setLoading(true);
    setLoaderMessage("Deleting the branch from the database");
    try {
      const response = await deleteRequest(
        deleteBranchUrl(branchId),
        {},
        { admin_uid: admin.uid }
      );
      fetchBranches();
      navigate("/admin/branches");
      toast.success(response.message || "Branch has been deleted successfully");
    } catch (err) {
      navigate("/admin/branches");
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const editBranch = async (branchId, formData) => {
    setLoading(true);
    setLoaderMessage("Updating the changes to the database");
    try {
      const response = await putRequest(editBranchUrl(branchId), formData, {
        admin_uid: admin.uid,
      });
      fetchBranches();
      navigate("/admin/branches");
      toast.success(
        response.message || "The branch has been edited successfully"
      );
    } catch (err) {
      navigate("/admin/branches");
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const assignTask = async (task) => {
    setLoading(true);
    setLoaderMessage("Assigning the task to the user");

    try {
      const response = postRequest(addTaskUrl, task, { admin_uid: admin.uid });
      navigate(-1);
      toast.success(response.message);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const editTask = async (task, user) => {
    setLoading(true);
    setLoaderMessage("Updating the task to the database");
    try {
      const res = await putRequest(editTaskUrl(task._id), task, {
        admin_uid: admin.uid,
      });
      toast.success(res.message);
      fetchTasksForAdmin(user._id);
      navigate(-1);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const deleteTask = async (taskStatusId, userId) => {
    setLoading(true);
    setLoaderMessage("Deleting the task from the database");
    try {
      const response = await deleteRequest(
        deleteTaskStatusUrl(taskStatusId),
        {},
        { admin_uid: admin.uid }
      );
      toast.success(response.message);
      fetchTasksForAdmin(userId);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const fetchTasksForAdmin = async (userId) => {
    setLoading(true);
    setLoaderMessage("Fetching the tasks");
    try {
      const response = await getRequest(
        getTasksForAdminUrl(userId),
        {},
        { admin_uid: admin.uid }
      );
      setTasks([]);
      setSheetUser(response.user);
      setTasks(response.tasks);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const fetchTasksForUser = async (id) => {
    setLoading(true);
    setLoaderMessage("Fetching the tasks");
    try {
      console.log(user, id);
      const response = await getRequest(
        getTasksForUserUrl(id || user._id),
        {},
        { user_uid: id || user._id }
      );
      setUserTasks(response.tasks || []);
    } catch (err) {
      console.log(err);
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const submitTask = async (taskId, taskStatusId) => {
    setLoading(true);
    setLoaderMessage("Submiting the task");
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
      toast.success(response.message || "Task submitted successfully");
      fetchTasksForUser();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const changePasswordForUser = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    setLoading(true);
    setLoaderMessage("Changing the password");
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
      setLoaderMessage("");
    }
  };

  const fetchTasksForAddUserPage = async (id) => {
    try {
      const response = await getRequest(
        getTasksForAddUser(id),
        {},
        { admin_uid: admin.uid }
      );
      console.log(response);
      return response.tasks;
    } catch (err) {
      handleApiError(err);
    }
  };

  const logout = async () => {
    setLoading(true);
    setLoaderMessage("Logging out");
    try {
      logoutFirebase();
      removeCookie("admin_uid");
      removeCookie("user_uid");
      removeCookie("role");
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (err) {
      handleApiError(err);
      handleFirebaseError(err);
    } finally {
      setLoading(false);
      setLoaderMessage("");
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
    sheetUser,
    editUser,
    fetchTasksForAddUserPage,
    loaderMessage,
  };
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
