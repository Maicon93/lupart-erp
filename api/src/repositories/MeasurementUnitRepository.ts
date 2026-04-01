import { AppDataSource } from '../config/database';
import { MeasurementUnit } from '../models/MeasurementUnit';

const repository = AppDataSource.getRepository(MeasurementUnit);

const findAll = async (
    companyId: number,
    search?: string,
    status?: string,
    page = 1,
    limit = 20
): Promise<{ data: MeasurementUnit[]; total: number }> => {
    const query = repository
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
};

const findById = async (id: number, companyId: number): Promise<MeasurementUnit | null> => {
    return repository.findOne({ where: { id, companyId } });
};

const findByAbbreviation = async (abbreviation: string, companyId: number): Promise<MeasurementUnit | null> => {
    return repository.findOne({ where: { abbreviation, companyId } });
};

export default { findAll, findById, findByAbbreviation };
