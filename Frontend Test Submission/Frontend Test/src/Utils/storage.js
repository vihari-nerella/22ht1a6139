// utils/storage.js
export const STORAGE_KEYS = {
  LINKS: 'shortlinks_v1',
  LOGS: 'app_logs_v1'
};

export const getLinks = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS) || '[]');
  } catch () {
    return [];
  }
};

export const saveLinks = (links) => {
  localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
};

export const getLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  } catch () {
    return [];
  }
};

export const saveLogs = (logs) => {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
};