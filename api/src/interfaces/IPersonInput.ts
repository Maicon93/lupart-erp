import { IAddressFields } from './IAddressFields';

export interface IPersonInput extends IAddressFields {
    name: string;
    cpfCnpj: string;
    phone: string;
    email?: string;
    notes?: string;
}
