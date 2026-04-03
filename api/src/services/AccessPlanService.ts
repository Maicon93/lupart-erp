import { AppDataSource } from '../config/database';
import AccessPlanRepository from '../repositories/AccessPlanRepository';
import { AccessPlan, AccessPlanStatus } from '../models/AccessPlan';
import messageCodes from '../i18n/MessageCodes';

interface IAccessPlanInput {
    title: string;
    userLimit: number;
    durationDays: number;
    price: number;
}

export default class AccessPlanService {
    static async findAll(status?: string, page = 1, limit = 20): Promise<{ data: AccessPlan[]; total: number }> {
        return AccessPlanRepository.findAll(status, page, limit);
    }

    static async findById(id: number): Promise<AccessPlan> {
        const accessPlan = await AccessPlanRepository.findById(id);

        if (!accessPlan) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        return accessPlan;
    }

    static async create(input: IAccessPlanInput): Promise<AccessPlan> {
        return AppDataSource.transaction(async (manager) => {
            const entity = manager.create(AccessPlan, {
                title: input.title,
                userLimit: input.userLimit,
                durationDays: input.durationDays,
                price: input.price,
                status: AccessPlanStatus.ACTIVE,
            });

            return manager.save(entity);
        });
    }

    static async update(id: number, input: IAccessPlanInput): Promise<AccessPlan> {
        const accessPlan = await this.findById(id);

        return AppDataSource.transaction(async (manager) => {
            await manager.update(AccessPlan, accessPlan.id, {
                title: input.title,
                userLimit: input.userLimit,
                durationDays: input.durationDays,
                price: input.price,
            });

            return manager.findOneByOrFail(AccessPlan, { id: accessPlan.id });
        });
    }

    static async toggleStatus(id: number): Promise<AccessPlan> {
        const accessPlan = await this.findById(id);
        const newStatus = accessPlan.status === AccessPlanStatus.ACTIVE ? AccessPlanStatus.INACTIVE : AccessPlanStatus.ACTIVE;

        return AppDataSource.transaction(async (manager) => {
            await manager.update(AccessPlan, accessPlan.id, { status: newStatus });
            return manager.findOneByOrFail(AccessPlan, { id: accessPlan.id });
        });
    }

    static async remove(id: number): Promise<void> {
        await this.findById(id);

        const linkedCompanies = await AccessPlanRepository.countLinkedCompanies(id);

        if (linkedCompanies > 0) {
            throw { status: 400, messageCode: messageCodes.accessPlans.errors.HAS_LINKED_COMPANIES };
        }

        await AppDataSource.transaction(async (manager) => {
            await manager.delete(AccessPlan, id);
        });
    }
}

