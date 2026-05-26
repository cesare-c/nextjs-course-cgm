import axios from 'axios';
import type { User, UserInput } from '../types/userDay28';

const API_URL = 'http://localhost:3001/users';
const DELAY_MS = 800;

// Helper to delay executions simulating network latency for UI states
const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

// Default seed data
const initialUsers: User[] = [
  { id: 1, username: 'mrossi', email: 'mario.rossi@example.com', isActive: true, firstName: 'Mario', lastName: 'Rossi', middleName: 'Luigi' },
  { id: 2, username: 'abianchi', email: 'anna.bianchi@example.com', isActive: true, firstName: 'Anna', lastName: 'Bianchi' },
  { id: 3, username: 'lverdi', email: 'luca.verdi@example.com', isActive: false, firstName: 'Luca', lastName: 'Verdi', middleName: 'Antonio' },
  { id: 4, username: 'gneri', email: 'giulia.neri@example.com', isActive: true, firstName: 'Giulia', lastName: 'Neri' },
  { id: 5, username: 'frusso', email: 'francesco.russo@example.com', isActive: false, firstName: 'Francesco', lastName: 'Russo' },
  { id: 6, username: 'gferrari', email: 'giovanni.ferrari@example.com', isActive: true, firstName: 'Giovanni', lastName: 'Ferrari', middleName: 'Maria' },
  { id: 7, username: 'eesposito', email: 'elena.esposito@example.com', isActive: true, firstName: 'Elena', lastName: 'Esposito' },
  { id: 8, username: 'aromano', email: 'alessandro.romano@example.com', isActive: false, firstName: 'Alessandro', lastName: 'Romano' }
];

// Helper to map DB string IDs for TypeScript types
const mapUser = (user: any): User => ({
  ...user,
  id: isNaN(Number(user.id)) ? user.id : Number(user.id)
});

export const userServiceDay28 = {
  // 1. Read (List with Pagination & Filters)
  async fetchUsers(
    page: number,
    limit: number,
    filter: 'all' | 'active' | 'inactive',
    simulateError = false
  ): Promise<{ users: User[]; total: number }> {
    if (simulateError) {
      await delay();
      throw new Error('Errore di rete simulato: impossibile recuperare la lista degli utenti.');
    }

    // Try json-server v1.x style first: _per_page instead of _limit
    let url = `${API_URL}?_page=${page}&_per_page=${limit}`;
    if (filter === 'active') {
      url += '&isActive=true';
    } else if (filter === 'inactive') {
      url += '&isActive=false';
    }

    try {
      const response = await axios.get<any>(url);

      // Handle json-server v1 response format: { data: [...], items: number }
      if (response.data && !Array.isArray(response.data) && Array.isArray(response.data.data)) {
        const total = typeof response.data.items === 'number' ? response.data.items : response.data.data.length;
        return {
          users: response.data.data.map(mapUser),
          total
        };
      }

      // Handle json-server legacy format: [...] with 'x-total-count' header
      if (Array.isArray(response.data)) {
        const totalHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
        const total = totalHeader ? parseInt(totalHeader, 10) : response.data.length;
        return {
          users: response.data.map(mapUser),
          total
        };
      }
    } catch (error) {
      console.warn("Attempt to fetch users with json-server v1 format failed, falling back to legacy format.", error);
    }

    // Fallback: legacy json-server v0.x style with _limit
    let fallbackUrl = `${API_URL}?_page=${page}&_limit=${limit}`;
    if (filter === 'active') {
      fallbackUrl += '&isActive=true';
    } else if (filter === 'inactive') {
      fallbackUrl += '&isActive=false';
    }

    const response = await axios.get<any>(fallbackUrl);

    if (response.data && !Array.isArray(response.data) && Array.isArray(response.data.data)) {
      const total = typeof response.data.items === 'number' ? response.data.items : response.data.data.length;
      return {
        users: response.data.data.map(mapUser),
        total
      };
    }

    const totalHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
    const total = totalHeader ? parseInt(totalHeader, 10) : response.data.length;
    return {
      users: response.data.map(mapUser),
      total
    };
  },

  // 2. Read (Single user details)
  async fetchUserById(id: number | string, simulateError = false): Promise<User> {
    if (simulateError) {
      await delay();
      throw new Error(`Errore di rete simulato: impossibile caricare l'utente con ID ${id}.`);
    }

    const response = await axios.get<any>(`${API_URL}/${id}`);
    return mapUser(response.data);
  },

  // 3. Create (New user)
  async createUser(input: UserInput, simulateError = false): Promise<User> {
    if (simulateError) {
      await delay();
      throw new Error('Errore di rete simulato: salvataggio dell\'utente non riuscito.');
    }

    // Fetch all users to check duplicates and calculate next ID
    const allUsersResp = await axios.get<any[]>(API_URL);
    const allUsers = allUsersResp.data.map(mapUser);

    // Check duplicate username or email
    const usernameExists = allUsers.some((u) => u.username.toLowerCase() === input.username.trim().toLowerCase());
    if (usernameExists) {
      throw new Error(`L'username "${input.username}" è già in uso.`);
    }
    const emailExists = allUsers.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (emailExists) {
      throw new Error(`L'indirizzo email "${input.email}" è già registrato.`);
    }

    // Assign numeric ID
    const nextId = allUsers.length > 0 ? Math.max(...allUsers.map((u) => u.id)) + 1 : 1;

    // Rules logic:
    // - isActive always set to true
    // - middleName sent only if compiled (not empty)
    const newUserPayload: any = {
      id: String(nextId),
      username: input.username.trim(),
      email: input.email.trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      isActive: true // Force to always be true on creation
    };

    if (input.middleName && input.middleName.trim()) {
      newUserPayload.middleName = input.middleName.trim();
    }

    const response = await axios.post<any>(API_URL, newUserPayload);
    return mapUser(response.data);
  },

  // 4. Update (Edit user)
  async updateUser(id: number | string, input: UserInput, simulateError = false): Promise<User> {
    if (simulateError) {
      await delay();
      throw new Error('Errore di rete simulato: modifica dell\'utente non riuscita.');
    }

    const allUsersResp = await axios.get<any[]>(API_URL);
    const allUsers = allUsersResp.data.map(mapUser);

    const userExists = allUsers.some((u) => u.id === id);
    if (!userExists) {
      throw new Error(`Utente con ID ${id} non trovato.`);
    }

    // Check duplicate username or email (excluding current user)
    const usernameExists = allUsers.some((u) => u.id !== id && u.username.toLowerCase() === input.username.trim().toLowerCase());
    if (usernameExists) {
      throw new Error(`L'username "${input.username}" è già in uso.`);
    }
    const emailExists = allUsers.some((u) => u.id !== id && u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (emailExists) {
      throw new Error(`L'indirizzo email "${input.email}" è già registrato.`);
    }

    // Rules logic on update (middleName optional, active/inactive is updateable)
    const updatedUserPayload: any = {
      id: String(id),
      username: input.username.trim(),
      email: input.email.trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      isActive: input.isActive !== undefined ? input.isActive : true
    };

    if (input.middleName && input.middleName.trim()) {
      updatedUserPayload.middleName = input.middleName.trim();
    }

    const response = await axios.put<any>(`${API_URL}/${id}`, updatedUserPayload);
    return mapUser(response.data);
  },

  // 5. Delete (Remove user)
  async deleteUser(id: number | string, simulateError = false): Promise<void> {
    if (simulateError) {
      await delay();
      throw new Error('Errore di rete simulato: eliminazione dell\'utente non riuscita.');
    }

    await axios.delete(`${API_URL}/${id}`);
  },

  // 6. Reset database
  async resetDatabase(): Promise<void> {
    // Delete all current users
    const currentUsersResp = await axios.get<any[]>(API_URL);
    for (const u of currentUsersResp.data) {
      await axios.delete(`${API_URL}/${u.id}`);
    }

    // Re-seed initial users
    for (const u of initialUsers) {
      const seedPayload = {
        ...u,
        id: String(u.id)
      };
      await axios.post(API_URL, seedPayload);
    }
  }
};
