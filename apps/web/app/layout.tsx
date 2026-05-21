import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Box from '@mui/material/Box';
import AppThemeProvider from '../components/theme-provider';
import Sidebar from '../components/sidebar';

export const metadata: Metadata = {
    title: 'CRM',
    description: 'PaddyLabs CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <AppRouterCacheProvider>
            <AppThemeProvider>
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
                        {children}
                    </Box>
                </Box>
            </AppThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}