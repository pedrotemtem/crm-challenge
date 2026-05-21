export interface Customer {
    customerId: string; //Mapped from CSV customerId
    firstName: string;
    lastName: string;
    email: string;
    ipCountry: string;
    company: string;
    createdAt: string; //First transaction date
}