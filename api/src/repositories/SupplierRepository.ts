import { AppDataSource } from '../config/database';
import { Supplier } from '../models/Supplier';
import { IsNull } from 'typeorm';

export default class SupplierRepository {
    private static repository = AppDataSource.getRepository(Supplier);

    static async findAll(
        companyId: number,
        search?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: Supplier[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('supplier')
            .where('supplier.companyId = :companyId', { companyId })
            .andWhere('supplier.deletedAt IS NULL');

        if (search) {
            query.andWhere(
                '(supplier.name ILIKE :search OR supplier.cpfCnpj ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        query.orderBy('supplier.name', 'ASC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    static async findById(id: number, companyId: number): Promise<Supplier | null> {
        return this.repository.findOne({ where: { id, companyId, deletedAt: IsNull() } });
    }

    static async findByCpfCnpj(cpfCnpj: string, companyId: number): Promise<Supplier | null> {
        return this.repository.findOne({ where: { cpfCnpj, companyId, deletedAt: IsNull() } });
    }
}

