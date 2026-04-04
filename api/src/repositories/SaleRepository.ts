import { AppDataSource } from '../config/database';
import { Sale } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';
import { FinancialTitle, FinancialTitleOrigin } from '../models/FinancialTitle';

export default class SaleRepository {
    private repository = AppDataSource.getRepository(Sale);

    async findAll(
        companyId: number,
        search?: string,
        customerId?: number,
        dateStart?: string,
        dateEnd?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: Sale[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.creator', 'creator')
            .where('sale.companyId = :companyId', { companyId });

        if (search) {
            query.andWhere(
                '(CAST(sale.id AS TEXT) ILIKE :search OR customer.name ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        if (customerId) {
            query.andWhere('sale.customerId = :customerId', { customerId });
        }

        if (dateStart) {
            query.andWhere('sale.date >= :dateStart', { dateStart });
        }

        if (dateEnd) {
            query.andWhere('sale.date <= :dateEnd', { dateEnd });
        }

        query.orderBy('sale.id', 'DESC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    async findById(id: number, companyId: number): Promise<Sale | null> {
        return this.repository.findOne({
            where: { id, companyId },
            relations: ['customer', 'creator'],
        });
    }

    async findItemsBySaleId(saleId: number): Promise<SaleItem[]> {
        return AppDataSource.getRepository(SaleItem).find({
            where: { saleId },
            relations: ['product', 'product.measurementUnit'],
            order: { id: 'ASC' },
        });
    }

    async findPaymentBySaleId(saleId: number, companyId: number): Promise<FinancialTitle[]> {
        return AppDataSource.getRepository(FinancialTitle).find({
            where: { referenceId: saleId, companyId, origin: FinancialTitleOrigin.SALE },
            relations: ['paymentType'],
            order: { id: 'ASC' },
        });
    }
}
