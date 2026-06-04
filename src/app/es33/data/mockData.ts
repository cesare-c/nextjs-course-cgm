export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  avatar: string;
  joinDate: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
  duration: string;
  assignedUserId: number;
}

export const mockUsers: User[] = [
  {
    id: 1,
    fullName: 'Cesare Rossi',
    email: 'cesare@example.com',
    role: 'Senior Developer',
    status: 'active',
    avatar: '👨‍💻',
    joinDate: '2026-01-15',
  },
  {
    id: 2,
    fullName: 'Giulia Bianchi',
    email: 'giulia@example.com',
    role: 'UX Designer',
    status: 'active',
    avatar: '👩‍🎨',
    joinDate: '2026-02-10',
  },
  {
    id: 3,
    fullName: 'Marco Verdi',
    email: 'marco.verdi@example.com',
    role: 'Product Manager',
    status: 'active',
    avatar: '💼',
    joinDate: '2026-03-01',
  },
  {
    id: 4,
    fullName: 'Sofia Neri',
    email: 'sofia.neri@example.com',
    role: 'QA Engineer',
    status: 'pending',
    avatar: '👩‍🔬',
    joinDate: '2026-05-20',
  },
  {
    id: 5,
    fullName: 'Alessandro Russo',
    email: 'alessandro@example.com',
    role: 'DevOps Specialist',
    status: 'active',
    avatar: '🚀',
    joinDate: '2026-04-12',
  },
  {
    id: 6,
    fullName: 'Elena Gallo',
    email: 'elena.gallo@example.com',
    role: 'Content Creator',
    status: 'suspended',
    avatar: '✍️',
    joinDate: '2026-03-15',
  },
  {
    id: 7,
    fullName: 'Luca Fontana',
    email: 'luca.fontana@example.com',
    role: 'Frontend Architect',
    status: 'active',
    avatar: '🎨',
    joinDate: '2026-05-02',
  },
  {
    id: 8,
    fullName: 'Anna Ferrari',
    email: 'anna.ferrari@example.com',
    role: 'Data Analyst',
    status: 'active',
    avatar: '📈',
    joinDate: '2026-05-18',
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    title: 'Migrazione Next.js',
    description: 'Completata la migrazione dell’app da Vite a Next.js App Router con successo.',
    status: 'completed',
    date: '2026-06-03',
    duration: '6 ore',
    assignedUserId: 1,
  },
  {
    id: 'a2',
    title: 'Nuovi Layout Risorse',
    description: 'Progettato e implementato il sottomenù isolato per utenti e attività.',
    status: 'in_progress',
    date: '2026-06-03',
    duration: '2 ore',
    assignedUserId: 2,
  },
  {
    id: 'a3',
    title: 'Test di Integrazione JWT',
    description: 'Verificati i flussi di login e la protezione delle rotte con mock JSON-server.',
    status: 'completed',
    date: '2026-06-02',
    duration: '4 ore',
    assignedUserId: 1,
  },
  {
    id: 'a4',
    title: 'Definizione Roadmap Q3',
    description: 'Riunione strategica per allineare i moduli formativi e le scadenze.',
    status: 'completed',
    date: '2026-06-01',
    duration: '3 ore',
    assignedUserId: 3,
  },
  {
    id: 'a5',
    title: 'Scrittura Casi di Test',
    description: 'Preparazione della suite di test automatici e validazione del flusso CRUD.',
    status: 'pending',
    date: '2026-06-03',
    duration: '5 ore',
    assignedUserId: 4,
  },
  {
    id: 'a6',
    title: 'Setup Pipeline CI/CD',
    description: 'Configurati i build runner automatici su GitHub Actions per ogni PR.',
    status: 'in_progress',
    date: '2026-06-02',
    duration: '8 ore',
    assignedUserId: 5,
  },
  {
    id: 'a7',
    title: 'Revisione della Documentazione',
    description: 'Aggiornati i file markdown del corso per allinearli ai moduli di NextJS.',
    status: 'completed',
    date: '2026-05-30',
    duration: '2 ore',
    assignedUserId: 6,
  },
  {
    id: 'a8',
    title: 'Design System Update',
    description: 'Implementazione di nuove variabili CSS per supportare le animazioni e la dark mode.',
    status: 'in_progress',
    date: '2026-06-03',
    duration: '4 ore',
    assignedUserId: 7,
  },
];
