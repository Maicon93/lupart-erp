import { AppDataSource } from '../config/database';
import { Customer } from '../models/Customer';
import { IsNull } from 'typeorm';

export default class CustomerRepository {
    private static repository = AppDataSource.getRepository(Customer);

    static async findAll(
        companyId: number,
        search?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: Customer[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('customer')
            .where('customer.companyId = :companyId', { companyId })
            .andWhere('customer.deletedAt IS NULL');

        if (search) {
            query.andWhere(
                '(customer.name ILIKE :search OR customer.cpfCnpj ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        query.orderBy('customer.name', 'ASC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    static async findById(id: number, companyId: number): Promise<Customer | null> {
        return this.repository.findOne({ where: { id, companyId, deletedAt: IsNull() } });
    }

    static async findByCpfCnpj(cpfCnpj: string, companyId: number): Promise<Customer | null> {
        return this.repository.findOne({ where: { cpfCnpj, companyId, deletedAt: IsNull() } });
    }
}

