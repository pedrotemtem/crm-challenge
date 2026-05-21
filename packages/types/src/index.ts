export interface Customer {
    customerId: string; //Mapped from CSV customerId
    firstName: string;
    lastName: string;
    email: string;
    ipCountry: string;
    company: string;
    createdAt: string; //First transaction date
}

export interface Subscription {
    subscriptionId: string; //Mapped from CSV subscriptionId
    customerId: string;
    product: string;
    status: string; //e.g. active, cancelled
    amount: number; //Recurring amount
    currency: string;
    startDate: Date;
}

export interface Transaction {
    transactionId: string; //From CSV transactionId
    customerId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: string; //e.g. success, failed, refunded
    gateway: string;
    cardBrand: string;
    chargedBack: boolean;
    completedAt: Date; //From CSV completed field
}