import { Router } from 'express';
import StockEntryController from '../controllers/StockEntryController';
import { validate } from '../middlewares/validationMiddleware';
import { createStockEntrySchema } from '../schemas/StockEntrySchema';

const router = Router();
const controller = new StockEntryController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.post('/', validate(createStockEntrySchema), (req, res) => controller.create(req as any, res));

export default router;
