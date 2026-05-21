'use client';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import { Subscription } from '@crm/types';
import { getSubscriptions } from '../../lib/api';

const statusColor = (status: string | null) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
        case 'active': return 'success';
        case 'cancelled': return 'error';
        default: return 'default';
    }
};

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSubscriptions()
            .then(setSubscriptions)
            .finally(() => setLoading(false));
    }, []);

    const filtered = subscriptions.filter(s => {
        if (filter === 'all') return true;
        return s.status?.toLowerCase() === filter;
    });

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>Subscriptions</Typography>

            <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, val) => { if (val) { setFilter(val); setPage(0); } }}
                size="small"
                sx={{ mb: 2 }}
            >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="active">Active</ToggleButton>
                <ToggleButton value="cancelled">Cancelled</ToggleButton>
            </ToggleButtonGroup>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={8}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subscription ID</TableCell>
                                    <TableCell>Customer ID</TableCell>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Currency</TableCell>
                                    <TableCell>Start Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.map(s => (
                                    <TableRow key={s.subscriptionId}>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                                            {s.subscriptionId}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                                            {s.customerId}
                                        </TableCell>
                                        <TableCell>{s.product}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={s.status}
                                                color={statusColor(s.status) as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{s.amount}</TableCell>
                                        <TableCell>{s.currency}</TableCell>
                                        <TableCell>{new Date(s.startDate).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filtered.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(_, p) => setPage(p)}
                        onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                        rowsPerPageOptions={[10, 25, 50]}
                    />
                </Paper>
            )}
        </Box>
    );
}