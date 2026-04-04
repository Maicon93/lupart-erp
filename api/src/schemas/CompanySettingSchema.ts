import { z } from 'zod';
import messageCodes from '../i18n/MessageCodes';

export const CompanySettingSchema = z.object({
    allowNegativeStock: z.boolean({ message: messageCodes.common.validations.REQUIRED_FIELD }),
});
