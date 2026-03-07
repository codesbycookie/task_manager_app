const baseUrl = import.meta.env.VITE_BASE_URL;

const apiurls = {
  users: {
    register: {
      method: "post",
      url: () => `${baseUrl}/user/user-register`,
    },

    login: {
      method: "post",
      url: () => `${baseUrl}/user/user-login`,
    },

    getAll: {
      method: "get",
      url: () => `${baseUrl}/user/get-all-users`,
    },

    update: {
      method: "put",
      url: (userId) => `${baseUrl}/user/user-update/${userId}`,
    },

    delete: {
      method: "delete",
      url: (userId) => `${baseUrl}/user/admin/user-delete/${userId}`,
    },
  },

  tasks: {
    create: {
      method: "post",
      url: () => `${baseUrl}/tasks/admin/add-task`,
    },

    edit: {
      method: "put",
      url: (taskId) => `${baseUrl}/tasks/admin/edit-task/${taskId}`,
    },

    delete: {
      method: "delete",
      url: (taskStatusId) =>
        `${baseUrl}/tasks/admin/delete-task/${taskStatusId}`,
    },

    getForUser: {
      method: "get",
      url: (userId, today) =>
        `${baseUrl}/tasks/fetch-tasks-for-user/${userId}?date=${today}`,
    },

    getForAdmin: {
      method: "get",
      url: (userId) => `${baseUrl}/tasks/admin/tasks-for-user/${userId}`,
    },

    submit: {
      method: "post",
      url: () => `${baseUrl}/tasks/submit-task`,
    },

    getTasksForAddUser: {
      method: "get",
      url: (id) => `${baseUrl}/tasks/admin/tasks-to-copy/${id}`,
    },
  },

  branches: {
    create: {
      method: "post",
      url: () => `${baseUrl}/branch/admin/create-branch`,
    },

    getAll: {
      method: "get",
      url: () => `${baseUrl}/branch/admin/branches`,
    },

    edit: {
      method: "put",
      url: (branchId) => `${baseUrl}/branch/admin/edit-branch/${branchId}`,
    },

    delete: {
      method: "delete",
      url: (branchId) =>
        `${baseUrl}/branch/admin/delete-branch/${branchId}`,
    },
  },

  admins: {
    login: {
      method: "post",
      url: () => `${baseUrl}/admin/admin/login`,
    },
  },
};

export { apiurls };