const baseUrl = import.meta.env.VITE_BASE_URL;

const urls = {
  // User URLs
  registerUserUrl: `${baseUrl}/user-register`,
  loginUserUrl: `${baseUrl}/user/user-login`,
  updateUserUrl: (userId) => `${baseUrl}/user-update/${userId}`,
  deleteUserUrl: (userId) => `${baseUrl}/admin/user-delete/${userId}`,
  fetchUsersUrl: `${baseUrl}/get-all-users`,

  // Task URLs
  addTaskUrl: `${baseUrl}/tasks/admin/add-task`,
  editTaskUrl: (taskId) => `${baseUrl}/tasks/admin/edit-task/${taskId}`,
  deleteTaskStatusUrl: (taskStatusId) => `${baseUrl}/tasks/admin/delete-task/${taskStatusId}`,
  getTasksForUserUrl: (userId) => `${baseUrl}/tasks/fetch-tasks-for-user/${userId}`,
  getTasksForAdminUrl: (userId) => `${baseUrl}/tasks/admin/tasks-for-user/${userId}`,
  submitTaskUrl: `${baseUrl}/tasks/submit-task`,

  // Branch URLs
  createBranchUrl: `${baseUrl}/admin/create-branch`,
  fetchBranchesUrl: `${baseUrl}/admin/branches`,
  editBranchUrl: (branchId) => `${baseUrl}/admin/edit-branch/${branchId}`,
  deleteBranchUrl: (branchId) => `${baseUrl}/admin/delete-branch/${branchId}`,

  // Admin URLs
  loginAdminUrl: `${baseUrl}/admin/admin/login`,
};

export default urls;
