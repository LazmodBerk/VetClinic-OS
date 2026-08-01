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
const DEFAULT_PATIENTS: Patient[] = [
  { id: 1, name: 'Tarçın', species: 'Köpek', breed: 'Golden Retriever', owner: 'Ahmet Yılmaz', ownerGender: 'bay', phone: '5551234567', lastVisit: '12 Eki 2026', weight: '28 kg', status: 'Sağlıklı' },
  { id: 2, name: 'Pamuk', species: 'Kedi', breed: 'Van Kedisi', owner: 'Ayşe Kaya', ownerGender: 'bayan', phone: '5559876543', lastVisit: '05 Eyl 2026', weight: '4.2 kg', status: 'Tedavide' },
  { id: 3, name: 'Cesur', species: 'Köpek', breed: 'Kangal', owner: 'Mehmet Demir', ownerGender: 'bay', phone: '5553456789', lastVisit: '20 Ağu 2026', weight: '45 kg', status: 'Sağlıklı' },
  { id: 4, name: 'Limon', species: 'Kuş', breed: 'Muhabbet', owner: 'Zeynep Arslan', ownerGender: 'bayan', phone: '5553456789', lastVisit: '27 Tem 2026', weight: '0.1 kg', status: 'Kontrol Bekliyor' },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { id: 1, patient: 'Tarçın', owner: 'Ahmet Yılmaz', type: 'Muayene', date: 'Bugün', time: '10:00', status: 'Bekliyor', color: 'bg-blue-100 text-blue-800' },
  { id: 2, patient: 'Pamuk', owner: 'Ayşe Kaya', type: 'Aşı (Karma)', date: 'Bugün', time: '11:30', status: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
  { id: 3, patient: 'Cesur', owner: 'Mehmet Demir', type: 'Operasyon', date: 'Yarın', time: '09:00', status: 'Onaylandı', color: 'bg-indigo-100 text-indigo-800' },
  { id: 4, patient: 'Maya', owner: 'Zeynep Çelik', type: 'Kontrol', date: 'Yarın', time: '14:15', status: 'İptal', color: 'bg-red-100 text-red-800' },
];

const DEFAULT_VACCINES: Vaccine[] = [
  { id: 1, patient: 'Tarçın', owner: 'Ahmet Yılmaz', vaccine: 'Kuduz', date: 'Bugün', status: 'Bekliyor' },
  { id: 2, patient: 'Pamuk', owner: 'Ayşe Kaya', vaccine: 'Karma', date: 'Yarın', status: 'Planlandı' },
  { id: 3, patient: 'Cesur', owner: 'Mehmet Demir', vaccine: 'Lyme', date: '21 Eki 2026', status: 'Gecikmiş' },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 1, name: 'Kuduz Aşısı (Nobivac)', category: 'Aşılar', stock: 5, minStock: 10, unit: 'Doz', price: '₺250', status: 'Kritik' },
  { id: 2, name: 'Karma Aşı', category: 'Aşılar', stock: 42, minStock: 15, unit: 'Doz', price: '₺300', status: 'Yeterli' },
  { id: 3, name: 'Pire Damlası (10-20kg)', category: 'İlaçlar', stock: 12, minStock: 20, unit: 'Kutu', price: '₺450', status: 'Azalıyor' },
  { id: 4, name: 'Steril Eldiven (M)', category: 'Sarf Malzeme', stock: 50, minStock: 10, unit: 'Kutu', price: '₺120', status: 'Yeterli' },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '29 Tem 2026', description: 'Muayene ve Aşı Ücreti (Maya)', type: 'income', amount: '+₺1,450', method: 'Kredi Kartı', eInvoice: true },
  { id: 2, date: '28 Tem 2026', description: 'VetDepo A.Ş. İlaç Alımı', type: 'expense', amount: '-₺8,200', method: 'Havale/EFT', eInvoice: false },
  { id: 3, date: '28 Tem 2026', description: 'Tıraş ve Bakım (Paşa)', type: 'income', amount: '+₺450', method: 'Nakit', eInvoice: true },
  { id: 4, date: '27 Tem 2026', description: 'Klinik Elektrik Faturası', type: 'expense', amount: '-₺1,120', method: 'Otomatik Ödeme', eInvoice: false },
];

const DEFAULT_FARM: FarmAnimal[] = [
  { id: 1, tagNo: 'TR-42-0001', type: 'İnek', breed: 'Holstein', status: 'Gebe', nextCheckup: '15 Kas 2026', inseminationDate: '15 Şub 2026' },
  { id: 2, tagNo: 'TR-42-0002', type: 'İnek', breed: 'Simental', status: 'Tohumlama Bekliyor', nextCheckup: 'Bugün', inseminationDate: '-' },
  { id: 3, tagNo: 'TR-42-0003', type: 'Buzağı', breed: 'Holstein', status: 'Sağlıklı', nextCheckup: '20 Ara 2026', inseminationDate: '-' },
  { id: 4, tagNo: 'TR-42-0004', type: 'İnek', breed: 'Holstein', status: 'Tedavi (Mastitis)', nextCheckup: 'Yarın', inseminationDate: '01 Oca 2026' },
];

const DEFAULT_SETTINGS: SettingsData = {
  clinicName: 'BulutVet Premium Klinik',
  phone: '+90 (555) 123 45 67',
  email: 'info@bulutvet.com',
  address: 'Veterinerler Sk. No:42 Kadıköy / İstanbul',
  taxOffice: 'Kadıköy VD',
  taxNo: '1234567890',
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

  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;

  farmAnimals: FarmAnimal[];
  addFarmAnimal: (animal: Omit<FarmAnimal, 'id'>) => void;

  settings: SettingsData;
  updateSettings: (s: SettingsData) => void;
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

  const addPatient       = (p: Omit<Patient, 'id'>)       => setPatients(prev => [{ ...p, id: Date.now() }, ...prev]);
  const updatePatient    = (p: Patient)                    => setPatients(prev => prev.map(pt => pt.id === p.id ? p : pt));
  const deletePatient    = (id: number)                    => setPatients(prev => prev.filter(p => p.id !== id));
  const addAppointment   = (a: Omit<Appointment, 'id'>)   => setAppointments(prev => [{ ...a, id: Date.now() }, ...prev]);
  const addVaccine       = (v: Omit<Vaccine, 'id'>)       => setVaccines(prev => [{ ...v, id: Date.now() }, ...prev]);
  const addInventoryItem = (i: Omit<InventoryItem, 'id'>) => setInventoryItems(prev => [{ ...i, id: Date.now() }, ...prev]);
  const addTransaction   = (t: Omit<Transaction, 'id'>)   => setTransactions(prev => [{ ...t, id: Date.now() }, ...prev]);
  const addFarmAnimal    = (f: Omit<FarmAnimal, 'id'>)    => setFarmAnimals(prev => [{ ...f, id: Date.now() }, ...prev]);
  const updateSettings   = (s: SettingsData)               => setSettings(s);

  return (
    <AppContext.Provider value={{
      patients, addPatient, updatePatient, deletePatient,
      appointments, addAppointment,
      vaccines, addVaccine,
      inventoryItems, addInventoryItem,
      transactions, addTransaction,
      farmAnimals, addFarmAnimal,
      settings, updateSettings,
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
