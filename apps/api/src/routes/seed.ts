import { Router, Request, Response } from 'express';
import { seedFromCsv } from '../services/seed';

const router = Router();

router.post('/', async (_req: Request, res: Response) => {
    try {
        const result = await seedFromCsv();
        res.json({ message: 'Seed complete', ...result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Seed failed', detail: String(err) });
    }
});

export default router;