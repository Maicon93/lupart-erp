import { AppDataSource } from '../config/database';
import { StockEntry } from '../models/StockEntry';
import { StockEntryItem } from '../models/StockEntryItem';

export default class StockEntryRepository {
    private repository = AppDataSource.getRepository(StockEntry);

    async findAll(
        companyId: number,
        search?: string,
        supplierId?: number,
        dateStart?: string,
        dateEnd?: string,
        createdBy?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: StockEntry[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('stockEntry')
            .leftJoinAndSelect('stockEntry.supplier', 'supplier')
            .leftJoinAndSelect('stockEntry.creator', 'creator')
            .loadRelationCountAndMap('stockEntry.itemCount', 'stockEntry.items')
            .where('stockEntry.companyId = :companyId', { companyId });

        if (search) {
            query.andWhere(
                '(CAST(stockEntry.id AS TEXT) ILIKE :search OR stockEntry.invoiceNumber ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        if (supplierId) {
            query.andWhere('stockEntry.supplierId = :supplierId', { supplierId });
        }

        if (dateStart) {
            query.andWhere('stockEntry.date >= :dateStart', { dateStart });
        }

        if (dateEnd) {
            query.andWhere('stockEntry.date <= :dateEnd', { dateEnd });
        }

        if (createdBy) {
            query.andWhere('creator.name ILIKE :createdBy', { createdBy: `%${createdBy}%` });
        }

        query.orderBy('stockEntry.id', 'DESC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    async findById(id: number, companyId: number): Promise<StockEntry | null> {
        return this.repository.findOne({
            where: { id, companyId },
            relations: ['supplier', 'creator'],
        });
    }

    async findItemsByEntryId(stockEntryId: number): Promise<StockEntryItem[]> {
        return AppDataSource.getRepository(StockEntryItem).find({
            where: { stockEntryId },
            relations: ['product', 'product.measurementUnit'],
            order: { id: 'ASC' },
        });
    }
}

