import { exists as existsAsync, readFile as readFileAsync } from 'fs';
import { promisify } from 'util';
import { IEnvironment } from 'test-commons';

const exists = promisify(existsAsync);
const readFile = promisify(readFileAsync);

const LANDSCAPE = 'DATA_LOAD_LANDSCAPE';
const SPACE_GUID = 'DATA_LOAD_SPACE_GUID';
const APP_NAME = 'DATA_LOAD_APP_NAME';
const CF_USER = 'DATA_LOAD_CF_USER';
const CF_PASSWORD = 'DATA_LOAD_CF_PASSWORD';
const TENANT_ID = 'DATA_LOAD_TENANT_ID';

export class Environment implements IEnvironment {
    private environmentVariables!: Map<string, string | undefined>;

    private constructor(private readonly defaultEnvFileName: string) {}

    public static async createInstance(defaultEnvFileName: string): Promise<Environment> {
        const environment = new Environment(defaultEnvFileName);
        environment.environmentVariables = new Map(Object.entries(process.env));

        if (await exists(environment.defaultEnvFileName)) {
            const defaultEnv = JSON.parse(await readFile(environment.defaultEnvFileName, 'utf-8'));

            for (const [key, value] of Object.entries(defaultEnv)) {
                if (!environment.environmentVariables.has(key)) {
                    environment.environmentVariables.set(key, value as string);
                }
            }
        }

        return environment;
    }

    public get landscape(): string {
        return this.environmentVariables.get(LANDSCAPE) || '';
    }

    public get spaceGuid(): string {
        return this.environmentVariables.get(SPACE_GUID) || '';
    }

    public get srvAppName(): string {
        return this.environmentVariables.get(APP_NAME) || '';
    }

    public get cfUser(): string {
        return this.environmentVariables.get(CF_USER) || '';
    }

    public get cfPassword(): string {
        return this.environmentVariables.get(CF_PASSWORD) || '';
    }

    public get tenantId(): string {
        return this.environmentVariables.get(TENANT_ID) || '';
    }
}
