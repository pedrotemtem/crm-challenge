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
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Transaction } from '@crm/types';
import { getTransactions } from '../../lib/api';

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h6" fontWeight={700}>{value}</Typography>
        </Paper>
    );
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTransactions()
            .then(setTransactions)
            .finally(() => setLoading(false));
    }, []);

    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const successCount = transactions.filter(t =>
        t.status?.toLowerCase() === 'approved' ||
        t.status?.toLowerCase() === 'success' ||
        t.status?.toLowerCase() === 'preauthorized'
    ).length;
    const successRate = transactions.length
        ? ((successCount / transactions.length) * 100).toFixed(1)
        : '0';

    const paginated = transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>Transactions</Typography>

            {/* Stats */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={6} md={3}>
                    <StatCard label="Total Transactions" value={transactions.length.toLocaleString()} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Total Amount" value={`$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Successful" value={successCount.toLocaleString()} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Success Rate" value={`${successRate}%`} />
                </Grid>
            </Grid>

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
                                    <TableCell>Transaction ID</TableCell>
                                    <TableCell>Customer ID</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Currency</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Gateway</TableCell>
                                    <TableCell>Card</TableCell>
                                    <TableCell>Charged Back</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.map(t => (
                                    <TableRow key={t.transactionId}>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                                            {t.transactionId}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                                            {t.customerId}
                                        </TableCell>
                                        <TableCell>{t.amount}</TableCell>
                                        <TableCell>{t.currency}</TableCell>
                                        <TableCell sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {t.status}
                                        </TableCell>
                                        <TableCell>{t.gateway}</TableCell>
                                        <TableCell>{t.cardBrand}</TableCell>
                                        <TableCell>{t.chargedBack ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            {t.completedAt ? new Date(t.completedAt).toLocaleDateString() : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={transactions.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(_, p) => setPage(p)}
                        onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Paper>
            )}
        </Box>
    );
}