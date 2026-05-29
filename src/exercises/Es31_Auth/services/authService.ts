import axios from 'axios';
import type { AuthResponse } from '../types/auth';

const API_BASE = 'http://localhost:3002';
const LATENCY_MS = 800;

const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

export const authService = {
  async register(payload: Record<string, string>): Promise<AuthResponse> {
    await delay();
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE}/register`, {
        email: payload.email.trim(),
        password: payload.password,
        username: payload.username.trim(),
        fullName: payload.fullName.trim()
      });
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data || error.message || 'Errore durante la registrazione';
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  },

  async login(payload: Record<string, string>): Promise<AuthResponse> {
    await delay();
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE}/login`, {
        email: payload.email.trim(),
        password: payload.password
      });
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data || error.message || 'Errore durante il login';
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  }
};
