export const safeStorage = {
  getItem: (key: string) => {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(key);
      if (item === null) return null;
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setItem: (key: string, value: any) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  removeItem: (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
