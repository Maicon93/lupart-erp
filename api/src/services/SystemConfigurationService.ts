import SystemConfigurationRepository from '../repositories/SystemConfigurationRepository';
import messageCodes from '../i18n/MessageCodes';

interface IConfigurationMap {
    [key: string]: string;
}

export default class SystemConfigurationService {
    private systemConfigurationRepository = new SystemConfigurationRepository();

    async findAll(): Promise<IConfigurationMap> {
        const configurations = await this.systemConfigurationRepository.findAll();
        const configurationMap: IConfigurationMap = {};

        for (const configuration of configurations) {
            configurationMap[configuration.key] = configuration.value;
        }

        return configurationMap;
    }

    async updateSection(configurations: IConfigurationMap): Promise<void> {
        for (const [key, value] of Object.entries(configurations)) {
            const existing = await this.systemConfigurationRepository.findByKey(key);

            if (!existing) {
                throw { status: 404, messageCode: messageCodes.systemParameters.errors.KEY_NOT_FOUND };
            }

            await this.systemConfigurationRepository.updateByKey(key, String(value));
        }
    }
}

