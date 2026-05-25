import type { User, UserInput } from '../types/userDay27';

const STORAGE_KEY = 'DAY27_USERS_CRUD';
const DELAY_MS = 800;

// Helper to delay executions simulating network latency
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

export const userServiceDay27 = {
  // Ensure database has seed data
  _initStorage(): User[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(data);
  },

  _saveToStorage(users: User[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  // 1. Read (List with Pagination & Filters)
  async fetchUsers(
    page: number,
    limit: number,
    filter: 'all' | 'active' | 'inactive',
    simulateError = false
  ): Promise<{ users: User[]; total: number }> {
    await delay();

    if (simulateError) {
      throw new Error('Errore di rete simulato: impossibile recuperare la lista degli utenti.');
    }

    const allUsers = this._initStorage();

    // Filter
    let filteredUsers = allUsers;
    if (filter === 'active') {
      filteredUsers = allUsers.filter((u) => u.isActive);
    } else if (filter === 'inactive') {
      filteredUsers = allUsers.filter((u) => !u.isActive);
    }

    // Pagination calculations
    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return {
      users: paginatedUsers,
      total
    };
  },

  // 2. Read (Single user details)
  async fetchUserById(id: number, simulateError = false): Promise<User> {
    await delay();

    if (simulateError) {
      throw new Error(`Errore di rete simulato: impossibile caricare l'utente con ID ${id}.`);
    }

    const allUsers = this._initStorage();
    const user = allUsers.find((u) => u.id === id);

    if (!user) {
      throw new Error(`Utente con ID ${id} non trovato.`);
    }

    return user;
  },

  // 3. Create (New user)
  async createUser(input: UserInput, simulateError = false): Promise<User> {
    await delay();

    if (simulateError) {
      throw new Error('Errore di rete simulato: salvataggio dell\'utente non riuscito.');
    }

    const allUsers = this._initStorage();

    // Check duplicate username or email
    const usernameExists = allUsers.some((u) => u.username.toLowerCase() === input.username.trim().toLowerCase());
    if (usernameExists) {
      throw new Error(`L'username "${input.username}" è già in uso.`);
    }
    const emailExists = allUsers.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (emailExists) {
      throw new Error(`L'indirizzo email "${input.email}" è già registrato.`);
    }

    // Assign ID
    const nextId = allUsers.length > 0 ? Math.max(...allUsers.map((u) => u.id)) + 1 : 1;

    // Rules logic:
    // - isActive always set to true
    // - middleName sent only if compiled (not empty)
    const newUser: User = {
      id: nextId,
      username: input.username.trim(),
      email: input.email.trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      isActive: true // Force to always be true on creation
    };

    if (input.middleName && input.middleName.trim()) {
      newUser.middleName = input.middleName.trim();
    }

    allUsers.push(newUser);
    this._saveToStorage(allUsers);

    return newUser;
  },

  // 4. Update (Edit user)
  async updateUser(id: number, input: UserInput, simulateError = false): Promise<User> {
    await delay();

    if (simulateError) {
      throw new Error('Errore di rete simulato: modifica dell\'utente non riuscita.');
    }

    const allUsers = this._initStorage();
    const userIndex = allUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new Error(`Utente con ID ${id} non trovato.`);
    }

    const currentUser = allUsers[userIndex];

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
    const updatedUser: User = {
      ...currentUser,
      username: input.username.trim(),
      email: input.email.trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      isActive: input.isActive !== undefined ? input.isActive : currentUser.isActive
    };

    if (input.middleName && input.middleName.trim()) {
      updatedUser.middleName = input.middleName.trim();
    } else {
      delete updatedUser.middleName; // omit if empty
    }

    allUsers[userIndex] = updatedUser;
    this._saveToStorage(allUsers);

    return updatedUser;
  },

  // 5. Delete (Remove user)
  async deleteUser(id: number, simulateError = false): Promise<void> {
    await delay();

    if (simulateError) {
      throw new Error('Errore di rete simulato: eliminazione dell\'utente non riuscita.');
    }

    const allUsers = this._initStorage();
    const filtered = allUsers.filter((u) => u.id !== id);

    if (filtered.length === allUsers.length) {
      throw new Error(`Utente con ID ${id} non trovato.`);
    }

    this._saveToStorage(filtered);
  },

  // 6. Reset database
  async resetDatabase(): Promise<void> {
    await delay();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
  }
};
