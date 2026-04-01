import { AppDataSource } from '../config/database';
import { PaymentType } from '../models/PaymentType';

const repository = AppDataSource.getRepository(PaymentType);

const findAll = async (
    companyId: number,
    search?: string,
    status?: string,
    page = 1,
    limit = 20
): Promise<{ data: PaymentType[]; total: number }> => {
    const query = repository
        .createQueryBuilder('paymentType')
        .where('paymentType.companyId = :companyId', { companyId });

    if (search) {
        query.andWhere('(paymentType.name ILIKE :search)', { search: `%${search}%` });
    }

    if (status && status !== 'all') {
        query.andWhere('paymentType.status = :status', { status });
    }

    query.orderBy('paymentType.id', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number, companyId: number): Promise<PaymentType | null> => {
    return repository.findOne({ where: { id, companyId } });
};

const findByName = async (name: string, companyId: number): Promise<PaymentType | null> => {
    return repository.findOne({ where: { name, companyId } });
};

export default { findAll, findById, findByName };
