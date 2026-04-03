import SystemConfigurationRepository from '../repositories/SystemConfigurationRepository';
import messageCodes from '../i18n/MessageCodes';

interface IConfigurationMap {
    [key: string]: string;
}

export default class SystemConfigurationService {
    static async findAll(): Promise<IConfigurationMap> {
        const configurations = await SystemConfigurationRepository.findAll();
        const configurationMap: IConfigurationMap = {};

        for (const configuration of configurations) {
            configurationMap[configuration.key] = configuration.value;
        }

        return configurationMap;
    }

    static async updateSection(configurations: IConfigurationMap): Promise<void> {
        for (const [key, value] of Object.entries(configurations)) {
            const existing = await SystemConfigurationRepository.findByKey(key);

            if (!existing) {
                throw { status: 404, messageCode: messageCodes.systemParameters.errors.KEY_NOT_FOUND };
            }

            await SystemConfigurationRepository.updateByKey(key, String(value));
        }
    }
}

