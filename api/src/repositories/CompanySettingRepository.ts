import { AppDataSource } from '../config/database';
import { CompanySetting } from '../models/CompanySetting';

export default class CompanySettingRepository {
    private repository = AppDataSource.getRepository(CompanySetting);

    async findByCompanyId(companyId: number): Promise<CompanySetting | null> {
        return this.repository.findOne({ where: { companyId } });
    }

    async update(companyId: number, allowNegativeStock: boolean): Promise<void> {
        await this.repository.update({ companyId }, { allowNegativeStock });
    }
}
