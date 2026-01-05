// API Configuration for BelajarIndo Mobile App
// Backend server address - ports: 15153 (database), 15154 (backend), 15155 (web frontend)
export const API_URL = "http://103.59.160.152:15154";

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  ME: "/api/auth/me",
  LOGOUT: "/api/auth/logout",

  // Quiz
  QUIZ_SUBMIT: "/api/quiz/submit",
  QUIZ_PROGRESS: "/api/quiz/progress",
  QUIZ_RESULTS: "/api/quiz/results",
  QUIZ_HISTORY: "/api/quiz/history",
  QUIZ_STATS: "/api/quiz/stats",

  // Vocab
  VOCAB_PROGRESS: "/api/vocab/progress",

  // Health
  HEALTH: "/api/health",
};

// HTTP request helper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<{ ok: boolean; data?: T; error?: string; status?: number }> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        error: data?.error || data?.message || "Request failed",
        status: response.status,
      };
    }

    return { ok: true, data, status: response.status };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest<{ user: { id: number; name: string; email: string }; token: string }>(
      ENDPOINTS.LOGIN,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
  },

  register: async (name: string, email: string, password: string) => {
    return apiRequest(ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  getMe: async (token: string) => {
    return apiRequest<{ user: { id: number; name: string; email: string } }>(
      ENDPOINTS.ME,
      { method: "GET" },
      token
    );
  },

  logout: async (token: string) => {
    return apiRequest(ENDPOINTS.LOGOUT, { method: "POST" }, token);
  },
};

// Quiz API functions
export const quizAPI = {
  submit: async (
    token: string,
    payload: {
      score: number;
      totalQuestions: number;
      correctAnswers: number;
      timeSpent: number;
      quizType?: string;
      quizCategory?: string;
    }
  ) => {
    return apiRequest(ENDPOINTS.QUIZ_SUBMIT, {
      method: "POST",
      body: JSON.stringify(payload),
    }, token);
  },

  getProgress: async (token: string, quizCategory?: string) => {
    const url = quizCategory
      ? `${ENDPOINTS.QUIZ_PROGRESS}?quizCategory=${quizCategory}`
      : ENDPOINTS.QUIZ_PROGRESS;
    return apiRequest(url, { method: "GET" }, token);
  },

  saveProgress: async (
    token: string,
    payload: {
      quizCategory: string;
      progress: number;
      currentQuestion: number;
      state?: object;
    }
  ) => {
    return apiRequest(ENDPOINTS.QUIZ_PROGRESS, {
      method: "POST",
      body: JSON.stringify(payload),
    }, token);
  },

  getResults: async (token: string) => {
    return apiRequest(ENDPOINTS.QUIZ_RESULTS, { method: "GET" }, token);
  },

  // Use same endpoint as web app profile.html
  getHistory: async (token: string) => {
    return apiRequest(ENDPOINTS.QUIZ_HISTORY, { method: "GET" }, token);
  },

  getStats: async (token: string) => {
    return apiRequest(ENDPOINTS.QUIZ_STATS, { method: "GET" }, token);
  },
};

// Vocab API functions
export const vocabAPI = {
  getProgress: async (token: string, category?: string) => {
    const url = category
      ? `${ENDPOINTS.VOCAB_PROGRESS}?category=${category}`
      : ENDPOINTS.VOCAB_PROGRESS;
    return apiRequest(url, { method: "GET" }, token);
  },

  saveProgress: async (
    token: string,
    payload: {
      category: string;
      wordsLearned: number[];
    }
  ) => {
    return apiRequest(ENDPOINTS.VOCAB_PROGRESS, {
      method: "POST",
      body: JSON.stringify(payload),
    }, token);
  },
};
