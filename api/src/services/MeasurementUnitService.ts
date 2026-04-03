import { AppDataSource } from '../config/database';
import { MeasurementUnit, MeasurementUnitStatus } from '../models/MeasurementUnit';
import MeasurementUnitRepository from '../repositories/MeasurementUnitRepository';
import messageCodes from '../i18n/MessageCodes';

interface IMeasurementUnitInput {
    abbreviation: string;
    description: string;
}

export default class MeasurementUnitService {
    static async findAll(
        companyId: number,
        search?: string,
        status?: string,
        page = 1,
        limit = 20
    ) {
        return MeasurementUnitRepository.findAll(companyId, search, status, page, limit);
    }

    static async findById(id: number, companyId: number) {
        const unit = await MeasurementUnitRepository.findById(id, companyId);

        if (!unit) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        return unit;
    }

    static async create(companyId: number, input: IMeasurementUnitInput) {
        const existing = await MeasurementUnitRepository.findByAbbreviation(input.abbreviation, companyId);

        if (existing) {
            throw { status: 400, messageCode: messageCodes.measurementUnits.errors.ABBREVIATION_ALREADY_EXISTS };
        }

        const result = await AppDataSource.transaction(async (manager) => {
            const unit = manager.create(MeasurementUnit, {
                companyId,
                abbreviation: input.abbreviation,
                description: input.description,
                status: MeasurementUnitStatus.ACTIVE,
            });

            return manager.save(unit);
        });

        return result;
    }

    static async update(id: number, companyId: number, input: IMeasurementUnitInput) {
        const unit = await MeasurementUnitRepository.findById(id, companyId);

        if (!unit) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        const existing = await MeasurementUnitRepository.findByAbbreviation(input.abbreviation, companyId);

        if (existing && existing.id !== id) {
            throw { status: 400, messageCode: messageCodes.measurementUnits.errors.ABBREVIATION_ALREADY_EXISTS };
        }

        await AppDataSource.transaction(async (manager) => {
            unit.abbreviation = input.abbreviation;
            unit.description = input.description;
            await manager.save(unit);
        });

        return unit;
    }

    static async toggleStatus(id: number, companyId: number) {
        const unit = await MeasurementUnitRepository.findById(id, companyId);

        if (!unit) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        await AppDataSource.transaction(async (manager) => {
            unit.status =
                unit.status === MeasurementUnitStatus.ACTIVE
                    ? MeasurementUnitStatus.INACTIVE
                    : MeasurementUnitStatus.ACTIVE;
            await manager.save(unit);
        });

        return unit;
    }
}

