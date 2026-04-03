import { Router, RequestHandler } from 'express';
import StockEntryController from '../controllers/StockEntryController';
import { validate } from '../middlewares/validationMiddleware';
import { createStockEntrySchema } from '../schemas/StockEntrySchema';

const router = Router();

router.get('/', StockEntryController.findAll as RequestHandler);
router.get('/:id', StockEntryController.findById as RequestHandler);
router.post('/', validate(createStockEntrySchema), StockEntryController.create as RequestHandler);

export default router;
