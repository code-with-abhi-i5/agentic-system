// Frontend API Client connecting to Kortex AI Backend (Port 5000)

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAuthToken = () => {
  return localStorage.getItem("kortex_auth_token") || null;
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("kortex_auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthSession = (token, user) => {
  if (token) localStorage.setItem("kortex_auth_token", token);
  if (user) localStorage.setItem("kortex_auth_user", JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem("kortex_auth_token");
  localStorage.removeItem("kortex_auth_user");
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// ═══════════════════════════════════════════════════════════════
// AUTH APIS
// ═══════════════════════════════════════════════════════════════

export const apiLogin = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid email or password");
  }
  setAuthSession(data.data.accessToken, data.data.user);
  return data.data;
};

export const apiRegister = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Registration failed");
  }
  setAuthSession(data.data.accessToken, data.data.user);
  return data.data;
};

export const apiGetMe = async () => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      clearAuthSession();
      return null;
    }
    const data = await res.json();
    return data.data?.user || null;
  } catch (e) {
    return null;
  }
};

export const apiLogout = async () => {
  const token = getAuthToken();
  try {
    if (token) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (e) {}
  clearAuthSession();
};

// ═══════════════════════════════════════════════════════════════
// DATASETS & TASKS APIS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetch all datasets from Backend
 */
export const getBackendDatasets = async () => {
  try {
    const res = await fetch(`${API_BASE}/datasets`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data?.data?.datasets || [];
  } catch (error) {
    console.warn("Backend datasets fetch fallback:", error.message);
    return null;
  }
};

/**
 * Fetch specific dataset records with server-side pagination
 */
export const getDatasetRecords = async (id, { page = 1, limit = 20, search = "", category = "ALL", sortField = "confidence", sortOrder = "desc" } = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      search,
      category,
      sortField,
      sortOrder
    });
    
    const res = await fetch(`${API_BASE}/datasets/${id}/records?${queryParams.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data?.data || { records: [], total: 0, page: 1, totalPages: 1 };
  } catch (error) {
    console.warn("Backend getDatasetRecords fetch fallback:", error.message);
    return { records: [], total: 0, page: 1, totalPages: 1 };
  }
};

/**
 * Fetch historical workflow tasks from Backend
 */
export const getBackendTasks = async () => {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data?.data?.tasks || [];
  } catch (error) {
    console.warn("Backend tasks fetch fallback:", error.message);
    return null;
  }
};

/**
 * Launch real autonomous task via Server-Sent Events (SSE)
 */
export const launchBackendTask = async (
  { prompt, maxRecords = 50, strictDeduplication = true },
  { onStatus, onLog, onProgress, onDataset, onDone, onError, onSchemaReview, onLineageUpdate, onAwaitingConfirmation, onTaskCreated }
) => {
  try {
    const response = await fetch(`${API_BASE}/tasks/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt, maxRecords, strictDeduplication }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop(); // Retain incomplete line

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const jsonStr = line.replace(/^data:\s*/, "").trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);

            if (data.type === "task_created" && onTaskCreated) onTaskCreated(data.task.taskId);
            if (data.type === "status" && onStatus) onStatus(data.status);
            if (data.type === "log" && onLog) onLog(data.log);
            if (data.type === "progress" && onProgress) onProgress(data.progress);
            if (data.type === "dataset" && onDataset) onDataset(data.dataset);
            if (data.type === "done" && onDone) onDone(data);
            if (data.type === "schema_review" && onSchemaReview) onSchemaReview(data);
            if (data.type === "lineage_update" && onLineageUpdate) onLineageUpdate(data);
            if (data.type === "awaiting_schema_confirmation" && onAwaitingConfirmation) onAwaitingConfirmation(data);
          } catch (e) {
            console.error("SSE parse error:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("Backend Task Execution Error:", error);
    if (onError) onError(error);
  }
};

/**
 * Confirm Schema & Save Dataset
 */
export const confirmSchema = async (taskId, schemaData) => {
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/confirm-schema`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(schemaData),
    });

    if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Confirm schema error:", error);
    throw error;
  }
};

/**
 * Cancel Running Task
 */
export const cancelBackendTask = async (taskId) => {
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/cancel`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Cancel task error:", error);
    throw error;
  }
};

/**
 * Download exported file directly from backend
 */
export const getBackendExportUrl = (datasetId, format = "csv") => {
  return `${API_BASE}/datasets/${datasetId}/export?format=${format}`;
};

/**
 * Time-Travel Data Diffs (Git for Web Data)
 */
export const getDatasetDiff = async (datasetId, compareWithId = null) => {
  try {
    const url = compareWithId
      ? `${API_BASE}/datasets/${datasetId}/diff?compareWith=${compareWithId}`
      : `${API_BASE}/datasets/${datasetId}/diff`;

    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Fetch dataset diff error:", error);
    throw error;
  }
};

/**
 * Fetch all versions of a dataset for time-travel comparison
 */
export const getDatasetVersions = async (datasetId) => {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/versions`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Fetch dataset versions error:", error);
    return [];
  }
};

/**
 * Configure Autonomous Swarm Cron for a dataset
 */
export const configureDatasetSchedule = async (datasetId, scheduleConfig) => {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/schedule`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleConfig),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Configure schedule error:", error);
    throw error;
  }
};

