import { existsSync, readFileSync } from 'fs';
import { IEnvironment } from 'test-commons';

const LANDSCAPE = 'ENV_LANDSCAPE';
const SPACE_GUID = 'ENV_SPACE_GUID';
const CF_USER = 'ENV_CF_USER';
const CF_PASSWORD = 'ENV_CF_PASSWORD';
const APP_NAME = 'ENV_SRV_APP_NAME';

export class Environment implements IEnvironment {
    private environmentVariables!: Map<string, string | undefined>;

    private constructor(private readonly defaultEnvFileName: string) {}

    public static createInstance(defaultEnvFileName: string): Environment {
        const environment = new Environment(defaultEnvFileName);
        environment.environmentVariables = new Map(Object.entries(process.env));

        if (existsSync(environment.defaultEnvFileName)) {
            const defaultEnv = JSON.parse(readFileSync(environment.defaultEnvFileName, 'utf-8'));

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
}
