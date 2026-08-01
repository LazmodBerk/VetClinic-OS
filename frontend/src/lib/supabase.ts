import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iasucehwovsnhzspfms.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhc3VjZWh3b3Zzbmh6c3BmcG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1Nzg3MTQsImV4cCI6MjEwMTE1NDcxNH0.FB4cF1T8IVu3XsrGqV7pjLqL3nYXlhbSyDy4il9HhnA';

export const supabase = createClient(supabaseUrl, supabaseKey);
