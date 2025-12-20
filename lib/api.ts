const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    errors?: any[];
  };
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  role: string;
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    // Get team ID from localStorage if available
    if (typeof window !== 'undefined') {
      const teamId = localStorage.getItem('currentTeamId');
      if (teamId) {
        headers['X-Team-Id'] = teamId;
      }
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token refresh
        if (response.status === 401 && this.refreshToken) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Retry the request
            headers['Authorization'] = `Bearer ${this.accessToken}`;
            const retryResponse = await fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers,
            });
            return retryResponse.json();
          }
        }

        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Network error',
        },
      };
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.data.accessToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', this.accessToken!);
        }
        return true;
      }

      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  // Auth endpoints
  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<{ user: User; team: Team; accessToken: string; refreshToken: string }>> {
    const response = await this.request<{ user: User; team: Team; accessToken: string; refreshToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; teamId: string; accessToken: string; refreshToken: string }>> {
    const response = await this.request<{
      user: User;
      teamId: string;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      if (typeof window !== 'undefined' && response.data.teamId) {
        localStorage.setItem('currentTeamId', response.data.teamId);
      }
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', { method: 'POST' });
    this.clearTokens();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentTeamId');
    }
    return response;
  }

  async verifyEmail(email: string, code: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async resendCode(email: string) {
    return this.request('/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async sendMagicLink(email: string) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getMe(): Promise<ApiResponse<{ user: User; teams: Team[] }>> {
    return this.request<{ user: User; teams: Team[] }>('/auth/me');
  }

  // Onboarding
  async saveOnboarding(data: any) {
    return this.request('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOnboardingStatus() {
    return this.request('/onboarding');
  }

  // Teams
  async createTeam(name: string) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async listTeams(): Promise<ApiResponse<{ teams: Team[] }>> {
    return this.request<{ teams: Team[] }>('/teams');
  }

  async getTeam(teamId: string) {
    return this.request(`/teams/${teamId}`);
  }

  async switchTeam(teamId: string) {
    const response = await this.request<{ accessToken: string; teamId: string }>(
      `/teams/${teamId}/switch`,
      { method: 'POST' }
    );

    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('currentTeamId', response.data.teamId);
      }
    }

    return response;
  }

  async inviteTeamMember(teamId: string, email: string, role: string = 'member') {
    return this.request(`/teams/${teamId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async listTeamMembers(teamId: string) {
    return this.request(`/teams/${teamId}/members`);
  }

  // Domains
  async createDomain(url: string) {
    return this.request('/domains', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  async listDomains() {
    return this.request('/domains');
  }

  async getDomain(domainId: string) {
    return this.request(`/domains/${domainId}`);
  }

  async verifyDomain(domainId: string, method: string = 'meta') {
    return this.request(`/domains/${domainId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ method }),
    });
  }

  async getTrackingScript(domainId: string) {
    return this.request(`/domains/${domainId}/script`);
  }

  async deleteDomain(domainId: string) {
    return this.request(`/domains/${domainId}`, { method: 'DELETE' });
  }

  // Prompts
  async createPrompt(data: {
    domainId: string;
    text: string;
    group?: string;
    location?: string;
    aiPlatforms?: string[];
  }) {
    return this.request('/prompts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listPrompts(params?: { domainId?: string; status?: string; group?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/prompts${query ? `?${query}` : ''}`);
  }

  async getPrompt(promptId: string, params?: { startDate?: string; endDate?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/prompts/${promptId}${query ? `?${query}` : ''}`);
  }

  async updatePrompt(promptId: string, data: any) {
    return this.request(`/prompts/${promptId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePrompt(promptId: string) {
    return this.request(`/prompts/${promptId}`, { method: 'DELETE' });
  }

  async analyzePrompt(promptId: string) {
    return this.request(`/prompts/${promptId}/analyze`, { method: 'POST' });
  }

  // Analytics
  async getWebAnalytics(params?: { domainId?: string; startDate?: string; endDate?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/analytics/web${query ? `?${query}` : ''}`);
  }

  async getLLMAnalytics(params?: { domainId?: string; startDate?: string; endDate?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/analytics/llm${query ? `?${query}` : ''}`);
  }

  async getAnalyticsOverview(domainId?: string) {
    const query = domainId ? `?domainId=${domainId}` : '';
    return this.request(`/analytics/overview${query}`);
  }

  // Content
  async generateContent(data: {
    domainId: string;
    type: string;
    keyword: string;
    instructions?: string;
  }) {
    return this.request('/content/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listContent(params?: { domainId?: string; type?: string; status?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/content${query ? `?${query}` : ''}`);
  }

  async getContent(contentId: string) {
    return this.request(`/content/${contentId}`);
  }

  async updateContent(contentId: string, data: any) {
    return this.request(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContent(contentId: string) {
    return this.request(`/content/${contentId}`, { method: 'DELETE' });
  }

  // Competitors
  async listCompetitors(domainId?: string) {
    const query = domainId ? `?domainId=${domainId}` : '';
    return this.request(`/competitors${query}`);
  }

  async addCompetitor(domainId: string, name: string, domain?: string) {
    return this.request('/competitors', {
      method: 'POST',
      body: JSON.stringify({ domainId, name, domain }),
    });
  }

  async deleteCompetitor(competitorId: string) {
    return this.request(`/competitors/${competitorId}`, { method: 'DELETE' });
  }

  // Billing
  async getPlans() {
    return this.request('/billing/plans');
  }

  async getSubscription() {
    return this.request('/billing/subscription');
  }

  async addSeats(count: number) {
    return this.request('/billing/seats', {
      method: 'POST',
      body: JSON.stringify({ count }),
    });
  }

  async removeSeats(count: number) {
    return this.request('/billing/seats', {
      method: 'DELETE',
      body: JSON.stringify({ count }),
    });
  }
}

export const api = new ApiClient();
export default api;

