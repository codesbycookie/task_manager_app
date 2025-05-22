// Base URLs
const baseUrl = import.meta.env.VITE_BASE_URL;

// Endpoints
const adminLoginUrl = `${baseUrl}${import.meta.env.VITE_ADMIN_LOGIN}`;
const userRegistrationUrl = `${baseUrl}${import.meta.env.VITE_USER_REGISTER}`;
const userLoginUrl = `${baseUrl}${import.meta.env.VITE_USER_LOGIN}`;
const adminAssignTaskUrl = `${baseUrl}${import.meta.env.VITE_ADMIN_ASSIGN_TASK}`;
const adminGetTasksByIdUrl = `${baseUrl}${import.meta.env.VITE_ADMIN_GET_TASKS_BY_ID}`;
const adminUpdateTaskUrl = `${baseUrl}${import.meta.env.VITE_ADMIN_UPDATE_TASK}`;
const adminDeleteTaskUrl = `${baseUrl}${import.meta.env.VITE_ADMIN_DELETE_TASK}`;
const adminGetAllUsersUrl = `${baseUrl}${import.meta.env.VITE_ADMIN_GET_ALL_USERS}`;
const userAddReportUrl = `${baseUrl}${import.meta.env.VITE_USER_ADD_REPORT}`;
const deleteUserUrl = `${baseUrl}${import.meta.env.VITE_DELETE_USER}`;
const fetchNotificationsUrl = `${baseUrl}${import.meta.env.VITE_FETCH_NOTIFICATIONS}`;
const editUserUrl = `${baseUrl}${import.meta.env.VITE_EDIT_USER}`;

const urls = {
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
  editUserUrl
};

export default urls
