import { API, Auth } from 'aws-amplify';

const apiName = 'TaskBuddyAPI';

export async function fetchWithAuth(path: string, options: any = {}) {
  try {
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    
    return await API.get(apiName, path, mergedOptions);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export async function getTasks(status?: string) {
  const path = status ? `/tasks?status=${status}` : '/tasks';
  return fetchWithAuth(path);
}

export async function getTask(taskId: string) {
  return fetchWithAuth(`/tasks/${taskId}`);
}

export async function updateTaskStatus(taskId: string, status: string, comment?: string) {
  return fetchWithAuth(`/tasks/${taskId}/status`, {
    body: { status, comment },
    method: 'PUT',
  });
}

export async function getUploadUrl(fileType: string, taskId: string) {
  return fetchWithAuth('/upload', {
    body: { fileType, taskId },
    method: 'POST',
  });
}

export async function getDownloadUrl(key: string) {
  return fetchWithAuth(`/files/${key}`);
}

// Admin API calls
export async function adminCreateUser(userData: any) {
  return fetchWithAuth('/admin/users', {
    body: userData,
    method: 'POST',
  });
}

export async function adminListUsers() {
  return fetchWithAuth('/admin/users');
}

export async function adminCreateTask(taskData: any) {
  return fetchWithAuth('/admin/tasks', {
    body: taskData,
    method: 'POST',
  });
}

export async function adminAssignTask(taskId: string, userId: string) {
  return fetchWithAuth(`/admin/tasks/${taskId}/assign`, {
    body: { userId },
    method: 'POST',
  });
}

export async function adminListTasks() {
  return fetchWithAuth('/admin/tasks');
}