'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { Customer } from '@crm/types';
import { getCustomers } from '../../lib/api';

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCustomers()
            .then(setCustomers)
            .finally(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>Customers</Typography>

            <TextField
                placeholder="Search by name or email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                size="small"
                sx={{ mb: 2, width: 320 }}
            />

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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Company</TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Created</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.map(c => (
                                    <TableRow
                                        key={c.customerId}
                                        hover
                                        onClick={() => router.push(`/customers/${c.customerId}`)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{c.firstName} {c.lastName}</TableCell>
                                        <TableCell>{c.email}</TableCell>
                                        <TableCell>{c.company}</TableCell>
                                        <TableCell>{c.ipCountry}</TableCell>
                                        <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
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