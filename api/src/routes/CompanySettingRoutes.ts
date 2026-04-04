import { Router } from 'express';
import multer from 'multer';
import CompanySettingController from '../controllers/CompanySettingController';
import { validate } from '../middlewares/validationMiddleware';
import { CompanySettingSchema } from '../schemas/CompanySettingSchema';

const router = Router();
const controller = new CompanySettingController();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
        const allowed = ['image/png', 'image/jpeg'];
        if (allowed.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('invalid_file_type'));
        }
    },
});

router.get('/', (req, res) => controller.findByCompanyId(req as any, res));
router.put('/', validate(CompanySettingSchema), (req, res) => controller.updateSettings(req as any, res));
router.post('/logo', upload.single('logo'), (req, res) => controller.uploadLogo(req as any, res));
router.delete('/logo', (req, res) => controller.removeLogo(req as any, res));

export default router;
