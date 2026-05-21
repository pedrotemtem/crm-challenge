'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Customer, Subscription, Transaction } from '@crm/types';
import { getCustomer, getCustomerSubscriptions, getCustomerTransactions } from '../../../lib/api';

const statusColor = (status: string | null) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
        case 'active': return 'success';
        case 'cancelled': return 'error';
        case 'success': return 'success';
        case 'failed': return 'error';
        case 'refunded': return 'warning';
        default: return 'default';
    }
};

export default function CustomerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getCustomer(id),
            getCustomerSubscriptions(id),
            getCustomerTransactions(id),
        ]).then(([c, s, t]) => {
            setCustomer(c);
            setSubscriptions(s);
            setTransactions(t.slice(0, 10));
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress />
        </Box>
    );

    if (!customer) return (
        <Typography>Customer not found.</Typography>
    );

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            {/* Customer Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight={700} mb={2}>
                    {customer.firstName} {customer.lastName}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography>{customer.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Company</Typography>
                        <Typography>{customer.company}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Country</Typography>
                        <Typography>{customer.ipCountry}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Customer Since</Typography>
                        <Typography>{new Date(customer.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Subscriptions */}
            <Typography variant="h6" fontWeight={600} mb={1}>Subscriptions</Typography>
            <Paper sx={{ mb: 3 }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Start Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subscriptions.map(s => (
                                <TableRow key={s.subscriptionId}>
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
            </Paper>

            {/* Recent Transactions */}
            <Typography variant="h6" fontWeight={600} mb={1}>Recent Transactions</Typography>
            <Paper>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Gateway</TableCell>
                                <TableCell>Card</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map(t => (
                                <TableRow key={t.transactionId}>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                                        {t.transactionId}
                                    </TableCell>
                                    <TableCell>{t.amount}</TableCell>
                                    <TableCell>{t.currency}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={t.status}
                                            color={statusColor(t.status) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{t.gateway}</TableCell>
                                    <TableCell>{t.cardBrand}</TableCell>
                                    <TableCell>{new Date(t.completedAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}