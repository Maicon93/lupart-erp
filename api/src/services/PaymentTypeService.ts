import { AppDataSource } from '../config/database';
import { PaymentType, PaymentTypeStatus } from '../models/PaymentType';
import PaymentTypeRepository from '../repositories/PaymentTypeRepository';
import messageCodes from '../i18n/MessageCodes';
import { IBasicEntityInput } from '../interfaces/IBasicEntityInput';

export default class PaymentTypeService {
    private paymentTypeRepository = new PaymentTypeRepository();

    async findAll(companyId: number, search?: string, status?: string, page = 1, limit = 20) {
        return this.paymentTypeRepository.findAll(companyId, search, status, page, limit);
    }

    async findById(id: number, companyId: number) {
        const paymentType = await this.paymentTypeRepository.findById(id, companyId);

        if (!paymentType) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        return paymentType;
    }

    async create(companyId: number, input: IBasicEntityInput) {
        const existing = await this.paymentTypeRepository.findByName(input.name, companyId);

        if (existing) {
            throw { status: 400, messageCode: messageCodes.paymentTypes.errors.NAME_ALREADY_EXISTS };
        }

        const result = await AppDataSource.transaction(async (manager) => {
            const paymentType = manager.create(PaymentType, {
                companyId,
                name: input.name,
                observation: input.observation || undefined,
                status: PaymentTypeStatus.ACTIVE,
            });

            return manager.save(paymentType);
        });

        return result;
    }

    async update(id: number, companyId: number, input: IBasicEntityInput) {
        const paymentType = await this.paymentTypeRepository.findById(id, companyId);

        if (!paymentType) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        const existing = await this.paymentTypeRepository.findByName(input.name, companyId);

        if (existing && existing.id !== id) {
            throw { status: 400, messageCode: messageCodes.paymentTypes.errors.NAME_ALREADY_EXISTS };
        }

        await AppDataSource.transaction(async (manager) => {
            paymentType.name = input.name;
            paymentType.observation = input.observation || null as unknown as string;
            await manager.save(paymentType);
        });

        return paymentType;
    }

    async toggleStatus(id: number, companyId: number) {
        const paymentType = await this.paymentTypeRepository.findById(id, companyId);

        if (!paymentType) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        await AppDataSource.transaction(async (manager) => {
            paymentType.status =
                paymentType.status === PaymentTypeStatus.ACTIVE
                    ? PaymentTypeStatus.INACTIVE
                    : PaymentTypeStatus.ACTIVE;
            await manager.save(paymentType);
        });

        return paymentType;
    }
}

