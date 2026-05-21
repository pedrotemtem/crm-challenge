import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../crm.db');

let db: Database.Database;

export function getDb() {
    if(!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
    }
    return db;
}

export function initDb() {
    const db = getDb();
    db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
             customerId    TEXT PRIMARY KEY,
             firstName     TEXT NOT NULL,
             lastName      TEXT NOT NULL,
             email         TEXT NOT NULL,
             ipCountry     TEXT,
             company       TEXT,
             createdAt     TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS subscriptions (
             subscriptionId TEXT PRIMARY KEY,
             customerId     TEXT NOT NULL,
             product        TEXT,
             status         TEXT,
             amount         REAL,
             currency       TEXT,
             startDate      TEXT,
             FOREIGN KEY (customerId) REFERENCES customers(customerId)
        );

        CREATE TABLE IF NOT EXISTS transactions (
            transactionId  TEXT PRIMARY KEY,
            subscriptionId TEXT NOT NULL,
            customerId     TEXT NOT NULL,
            amount         REAL,
            currency       TEXT,
            status         TEXT,
            gateway        TEXT,
            cardBrand      TEXT,
            chargedBack    INTEGER DEFAULT 0,
            completedAt    TEXT,
            FOREIGN KEY (subscriptionId) REFERENCES subscriptions(subscriptionId),
            FOREIGN KEY (customerId)     REFERENCES customers(customerId)
        );
    `);

    console.log('Database set');
}