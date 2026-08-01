import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Patient {
  id: number;
  name: string;
  species: string;
  breed: string;
  owner: string;
  ownerGender: 'bayan' | 'bay'; // Hanım / Bey için
  phone?: string;
  lastVisit: string;
  weight: string;
  status: string;
  medicalInfo?: {
    microchipNo: string;
    birthDate: string;
    gender: string;
    bloodType: string;
    allergies: string;
    documents?: { id: string; name: string; dataUrl: string; type: string; date: string; size: number }[];
  };
  notes?: { id: number; date: string; title: string; content: string }[];
}

export interface Appointment {
  id: number;
  patient: string;
  owner: string;
  type: string;
  date: string;
  time: string;
  status: string;
  color: string;
}

export interface Vaccine {
  id: number;
  patient: string;
  owner: string;
  vaccine: string;
  date: string;
  status: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: string;
  status: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: string;
  method: string;
  eInvoice: boolean;
}

export interface FarmAnimal {
  id: number;
  tagNo: string;
  type: string;
  breed: string;
  status: string;
  nextCheckup: string;
  inseminationDate: string;
}

export interface SettingsData {
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  taxOffice: string;
  taxNo: string;
  geminiApiKey?: string;
  notifyVaccines?: boolean;
  notifyStock?: boolean;
}

// ─────────────────────────────────────────────
// YARDIMCI: Hanım / Bey seçici
// ─────────────────────────────────────────────
export function honorific(gender?: 'bayan' | 'bay'): string {
  return gender === 'bayan' ? 'Hanım' : 'Bey';
}

// ─────────────────────────────────────────────
// YARDIMCI: localStorage ile state yönetimi
// ─────────────────────────────────────────────
function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`vcms_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Boş array olmaması için kontrol
        if (Array.isArray(parsed) && parsed.length === 0) return defaultValue;
        return parsed;
      }
    } catch {
      // localStorage okunamadıysa varsayılanı kullan
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`vcms_${key}`, JSON.stringify(state));
    } catch {
      // localStorage yazılamadıysa (örn: depolama dolu) sessizce geç
    }
  }, [key, state]);

  return [state, setState] as const;
}

// ─────────────────────────────────────────────
// VARSAYILAN VERİLER
// ─────────────────────────────────────────────
const DEFAULT_PATIENTS: Patient[] = [];
const DEFAULT_APPOINTMENTS: Appointment[] = [];
const DEFAULT_VACCINES: Vaccine[] = [];
const DEFAULT_INVENTORY: InventoryItem[] = [];
const DEFAULT_TRANSACTIONS: Transaction[] = [];
const DEFAULT_FARM: FarmAnimal[] = [];

const DEFAULT_SETTINGS: SettingsData = {
  clinicName: 'BulutVet Premium Klinik',
  phone: '0555 123 45 67',
  email: 'info@bulutvet.com',
  address: 'Örnek Mah. Pet Cad. No:1',
  taxOffice: 'Kozyatağı',
  taxNo: '1234567890',
  geminiApiKey: '',
  notifyVaccines: true,
  notifyStock: true
};

// ─────────────────────────────────────────────
// CONTEXT TYPE
// ─────────────────────────────────────────────
interface AppContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: number) => void;

  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;

  vaccines: Vaccine[];
  addVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  updateVaccine: (vaccine: Vaccine) => void;
  deleteVaccine: (id: number) => void;

  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: number) => void;

  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;

  settings: SettingsData;
  updateSettings: (settings: SettingsData) => void;

  farmAnimals: FarmAnimal[];
  addFarmAnimal: (animal: Omit<FarmAnimal, 'id'>) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// PROVIDER — tüm veriler localStorage'a kaydedilir
// ─────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [patients,      setPatients]      = usePersistedState<Patient[]>('patients',      DEFAULT_PATIENTS);
  const [appointments,  setAppointments]  = usePersistedState<Appointment[]>('appointments',  DEFAULT_APPOINTMENTS);
  const [vaccines,      setVaccines]      = usePersistedState<Vaccine[]>('vaccines',      DEFAULT_VACCINES);
  const [inventoryItems,setInventoryItems]= usePersistedState<InventoryItem[]>('inventory', DEFAULT_INVENTORY);
  const [transactions,  setTransactions]  = usePersistedState<Transaction[]>('transactions',  DEFAULT_TRANSACTIONS);
  const [farmAnimals,   setFarmAnimals]   = usePersistedState<FarmAnimal[]>('farm',        DEFAULT_FARM);
  const [settings,      setSettings]      = usePersistedState<SettingsData>('settings',    DEFAULT_SETTINGS);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('canvet_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('canvet_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addPatient       = (p: Omit<Patient, 'id'>)       => setPatients(prev => [{ ...p, id: Date.now() }, ...prev]);
  const updatePatient    = (p: Patient)                    => setPatients(prev => prev.map(pt => pt.id === p.id ? p : pt));
  const deletePatient    = (id: number)                    => setPatients(prev => prev.filter(p => p.id !== id));
  const addAppointment   = (a: Omit<Appointment, 'id'>)   => setAppointments(prev => [{ ...a, id: Date.now() }, ...prev]);
  const addVaccine       = (v: Omit<Vaccine, 'id'>)       => setVaccines(prev => [{ ...v, id: Date.now() }, ...prev]);
  const updateVaccine    = (v: Vaccine)                   => setVaccines(prev => prev.map(vc => vc.id === v.id ? v : vc));
  const deleteVaccine    = (id: number)                   => setVaccines(prev => prev.filter(v => v.id !== id));
  const addInventoryItem = (i: Omit<InventoryItem, 'id'>) => setInventoryItems(prev => [{ ...i, id: Date.now() }, ...prev]);
  const updateInventoryItem = (i: InventoryItem) => setInventoryItems(prev => prev.map(item => item.id === i.id ? i : item));
  const deleteInventoryItem = (id: number) => setInventoryItems(prev => prev.filter(i => i.id !== id));
  const addTransaction   = (t: Omit<Transaction, 'id'>)   => setTransactions(prev => [{ ...t, id: Date.now() }, ...prev]);
  const addFarmAnimal    = (f: Omit<FarmAnimal, 'id'>)    => setFarmAnimals(prev => [{ ...f, id: Date.now() }, ...prev]);
  const updateSettings   = (s: SettingsData)               => setSettings(s);

  return (
    <AppContext.Provider value={{
      patients, addPatient, updatePatient, deletePatient,
      appointments, addAppointment,
      vaccines, addVaccine, updateVaccine, deleteVaccine,
      inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem,
      transactions, addTransaction,
      farmAnimals, addFarmAnimal,
      settings, updateSettings,
      theme, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
