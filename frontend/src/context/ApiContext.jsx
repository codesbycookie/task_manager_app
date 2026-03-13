import { useContext, createContext, useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie, setCookie, removeCookie } from "../utils/CookieService";
import { useAuth } from "./AuthContext";
import { useLoading } from "./LoadingContext";
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
  reorderTaskPriorityUrl,
} = urls;

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const [user,      setUser]      = useState({});
  const [users,     setUsers]     = useState([]);
  const [tasks,     setTasks]     = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [sheetUser, setSheetUser] = useState({});
  const [admin,     setAdmin]     = useState({});
  const [branches,  setBranches]  = useState([]);

  const { startLoading, stopLoading } = useLoading();
  const { signup, loginFirebase, logoutFirebase, changePasswordFirebase } = useAuth();
  const navigate = useNavigate();

  const adminUidRef = useRef(null);

  useEffect(() => {
    adminUidRef.current = admin?.uid || null;
  }, [admin]);

  // ─── Auth ──────────────────────────────────────────────────────────────────

  const fetchUserOrAdmin = async () => {
    if (admin?.uid) return;

    const admin_uid = getCookie("admin_uid");
    startLoading("Fetching details");

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
            await fetchTasksForUser(res.user._id, res.user.uid);
          }
        }
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchUserOrAdmin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (formData) => {
    startLoading("Logging in");
    try {
      removeCookie("admin_uid");
      removeCookie("user_uid");
      removeCookie("role");

      const firebaseUser = await loginFirebase(formData.email, formData.password);

      if (firebaseUser) {
        if (formData.isAdmin) {
          const data = await postRequest(loginAdminUrl, { uid: firebaseUser.user.uid });
          setCookie("admin_uid", firebaseUser.user.uid);
          setCookie("role", "admin");
          setAdmin(data.admin);
          setBranches(data.branches);
          setUsers(data.users);
          navigate("/admin/");
          toast.success(`Welcome back! ${data.admin.name}`);
        } else {
          const data = await postRequest(loginUserUrl, { uid: firebaseUser.user.uid });
          setUser(data.user);
          setCookie("user_uid", firebaseUser.user.uid);
          setCookie("role", "user");
          navigate("/user/");
          toast.success(`Welcome back! ${data.user.name}`);
        }
      }
    } catch (error) {
      handleApiError(error);
      handleFirebaseError(error);
    } finally {
      stopLoading();
    }
  };

  const logout = async () => {
    startLoading("Logging out");
    try {
      await logoutFirebase();
      removeCookie("admin_uid");
      removeCookie("user_uid");
      removeCookie("role");
      setUser({});
      setAdmin({});
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (err) {
      handleApiError(err);
      handleFirebaseError(err);
    } finally {
      stopLoading();
    }
  };

  const changePasswordForUser = async (currentPassword, newPassword, confirmPassword) => {
    startLoading("Changing the password");
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
      stopLoading();
    }
  };

  // ─── Users ─────────────────────────────────────────────────────────────────

  const fetchUsers = async () => {
    startLoading("Fetching users");
    try {
      const response = await getRequest(fetchUsersUrl, {}, { admin_uid: adminUidRef.current });
      setUsers(response.users);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const addUser = async (formData) => {
    startLoading("Adding user");
    try {
      const firebaseUser = await signup(formData.email, (formData.password = "12345678"));
      if (firebaseUser) {
        const response = await postRequest(
          registerUserUrl,
          { uid: firebaseUser.user.uid, branchId: formData.branch, ...formData },
          { admin_uid: adminUidRef.current }
        );
        await fetchUsers();
        toast.success(response.message || "User added successfully");
        navigate("/admin/users");
      } else {
        toast.error("User Registration Failed! Please try again.");
      }
    } catch (error) {
      handleApiError(error);
      handleFirebaseError(error);
    } finally {
      stopLoading();
    }
  };

  const editUser = async (userId, updatedData) => {
    startLoading("Updating user");
    try {
      const response = await putRequest(updateUserUrl(userId), updatedData);
      toast.success(response.message || "User updated successfully");
      navigate(-1);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const deleteUser = async (userUid) => {
    startLoading("Deleting user");
    try {
      const res = await deleteRequest(deleteUserUrl(userUid), {}, { admin_uid: adminUidRef.current });
      await fetchUsers();
      toast.success(res.message);
    } catch (err) {
      handleApiError(err);
      handleFirebaseError(err);
    } finally {
      stopLoading();
    }
  };

  // ─── Branches ──────────────────────────────────────────────────────────────

  const fetchBranches = async () => {
    startLoading("Fetching branches");
    try {
      const response = await getRequest(fetchBranchesUrl, {}, { admin_uid: adminUidRef.current });
      setBranches(response.branches);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const createBranch = async (branch) => {
    startLoading("Creating branch");
    try {
      const response = await postRequest(createBranchUrl, branch, { admin_uid: adminUidRef.current });
      await fetchBranches();
      navigate("/admin/branches");
      toast.success(response.message);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const editBranch = async (branchId, formData) => {
    startLoading("Updating branch");
    try {
      const response = await putRequest(editBranchUrl(branchId), formData, { admin_uid: adminUidRef.current });
      await fetchBranches();
      navigate("/admin/branches");
      toast.success(response.message || "Branch edited successfully");
    } catch (err) {
      navigate("/admin/branches");
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const deleteBranch = async (branchId) => {
    startLoading("Deleting branch");
    try {
      const response = await deleteRequest(deleteBranchUrl(branchId), {}, { admin_uid: adminUidRef.current });
      await fetchBranches();
      navigate("/admin/branches");
      toast.success(response.message || "Branch deleted successfully");
    } catch (err) {
      navigate("/admin/branches");
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  // ─── Tasks (Admin) ─────────────────────────────────────────────────────────

  const fetchTasksForAdmin = useCallback(async (userId, date) => {
    if (!userId || userId === "undefined") return;
    startLoading("Fetching tasks");
    try {
      const response = await getRequest(
        getTasksForAdminUrl(userId, date),
        {},
        { admin_uid: adminUidRef.current }
      );
      setSheetUser(response.user);
      setTasks(response.tasks);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const assignTask = async (task) => {
    startLoading("Assigning task");
    try {
      const response = await postRequest(addTaskUrl, task, { admin_uid: adminUidRef.current });
      toast.success(response.message || "Task assigned successfully");
      await fetchUsers();
      navigate("/admin/users");
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const editTask = async (task) => {
    startLoading("Updating task");
    try {
      const res = await putRequest(editTaskUrl(task._id), task, { admin_uid: adminUidRef.current });
      toast.success(res.message);
      navigate(-1);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const deleteTask = async (taskStatusId, userId, date) => {
    startLoading("Deleting task");
    try {
      const response = await deleteRequest(
        deleteTaskStatusUrl(taskStatusId),
        {},
        { admin_uid: adminUidRef.current }
      );
      toast.success(response.message);
      await fetchTasksForAdmin(userId, date);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const reorderTasks = async (userId, orderedTaskStatusIds, date) => {
    try {
      await postRequest(
        reorderTaskPriorityUrl(userId),
        { tasks: orderedTaskStatusIds, date },
        { admin_uid: adminUidRef.current }
      );
      
      toast.success("Tasks reordered successfully");
      
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchTasksForAddUserPage = async (id) => {
    try {
      const response = await getRequest(getTasksForAddUser(id), {}, { admin_uid: adminUidRef.current });
      return response.tasks;
    } catch (err) {
      handleApiError(err);
    }
  };

  // ─── Tasks (User) ──────────────────────────────────────────────────────────

  const fetchTasksForUser = async (mongoId, firebaseUid) => {
    startLoading("Fetching tasks");
    try {
      const response = await getRequest(
        getTasksForUserUrl(mongoId),
        {},
        { user_uid: firebaseUid || user.uid }
      );
      setUserTasks(response.tasks || []);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  const submitTask = async (taskId, taskStatusId) => {
    startLoading("Submitting task");
    try {
      const response = await postRequest(
        submitTaskUrl,
        {
          userId: user._id,
          taskId,
          taskStatusId,
          date: new Date().toISOString().split("T")[0],
        },
        { user_uid: user.uid }
      );
      toast.success(response.message || "Task submitted successfully");
      await fetchTasksForUser(user._id, user.uid);
    } catch (err) {
      handleApiError(err);
    } finally {
      stopLoading();
    }
  };

  // ─── Context Value ─────────────────────────────────────────────────────────

  const value = useMemo(() => ({
    login, logout, admin, user, fetchUserOrAdmin,
    changePasswordForUser, addUser, editUser, deleteUser,
    fetchUsers, users, branches, fetchBranches, createBranch,
    editBranch, deleteBranch, tasks, assignTask, editTask,
    deleteTask, fetchTasksForAdmin, fetchTasksForAddUserPage,
    reorderTasks, userTasks, fetchTasksForUser, submitTask,
    sheetUser,
  }), [
    admin, user, users, branches, tasks, userTasks,
    sheetUser, fetchTasksForAdmin,
  ]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}