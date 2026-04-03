import { AppDataSource } from '../config/database';
import { PaymentType } from '../models/PaymentType';

export default class PaymentTypeRepository {
    private static repository = AppDataSource.getRepository(PaymentType);

    static async findAll(
        companyId: number,
        search?: string,
        status?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: PaymentType[]; total: number }> {
        const query = this.repository
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
    }

    static async findById(id: number, companyId: number): Promise<PaymentType | null> {
        return this.repository.findOne({ where: { id, companyId } });
    }

    static async findByName(name: string, companyId: number): Promise<PaymentType | null> {
        return this.repository.findOne({ where: { name, companyId } });
    }
}

