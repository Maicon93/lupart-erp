import { AppDataSource } from '../config/database';
import { Company } from '../models/Company';
import CompanySettingRepository from '../repositories/CompanySettingRepository';
import messageCodes from '../i18n/MessageCodes';
import { uploadToS3, deleteFromS3, extractS3Key } from '../helpers/S3Helper';

export default class CompanySettingService {
    private companySettingRepository = new CompanySettingRepository();
    private companyRepository = AppDataSource.getRepository(Company);

    async findByCompanyId(companyId: number) {
        const setting = await this.companySettingRepository.findByCompanyId(companyId);

        if (!setting) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        const company = await this.companyRepository.findOne({
            where: { id: companyId },
            select: ['logoUrl'],
        });

        return {
            allowNegativeStock: setting.allowNegativeStock,
            logoUrl: company?.logoUrl ?? null,
        };
    }

    async updateSettings(companyId: number, allowNegativeStock: boolean): Promise<void> {
        const setting = await this.companySettingRepository.findByCompanyId(companyId);

        if (!setting) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        await AppDataSource.transaction(async (manager) => {
            await manager.update(
                (await import('../models/CompanySetting')).CompanySetting,
                { companyId },
                { allowNegativeStock },
            );
        });
    }

    async uploadLogo(companyId: number, buffer: Buffer, mimeType: string): Promise<string> {
        const company = await this.companyRepository.findOne({
            where: { id: companyId },
            select: ['id', 'logoUrl'],
        });

        if (!company) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        if (company.logoUrl) {
            const oldKey = extractS3Key(company.logoUrl);
            if (oldKey) {
                await deleteFromS3(oldKey);
            }
        }

        const extension = mimeType === 'image/png' ? 'png' : 'jpg';
        const key = `company/images/logos/${companyId}.${extension}`;
        const logoUrl = await uploadToS3(buffer, key, mimeType);

        await AppDataSource.transaction(async (manager) => {
            await manager.update(Company, { id: companyId }, { logoUrl });
        });

        return logoUrl;
    }

    async removeLogo(companyId: number): Promise<void> {
        const company = await this.companyRepository.findOne({
            where: { id: companyId },
            select: ['id', 'logoUrl'],
        });

        if (!company) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        if (!company.logoUrl) {
            throw { status: 400, messageCode: messageCodes.companySettings.errors.NO_LOGO };
        }

        const key = extractS3Key(company.logoUrl);
        if (key) {
            await deleteFromS3(key);
        }

        await AppDataSource.transaction(async (manager) => {
            await manager.update(Company, { id: companyId }, { logoUrl: null });
        });
    }
}
