import create from 'zustand';

const useUserStore = create((set) => ({
    user: [],
    setUser: (userData) => set({ user: userData }),
    clearUser: () => set({ user: null }),
}));

export default useUserStore;
