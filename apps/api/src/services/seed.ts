import { parse } from 'csv-parse/sync';
import { getDb } from '../db/database';
import https from 'https';

const CSV_URL = 'https://paddylabs-public-bucket.s3.eu-central-1.amazonaws.com/demo_transactions.csv';

function fetchCsv(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => resolve(data));
            res.on('error', reject);
        });
    });
}

export async function seedFromCsv(): Promise<{ customers: number; subscriptions: number; transactions: number }> {
    const db = getDb();
    const raw = await fetchCsv(CSV_URL);

    const rows = parse(raw, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    const customersMap = new Map<string, any>();
    const subscriptionsMap = new Map<string, any>();

    // First pass — collect unique customers and subscriptions
    for (const row of rows) {
        if (!customersMap.has(row.customerId)) {
            customersMap.set(row.customerId, {
                customerId: row.customerId,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                ipCountry: row.ipCountry,
                company: row.company,
                createdAt: new Date(row.completed).toISOString(),
            });
        }

        if (!subscriptionsMap.has(row.subscriptionId)) {
            subscriptionsMap.set(row.subscriptionId, {
                subscriptionId: row.subscriptionId,
                customerId: row.customerId,
                product: row.product,
                status: null as string | null,
                amount: parseFloat(row.amount),
                currency: row.currency,
                startDate: row.completed ? new Date(row.completed).toISOString() : null,
            });
        }
    }

    // Check subscription status based on last approved transaction if in last 30 days
    // 120 days is just to check if active is working
    const ACTIVE_WINDOW_DAYS = 120;
    const txBySub = new Map<string, any[]>();
    for (const row of rows) {
        if (!txBySub.has(row.subscriptionId)) txBySub.set(row.subscriptionId, []);
        txBySub.get(row.subscriptionId)!.push(row);
    }
    for (const sub of subscriptionsMap.values()) {
        const lastApproved = (txBySub.get(sub.subscriptionId) ?? [])
            .filter(t => t.status === 'Approved')
            .sort((a, b) => new Date(b.completed).getTime() - new Date(a.completed).getTime())[0];

        const daysSince = lastApproved
            ? (Date.now() - new Date(lastApproved.completed).getTime()) / 86_400_000
            : Infinity;

        sub.status = daysSince <= ACTIVE_WINDOW_DAYS ? 'active' : 'cancelled';
    }

    // Insert using transactions for performance
    const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO customers (customerId, firstName, lastName, email, ipCountry, company, createdAt)
    VALUES (@customerId, @firstName, @lastName, @email, @ipCountry, @company, @createdAt)
  `);

    const insertSubscription = db.prepare(`
    INSERT OR REPLACE INTO subscriptions (subscriptionId, customerId, product, status, amount, currency, startDate)
    VALUES (@subscriptionId, @customerId, @product, @status, @amount, @currency, @startDate)
  `);

    const insertTransaction = db.prepare(`
    INSERT OR IGNORE INTO transactions (transactionId, subscriptionId, customerId, amount, currency, status, gateway, cardBrand, chargedBack, completedAt)
    VALUES (@transactionId, @subscriptionId, @customerId, @amount, @currency, @status, @gateway, @cardBrand, @chargedBack, @completedAt)
  `);

    const runSeed = db.transaction(() => {
        for (const customer of customersMap.values()) {
            insertCustomer.run(customer);
        }
        for (const subscription of subscriptionsMap.values()) {
            insertSubscription.run(subscription);
        }
        for (const row of rows) {
            insertTransaction.run({
                transactionId: row.transactionId,
                subscriptionId: row.subscriptionId,
                customerId: row.customerId,
                amount: parseFloat(row.amount),
                currency: row.currency,
                status: row.status,
                gateway: row.gateway,
                cardBrand: row.cardBrand,
                chargedBack: row.chargedBack === 'true' ? 1 : 0,
                completedAt: new Date(row.completed).toISOString(),
            });
        }
    });

    runSeed();

    return {
        customers: customersMap.size,
        subscriptions: subscriptionsMap.size,
        transactions: rows.length,
    };
}