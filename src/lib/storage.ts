import type { AppData } from "@/types";
import { seedData } from "./seed";

const STORAGE_KEY = "nou-ae-local-data-v1";

export function loadAppData(): AppData {
  if (typeof window === "undefined") return seedData;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveAppData(seedData);
    return seedData;
  }

  try {
    return { ...seedData, ...JSON.parse(stored) } as AppData;
  } catch {
    return seedData;
  }
}

export function saveAppData(data: AppData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetAppData() {
  saveAppData(seedData);
  return seedData;
}

export function exportAppData(data: AppData) {
  return JSON.stringify(data, null, 2);
}

export function parseImportedData(value: string): AppData {
  const parsed = JSON.parse(value) as Partial<AppData>;
  return { ...seedData, ...parsed };
}
