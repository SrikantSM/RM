/**
 * Abstract base class for complex api call implmentation
 */
export abstract class AbstractBaseService {
    // setup is called as a preparation step
    abstract setup(): void;
    // actual code which is called for every entry of payload csv
    abstract runAPIs(payload: Object): Promise<void>;
}