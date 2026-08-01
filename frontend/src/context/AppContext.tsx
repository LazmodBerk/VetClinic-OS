import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface Patient {
  id: number | string;
  name: string;
  species?: string;
  breed?: string;
  age?: string;
  owner: string;
  phone?: string;
  ownerGender?: 'bay' | 'bayan';
  lastVisit?: string;
  weight?: string;
  status?: string;
  notes?: any[];
  medicalInfo?: {
    microchipNo?: string;
    birthDate?: string;
    gender?: string;
    bloodType?: string;
    allergies?: string;
    documents?: any[];
  };
  documents?: any[];
}

export interface Appointment {
  id: number | string;
  patient: string;
  owner: string;
  date: string;
  time: string;
  type: string;
  status: string;
  color?: string;
}

export interface Vaccine {
  id: number | string;
  patient: string;
  owner: string;
  vaccine: string;
  date: string;
  time?: string;
  status: string;
}

export interface InventoryItem {
  id: number | string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: string;
  status: string;
}

export interface Transaction {
  id: number | string;
  type: 'income' | 'expense';
  amount: string;
  description: string;
  date: string;
  method?: string;
  eInvoice?: boolean;
}

export interface FarmAnimal {
  id: number | string;
  tagNo: string;
  species?: string;
  breed?: string;
  age?: string;
  farmOwner?: string;
  status: string;
  nextCheckup: string;
  inseminationDate: string;
  type?: string;
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

export function honorific(gender?: 'bayan' | 'bay'): string {
  return gender === 'bayan' ? 'Hanım' : 'Bey';
}

const DEFAULT_SETTINGS: SettingsData = {
  clinicName: 'CanVet Premium Klinik',
  phone: '0555 123 45 67',
  email: 'info@canvet.com',
  address: 'Örnek Mah. Pet Cad. No:1',
  taxOffice: 'Kozyatağı',
  taxNo: '1234567890',
  geminiApiKey: '',
  notifyVaccines: true,
  notifyStock: true
};

interface AppContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string | number) => void;

  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;

  vaccines: Vaccine[];
  addVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  updateVaccine: (vaccine: Vaccine) => void;
  deleteVaccine: (id: string | number) => void;

  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string | number) => void;

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

export function AppProvider({ children, session }: { children: ReactNode, session?: Session | null }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [farmAnimals, setFarmAnimals] = useState<FarmAnimal[]>([]);
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('canvet_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('canvet_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Load data from Supabase when session exists
  useEffect(() => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const loadData = async () => {
      try {
        const [
          { data: pts }, { data: aPts }, { data: vcs }, 
          { data: inv }, { data: txs }, { data: sets }
        ] = await Promise.all([
          supabase.from('patients').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('appointments').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('vaccines').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('inventory').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('settings').select('*').eq('user_id', userId).single()
        ]);

        if (pts) setPatients(pts);
        if (aPts) setAppointments(aPts);
        if (vcs) setVaccines(vcs);
        if (inv) setInventoryItems(inv);
        if (txs) setTransactions(txs);
        if (sets) {
          setSettings({
            clinicName: sets.clinic_name || DEFAULT_SETTINGS.clinicName,
            phone: sets.phone || DEFAULT_SETTINGS.phone,
            email: sets.email || DEFAULT_SETTINGS.email,
            address: sets.address || DEFAULT_SETTINGS.address,
            taxOffice: sets.tax_office || DEFAULT_SETTINGS.taxOffice,
            taxNo: sets.tax_no || DEFAULT_SETTINGS.taxNo,
            geminiApiKey: sets.gemini_api_key || '',
            notifyVaccines: sets.notify_vaccines ?? true,
            notifyStock: sets.notify_stock ?? true
          });
        }
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
      }
    };

    loadData();
  }, [session]);

  const getUserId = () => session?.user?.id;

  const addPatient = async (p: Omit<Patient, 'id'>) => {
    const userId = getUserId(); 
    if (!userId) throw new Error('Oturum süresi dolmuş, lütfen tekrar giriş yapın.');
    const { data, error } = await supabase.from('patients').insert([{ ...p, user_id: userId }]).select().single();
    if (error) throw new Error(error.message);
    if (data) setPatients(prev => [data, ...prev]);
  };

  const updatePatient = async (p: Patient) => {
    const { data, error } = await supabase.from('patients').update(p).eq('id', p.id).select().single();
    if (data && !error) setPatients(prev => prev.map(pt => pt.id === p.id ? data : pt));
  };

  const deletePatient = async (id: string | number) => {
    await supabase.from('patients').delete().eq('id', id);
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const addAppointment = async (a: Omit<Appointment, 'id'>) => {
    const userId = getUserId(); 
    if (!userId) throw new Error('Oturum süresi dolmuş.');
    const { data, error } = await supabase.from('appointments').insert([{ ...a, user_id: userId }]).select().single();
    if (error) throw new Error(error.message);
    if (data) setAppointments(prev => [data, ...prev]);
  };

  const addVaccine = async (v: Omit<Vaccine, 'id'>) => {
    const userId = getUserId(); 
    if (!userId) throw new Error('Oturum süresi dolmuş.');
    const { data, error } = await supabase.from('vaccines').insert([{ ...v, user_id: userId }]).select().single();
    if (error) throw new Error(error.message);
    if (data) setVaccines(prev => [data, ...prev]);
  };

  const updateVaccine = async (v: Vaccine) => {
    const { data, error } = await supabase.from('vaccines').update(v).eq('id', v.id).select().single();
    if (data && !error) setVaccines(prev => prev.map(vc => vc.id === v.id ? data : vc));
  };

  const deleteVaccine = async (id: string | number) => {
    await supabase.from('vaccines').delete().eq('id', id);
    setVaccines(prev => prev.filter(v => v.id !== id));
  };

  const addInventoryItem = async (i: Omit<InventoryItem, 'id'>) => {
    const userId = getUserId(); 
    if (!userId) throw new Error('Oturum süresi dolmuş.');
    const { data, error } = await supabase.from('inventory').insert([{ ...i, user_id: userId }]).select().single();
    if (error) throw new Error(error.message);
    if (data) setInventoryItems(prev => [data, ...prev]);
  };

  const updateInventoryItem = async (i: InventoryItem) => {
    const { data, error } = await supabase.from('inventory').update(i).eq('id', i.id).select().single();
    if (data && !error) setInventoryItems(prev => prev.map(item => item.id === i.id ? data : item));
  };

  const deleteInventoryItem = async (id: string | number) => {
    await supabase.from('inventory').delete().eq('id', id);
    setInventoryItems(prev => prev.filter(i => i.id !== id));
  };

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    const userId = getUserId(); 
    if (!userId) throw new Error('Oturum süresi dolmuş.');
    const { data, error } = await supabase.from('transactions').insert([{ ...t, user_id: userId }]).select().single();
    if (error) throw new Error(error.message);
    if (data) setTransactions(prev => [data, ...prev]);
  };

  const addFarmAnimal = async (f: Omit<FarmAnimal, 'id'>) => {
    // Farm animals could be added to DB similarly, handling locally for fallback brevity
    setFarmAnimals(prev => [{ ...f, id: Date.now().toString() }, ...prev]);
  };

  const updateSettings = async (s: SettingsData) => {
    const userId = getUserId(); if (!userId) return;
    setSettings(s);
    await supabase.from('settings').upsert({
      user_id: userId,
      clinic_name: s.clinicName,
      phone: s.phone,
      email: s.email,
      address: s.address,
      tax_office: s.taxOffice,
      tax_no: s.taxNo,
      gemini_api_key: s.geminiApiKey,
      notify_vaccines: s.notifyVaccines,
      notify_stock: s.notifyStock
    });
  };

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
