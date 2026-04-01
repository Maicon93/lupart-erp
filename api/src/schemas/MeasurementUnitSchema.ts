import { z } from 'zod';

export const createMeasurementUnitSchema = z.object({
    abbreviation: z.string().trim().min(1).max(10),
    description: z.string().trim().min(1).max(255),
});

export const updateMeasurementUnitSchema = createMeasurementUnitSchema;
