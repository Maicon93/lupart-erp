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

const findAll = async (status?: string, page = 1, limit = 20): Promise<{ data: AccessPlan[]; total: number }> => {
    return AccessPlanRepository.findAll(status, page, limit);
};

const findById = async (id: number): Promise<AccessPlan> => {
    const accessPlan = await AccessPlanRepository.findById(id);

    if (!accessPlan) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return accessPlan;
};

const create = async (input: IAccessPlanInput): Promise<AccessPlan> => {
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
};

const update = async (id: number, input: IAccessPlanInput): Promise<AccessPlan> => {
    const accessPlan = await findById(id);

    return AppDataSource.transaction(async (manager) => {
        await manager.update(AccessPlan, accessPlan.id, {
            title: input.title,
            userLimit: input.userLimit,
            durationDays: input.durationDays,
            price: input.price,
        });

        return manager.findOneByOrFail(AccessPlan, { id: accessPlan.id });
    });
};

const toggleStatus = async (id: number): Promise<AccessPlan> => {
    const accessPlan = await findById(id);
    const newStatus = accessPlan.status === AccessPlanStatus.ACTIVE
        ? AccessPlanStatus.INACTIVE
        : AccessPlanStatus.ACTIVE;

    return AppDataSource.transaction(async (manager) => {
        await manager.update(AccessPlan, accessPlan.id, { status: newStatus });
        return manager.findOneByOrFail(AccessPlan, { id: accessPlan.id });
    });
};

const remove = async (id: number): Promise<void> => {
    await findById(id);

    const linkedCompanies = await AccessPlanRepository.countLinkedCompanies(id);

    if (linkedCompanies > 0) {
        throw { status: 400, messageCode: messageCodes.accessPlans.errors.HAS_LINKED_COMPANIES };
    }

    await AppDataSource.transaction(async (manager) => {
        await manager.delete(AccessPlan, id);
    });
};

export default { findAll, findById, create, update, toggleStatus, remove };
