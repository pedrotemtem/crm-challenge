import {getDb} from './database';
import { Customer, Subscription, Transaction } from '@crm/types';


//Customers
export const getAllCustomers = (): Customer[] =>
    getDb().prepare('SELECT * FROM customers').all() as Customer[]; //care for dupes or not?

export const getCustomerById = (id: String): Customer | undefined =>
    getDb().prepare('SELECT * FROM customers WHERE customerId = ?').get(id) as Customer | undefined;


//Subscriptions
export const getAllSubscriptions = (): Subscription[] =>
    getDb().prepare('SELECT * FROM subscriptions').all() as Subscription[];

export const getSubscriptionById = (id: String): Subscription | undefined =>
    getDb().prepare('SELECT * FROM subscriptions WHERE subscriptionId = ?').get(id) as Subscription | undefined;

export const getSubscriptionsByCustomer = (customerId: String): Subscription[] =>
    getDb().prepare('SELECT * FROM subscriptions WHERE customerId = ?').all(customerId) as Subscription[];


//Transactions
export const getAllTransactions = (): Transaction[] =>
    getDb().prepare('SELECT * FROM transactions').all() as Transaction[];

export const getTransactionById = (id: String): Transaction | undefined =>
    getDb().prepare('SELECT * FROM transactions WHERE transactionId = ?').get(id) as Transaction | undefined;

export const getTransactionsByCustomer = (customerId: String): Transaction[] =>
    getDb().prepare('SELECT * FROM transactions WHERE customerId = ?').all(customerId) as Transaction[];

export const getTransactionsBySubscription = (subscriptionId: String): Transaction[] =>
    getDb().prepare('SELECT * FROM transactions WHERE subscriptionId = ?').all(subscriptionId) as Transaction[];