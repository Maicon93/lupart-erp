import { EntityManager } from 'typeorm';
import { CompanySetting } from '../models/CompanySetting';
import { PaymentType } from '../models/PaymentType';
import { MeasurementUnit } from '../models/MeasurementUnit';
import { Category } from '../models/Category';
import { Customer } from '../models/Customer';

const seedCompanyData = async (manager: EntityManager, companyId: number): Promise<void> => {
    const companySetting = manager.create(CompanySetting, {
        companyId,
        allowNegativeStock: false,
    });
    await manager.save(companySetting);

    const paymentTypeNames = ['Dinheiro', 'PIX', 'Cartão de Débito', 'Cartão de Crédito', 'Boleto'];
    const paymentTypes = paymentTypeNames.map((name) => manager.create(PaymentType, { companyId, name }));
    await manager.save(paymentTypes);

    const measurementUnitsData = [
        { abbreviation: 'Kg', description: 'Quilo' },
        { abbreviation: 'Un', description: 'Unidade' },
        { abbreviation: 'L', description: 'Litro' },
        { abbreviation: 'Serviço', description: 'Serviço' },
    ];
    const measurementUnits = measurementUnitsData.map((unit) =>
        manager.create(MeasurementUnit, { companyId, abbreviation: unit.abbreviation, description: unit.description })
    );
    await manager.save(measurementUnits);

    const category = manager.create(Category, {
        companyId,
        name: 'Outros',
        observation: 'Categoria para produtos diversos ainda sem classificação',
    });
    await manager.save(category);

    const customer = manager.create(Customer, {
        companyId,
        name: 'Consumidor Final',
        cpfCnpj: '000.000.000-00',
        phone: '(99) 99999-9999',
        notes: 'Cliente padrão',
    });
    await manager.save(customer);
};

export default seedCompanyData;
