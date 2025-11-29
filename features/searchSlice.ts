// store/searchSlice.ts
import { SearchState } from '@/data/types/search';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { SearchState, SearchHistoryItem } from '../data/types/search';

const initialState: SearchState = {
  searchTerm: '',
  searchField: 'both', // По умолчанию ищем везде
  recentSearches: [],
  isSearchActive: false
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Установка поискового запроса
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.isSearchActive = action.payload.length > 0;
      
      // Добавляем в недавние поиски
      if (action.payload.trim() && !state.recentSearches.includes(action.payload.trim())) {
        state.recentSearches.unshift(action.payload.trim());
        // Ограничиваем 5 последними поисками
        if (state.recentSearches.length > 5) {
          state.recentSearches.pop();
        }
      }
    },
    
    // Очистка поиска
    clearSearchTerm: (state) => {
      state.searchTerm = '';
      state.isSearchActive = false;
    },
    
    // Установка поля поиска
    setSearchField: (state, action: PayloadAction<'title' | 'category' | 'both'>) => {
      state.searchField = action.payload;
    },
    
    // Быстрый поиск по категории
    searchByCategory: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.searchField = 'category';
      state.isSearchActive = true;
      
      // Добавляем в недавние поиски
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 5) {
          state.recentSearches.pop();
        }
      }
    },
    
    // Быстрый поиск по title
    searchByTitle: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.searchField = 'title';
      state.isSearchActive = true;
      
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 5) {
          state.recentSearches.pop();
        }
      }
    },
    
    // Удаление из недавних поисков
    removeFromRecentSearches: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        search => search !== action.payload
      );
    },
    
    // Очистка истории поисков
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    // Сброс всего поиска
    resetSearch: (state) => {
      state.searchTerm = '';
      state.searchField = 'both';
      state.isSearchActive = false;
    }
  }
});

export const {
  setSearchTerm,
  clearSearchTerm,
  setSearchField,
  searchByCategory,
  searchByTitle,
  removeFromRecentSearches,
  clearRecentSearches,
  resetSearch
} = searchSlice.actions;

export default searchSlice.reducer;