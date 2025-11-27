'use client'
import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import {
    setSearchTerm,
    clearSearchTerm,
    setSearchField,
    searchByCategory,
    searchByTitle,
    removeFromRecentSearches
} from '../../features/searchSlice';
interface SearchBarProps {

    placeholder?: string;
    className?: string;
}
const SearchBar = ({
    placeholder = 'Search...',
    className = '' }: SearchBarProps) => {

    const dispatch = useAppDispatch();
    const { searchTerm,
        searchField,
        recentSearches,
        isSearchActive } = useAppSelector((state) => state.search);
    console.log(searchField, '-searchField')
    console.log(recentSearches, '-recentSearches')
    console.log(isSearchActive, '-isSearchActive')



    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false); // ← Локальное состояние загрузки


    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchTerm) {
                dispatch(setSearchTerm(localSearch))
                setIsSearching(false); // ← Заканчиваем поиск

            } else if (localSearch.trim() == '') {
                dispatch(clearSearchTerm())
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [localSearch, searchTerm, dispatch]);

    // Синхронизируем локальное состояние с глобальным при внешних изменениях
    useEffect(() => {
        setLocalSearch(searchTerm);
    }, [searchTerm]);

    const handleClear = () => {
        setLocalSearch('');
        dispatch(clearSearchTerm())
        setShowSuggestions(false)
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setLocalSearch(value);
        if(value.trim() == ''){
            dispatch(clearSearchTerm())
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClear();
        }
    };
    const handleFocus = () => {
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };


    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>

            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={localSearch}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   bg-white text-gray-900 placeholder-gray-500
                   transition-all duration-200
                   shadow-sm hover:shadow-md focus:shadow-lg"
                aria-label="Search jobs"
            />

            {/* Кнопка очистки */}
            {localSearch && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center 
                     text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Clear search"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            )}

            {/* Индикатор поиска */}
            {isSearching && (
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                    Searching in titles, companies...
                </div>
            )}
        </div>
    );
};

export default SearchBar;