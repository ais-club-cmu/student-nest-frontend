import { create } from 'zustand';

interface HousingState {
    favorites: string[];
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
}

export const useHousingStore = create<HousingState>((set) => ({
    favorites: [],
    addFavorite: (id) => set((state) => ({ favorites: [...state.favorites, id] })),
    removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter(favId => favId !== id) })),
}));
