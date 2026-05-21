import { Router, Request, Response } from 'express';
import { getAllTransactions, getTransactionById } from '../db/queries';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.json(getAllTransactions());
});

router.get('/:id', (req: Request, res: Response) => {
    const tx = getTransactionById(req.params.id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    res.json(tx);
});

export default router;
