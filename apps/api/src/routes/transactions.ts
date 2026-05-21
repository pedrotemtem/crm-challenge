import { Router, Request, Response } from 'express';
import { getAllSubscriptions, getSubscriptionById, getTransactionsBySubscription } from '../db/queries';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.json(getAllSubscriptions());
});

router.get('/:id', (req: Request, res: Response) => {
    const sub = getSubscriptionById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });
    res.json(sub);
});

router.get('/:id/transactions', (req: Request, res: Response) => {
    res.json(getTransactionsBySubscription(req.params.id));
});

export default router;