import { ReadingRecord } from './types';

const STORAGE_KEY = 'kxiang-readings';

export function getReadings(): ReadingRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addReading(record: ReadingRecord): void {
  const readings = getReadings();
  readings.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
}

export function deleteReading(id: string): void {
  const readings = getReadings().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
}
