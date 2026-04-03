import { AppDataSource } from '../config/database';
import { MeasurementUnit } from '../models/MeasurementUnit';

export default class MeasurementUnitRepository {
    private repository = AppDataSource.getRepository(MeasurementUnit);

    async findAll(
        companyId: number,
        search?: string,
        status?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: MeasurementUnit[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('measurementUnit')
            .where('measurementUnit.companyId = :companyId', { companyId });

        if (search) {
            query.andWhere(
                '(measurementUnit.abbreviation ILIKE :search OR measurementUnit.description ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        if (status && status !== 'all') {
            query.andWhere('measurementUnit.status = :status', { status });
        }

        query.orderBy('measurementUnit.id', 'ASC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    async findById(id: number, companyId: number): Promise<MeasurementUnit | null> {
        return this.repository.findOne({ where: { id, companyId } });
    }

    async findByAbbreviation(abbreviation: string, companyId: number): Promise<MeasurementUnit | null> {
        return this.repository.findOne({ where: { abbreviation, companyId } });
    }
}

