/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie, setCookie, removeCookie } from "../utils/CookieService";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/apiService";
import urls from "../utils/ApiUrls";

import { useAuth } from "./AuthContext";
import handleApiError from "../utils/HandleErrMsgs";

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const {
    adminLoginUrl,
    userRegistrationUrl,
    userLoginUrl,
    adminAssignTaskUrl,
    adminGetTasksByIdUrl,
    adminUpdateTaskUrl,
    adminDeleteTaskUrl,
    adminGetAllUsersUrl,
    userAddReportUrl,
    deleteUserUrl,
    fetchNotificationsUrl,
    editUserUrl,
  } = urls;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [admin, setAdmin] = useState(null);

  console.log(getCookie("admin_uid"), admin);

  useEffect(() => {
    const fetchAdmin = async () => {
      const uid = getCookie("admin_uid");
      console.log("admin uid", uid);
      if (uid) {
        try {
          const data = await postRequest(adminLoginUrl, { uid });
          setAdmin(data.admin);
          fetch_notifications(data.admin.uid);
        } catch (error) {
          handleApiError(error);
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    };

    fetchAdmin();
  }, []);

  const [users, setUsers] = useState([]);

  const { signup, loginFirebase, logoutFirebase } = useAuth();

  const navigate = useNavigate();

  // =========================
  // ADMIN FUNCTIONALITIES
  // =========================

  // Adds a new user to the system (admin functionality)
  const add_user = async (formData) => {
    console.log("add user function calling...");
    setLoading(true);
    try {
      console.log(formData);
      const DEFAULT_PASSWORD = "12345678";
      const user = await signup(formData.email, DEFAULT_PASSWORD);
      if (user) {
        console.log(user.user);
        const data = await postRequest(userRegistrationUrl, {
          ...formData,
          uid: user.user.uid,
        });
        console.log(data);
      }
      fetch_users();
      fetch_notifications();
      navigate("/admin/users");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetch_users = async () => {
    try {
      const res = await getRequest(adminGetAllUsersUrl);
      setUsers(res);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetch_notifications = async (adminUid) => {
    try {
      console.log(admin);
      const res = await postRequest(`${fetchNotificationsUrl}`, {
        adminUid: adminUid || admin.uid,
      });
      setNotifications(res);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetch_tasks = async (userId) => {
    setLoading(true);
    try {
      const data = await getRequest(`${adminGetTasksByIdUrl}${userId}`);
      setTasks([]);
      setTasks(data.tasks);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Assigns a task to a specific user (admin functionality)
  const assign_task = async (formData) => {
    console.log("Assign task function called");
    setLoading(true);
    try {
      const data = await postRequest(adminAssignTaskUrl, {
        ...formData,
        adminUid: admin.uid,
      });
      fetch_tasks(formData.userId);
      console.log(data);
      toast.success(`Task assigned`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const delete_user = async (userId) => {
    console.log("Delete user function called with ID:", userId);
    setLoading(true);
    try {
      const data = await deleteRequest(`${deleteUserUrl}`, {
        userId: userId,
        adminUid: admin.uid,
      });
      console.log(data);
      fetch_users();
      toast.success(`User id: ${userId} deleted successfully`);
    } catch (error) {
      handleApiError(error);
      ;
    } finally {
      setLoading(false);
    }
  };

  // Updates task details such as deadline, description, or assigned user (admin functionality)
  const update_task = async ({ taskId, task, userId }) => {
    try {
      console.log(taskId, task, userId);
      const data = await putRequest(adminUpdateTaskUrl, {
        taskId: taskId,
        adminUid: admin.uid,
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
      });
      console.log(data);
      fetch_tasks(userId);
      toast.success(`Task id: ${taskId} updated successfully`);
    } catch (error) {
      handleApiError(error);

    }
  };

  const update_user = async (userId, formData) => {
    setLoading(true);
    try {
      console.log(userId, formData);
      const data = await putRequest(`${editUserUrl}`, {
        userId: userId,
        adminUid: admin.uid,
        ...formData,
      });
      console.log(data);
      fetch_users();
      toast.success(`User id: ${userId} updated successfully`);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Deletes a task permanently from the system (admin functionality)
  const delete_task = async (id, userId) => {
    console.log("Delete task function called with ID:", id);
    setLoading(true);
    try {
      const data = await deleteRequest(`${adminDeleteTaskUrl}`, {
        taskId: id,
        adminUid: admin.uid,
      });
      console.log(data);
      fetch_tasks(userId);
      toast.success(`Task id: ${id} deleted successfully`);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetches all notifications related to admin actions or system updates
  const get_notifications = () => {};

  // Retrieves a list of all registered users in the system
  const get_users = () => {};

  // Fetches profile details and stats for the currently logged-in admin
  const get_admin_info = () => {};

  // =========================
  // COMMON FUNCTIONALITIES (Admin & Users)
  // =========================

  // Handles user/admin login by validating credentials and setting auth cookies

  const login = async (formData) => {
    console.log("Login function called with formData:", formData);
    setLoading(true);
    try {
      console.log(formData)
      const user = await loginFirebase(formData.email, formData.password);
      if (user) {
        console.log(user.user);
        const userData = {
          email: formData.email,
          uid: user.user.uid,
          name: "vignesh",
          phone_number: 6385138282,
          address:
            "No.37, Thiruvalluvar nagar main road, Keelkatalai, Chennai - 600117",
          branch: "Kolathur",
        };
        if(formData.isAdmin) {
          const data = await postRequest(adminLoginUrl, {
            uid: userData.uid,
          });
          console.log(data);
        setAdmin(data.admin);
        setCookie("admin_uid", user.user.uid);
        navigate("/admin/");
        toast.success(`Welcome back! ${data.admin.name}`);
        }else {
          const data = await postRequest(userLoginUrl, {
            uid: userData.uid,    
          });
          console.log(data);
          setUser(data.user);
          navigate("/user/");
          toast.success(`Welcome back! ${data.user.name}`);
        }
        
        // if(formData.isAdmin){
        //   console.log('admin login')
        // }else{
        //   console.log('user login')
        // }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };     

  // Logs out the current user/admin by clearing cookies and session data
  const logout = () => {
    console.log("Logout function called");
    setLoading(true);
    try {
      logoutFirebase();
      removeCookie("admin_uid");
      setAdmin(null);
      navigate("/");
      toast.success(`Logged out successfully`);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // USER FUNCTIONALITIES
  // =========================

  // Fetches profile information for the currently logged-in user
  const get_user_info = () => {};

  // Retrieves all tasks assigned to the currently logged-in user
  const get_tasks = () => {};

  // Marks a user’s task as completed and updates its status in the backend
  const complete_task = () => {};

  // Allows users to report issues or leave comments on tasks
  const report_comment = () => {};

  const value = {
    loading,
    add_user,
    assign_task,
    login,
    logout,
    admin,
    fetch_tasks,
    tasks,
    users,
    delete_task,
    update_task,
    delete_user,
    fetch_users,
    update_user,
    fetch_notifications,
    notifications,
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
