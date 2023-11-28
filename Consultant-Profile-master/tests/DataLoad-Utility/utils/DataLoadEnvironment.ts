import { TestEnvironment } from 'test-commons';
import { Environment } from './Environment';

export class ApiIntegrationTestEnvironment extends TestEnvironment<Environment> {
    private environmentInstance: Environment | null = null;

    constructor() {
        super(null);
    }

    public async getEnvironment(): Promise<Environment> {
        if (!this.environmentInstance) {
            try {
                console.log('Reading Environment');
                this.environmentInstance = await Environment.createInstance('default-env.json');
            } catch (err) {
                console.error('Environment could not be read', err);
                process.exit(1);
            }
        }
        return this.environmentInstance;
    }
}
