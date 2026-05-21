import { Router, Request, Response } from 'express';
import {getAllCustomers, getCustomerById, getSubscriptionsByCustomer, getTransactionsByCustomer} from "../db/queries";

const router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.json(getAllCustomers());
})

router.get('/:id', (req: Request, res: Response) => {
    const customer = getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
});

router.get('/:id/subscriptions', (req: Request, res: Response) => {
    res.json(getSubscriptionsByCustomer(req.params.id));
});

router.get('/:id/transactions', (req: Request, res: Response) => {
    res.json(getTransactionsByCustomer(req.params.id));
});

export default router;