const baseUrl = import.meta.env.VITE_BASE_URL;

const urls = {
  // User URLs
  registerUserUrl: `${baseUrl}/user/user-register`,
  loginUserUrl: `${baseUrl}/user/user-login`,
  updateUserUrl: (userId) => `${baseUrl}/user/user-update/${userId}`,
  deleteUserUrl: (userId) => `${baseUrl}/user/admin/user-delete/${userId}`,
  fetchUsersUrl: `${baseUrl}/user/get-all-users`,

  // Task URLs
  addTaskUrl: `${baseUrl}/tasks/admin/add-task`,
  editTaskUrl: (taskId) => `${baseUrl}/tasks/admin/edit-task/${taskId}`,
  deleteTaskStatusUrl: (taskStatusId) => `${baseUrl}/tasks/admin/delete-task/${taskStatusId}`,
  getTasksForUserUrl: (userId, today) => `${baseUrl}/tasks/fetch-tasks-for-user/${userId}?date=${today}`,
  getTasksForAdminUrl: (userId) => `${baseUrl}/tasks/admin/tasks-for-user/${userId}`,
  submitTaskUrl: `${baseUrl}/tasks/submit-task`,
  getTasksForAddUser: (id) => `${baseUrl}/tasks/admin/tasks-to-copy/${id}`,

  // Branch URLs
  createBranchUrl: `${baseUrl}/branch/admin/create-branch`,
  fetchBranchesUrl: `${baseUrl}/branch/admin/branches`,
  editBranchUrl: (branchId) => `${baseUrl}/branch/admin/edit-branch/${branchId}`,
  deleteBranchUrl: (branchId) => `${baseUrl}/branch/admin/delete-branch/${branchId}`,

  // Admin URLs
  loginAdminUrl: `${baseUrl}/admin/admin/login`,
};

export default urls;
