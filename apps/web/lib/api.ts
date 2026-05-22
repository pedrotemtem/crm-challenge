import axios from 'axios';
import { Customer, Subscription, Transaction } from '@crm/types';

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3123',
});


// Customers
export const getCustomers = () =>
    client.get<Customer[]>('/customers').then(r => r.data);

export const getCustomer = (id: string) =>
    client.get<Customer>(`/customers/${id}`).then(r => r.data);

export const getCustomerSubscriptions = (id: string) =>
    client.get<Subscription[]>(`/customers/${id}/subscriptions`).then(r => r.data);

export const getCustomerTransactions = (id: string) =>
    client.get<Transaction[]>(`/customers/${id}/transactions`).then(r => r.data);


// Subscriptions
export const getSubscriptions = () =>
    client.get<Subscription[]>('/subscriptions').then(r => r.data);

export const getSubscription = (id: string) =>
    client.get<Subscription>(`/subscriptions/${id}`).then(r => r.data);


// Transactions
export const getTransactions = () =>
    client.get<Transaction[]>('/transactions').then(r => r.data);

export const getTransaction = (id: string) =>
    client.get<Transaction>(`/transactions/${id}`).then(r => r.data);