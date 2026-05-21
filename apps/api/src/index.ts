import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customers';
import subscriptionRoutes from './routes/subscriptions';
import transactionRoutes from './routes/transactions';
import seedRoutes from './routes/seed';
import { initDb } from './db/database';

const app= express()
const port = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/transactions', transactionRoutes);
app.use('/seed', seedRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

initDb();
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});

export default app;
