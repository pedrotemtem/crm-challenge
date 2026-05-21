'use client';

import { createContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '../lib/theme';

type Mode = 'light' | 'dark';

export const ColorModeContext = createContext<{ mode: Mode; toggle: () => void }>({
    mode: 'dark',
    toggle: () => {},
});

const STORAGE_KEY = 'crm-color-mode';

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<Mode>('dark');

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
        if (saved === 'light' || saved === 'dark') setMode(saved);
    }, []);

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const ctx = useMemo(
        () => ({
            mode,
            toggle: () =>
                setMode(prev => {
                    const next: Mode = prev === 'light' ? 'dark' : 'light';
                    localStorage.setItem(STORAGE_KEY, next);
                    return next;
                }),
        }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={ctx}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}