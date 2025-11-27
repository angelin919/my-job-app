'use client';

import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { store } from '@/store/store';

interface ReduxProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

// src/
// ├── app/
// │   ├── layout.tsx
// │   └── page.tsx
// ├── components/
// │   ├── JobList.tsx
// │   ├── JobCard.tsx
// │   └── ...
// ├── hooks/
// │   └── redux.ts
// ├── providers/           ← Эта папка должна быть
// │   └── ReduxProvider.tsx
// ├── store/
// │   ├── index.ts
// │   ├── jobSlice.ts
// │   └── searchSlice.ts
// └── types/
//     ├── job.ts
//     └── search.ts