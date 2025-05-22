const baseUrl = import.meta.env.VITE_BASE_URL;

const urls = {
  // User URLs
  registerUserUrl: `${baseUrl}/user-register`,
  loginUserUrl: `${baseUrl}/user-login`,
  updateUserUrl: (userId) => `${baseUrl}/user-update/${userId}`,
  deleteUserUrl: (userId) => `${baseUrl}/user-delete/${userId}`,

  // Task URLs
  addTaskUrl: `${baseUrl}/api/tasks/admin/add-task`,
  updateTaskUrl: (taskId) => `${baseUrl}/api/tasks/admin/update-task/${taskId}`,
  deleteTaskUrl: (taskId) => `${baseUrl}/api/tasks/admin/delete-task/${taskId}`,
  getTasksForUserUrl: (userId) => `${baseUrl}/api/tasks/admin/tasks-for-user/${userId}`,
  submitTaskUrl: `${baseUrl}/api/tasks/submit-task`,

  // Branch URLs
  createBranchUrl: `${baseUrl}/admin/create-branch`,
  fetchBranchesUrl: `${baseUrl}/branches`,
  updateBranchUrl: (branchId) => `${baseUrl}/admin/edit-branch/${branchId}`,
  deleteBranchUrl: (branchId) => `${baseUrl}/admin/delete-branch/${branchId}`,
};

export default urls;
