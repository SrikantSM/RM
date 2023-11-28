const { performance } = require('perf_hooks');
export function measureAsync(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
	const originalMethod = descriptor.value;

	descriptor.value = function (...args: any) {
		const start = performance.now();
		const result = originalMethod.apply(this, args);
		function endMeasurement() {
			const end = performance.now();
			console.log(`TimeTracker: Call to ${propertyKey} took ${(end - start).toFixed(2)} milliseconds.`);
		}
		result.then(endMeasurement, endMeasurement);
		return result;
	};
	return descriptor;
}

export const measureAsyncWrap = <T extends Array<any>, U>(fn: (...args: T) => Promise<U>) => {
	return (...args: T): Promise<U> => {
		const start = performance.now();
		const result = fn(...args);
		function endMeasurement() {
			const end = performance.now();
			console.log(`TimeTracker: Call to ${fn.name} took ${(end - start).toFixed(2)} milliseconds.`);
		}
		result.then(endMeasurement, endMeasurement);
		return result;
	}
}
