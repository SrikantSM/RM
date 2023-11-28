const uuidTest = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;

/**
 * Create a predictable UUID
 * @param template Should be a valid UUID, i.e. 'a30a16ff-4d3f-40e8-9a12-c1eada70000'. The last few digits must be zeros and will be replaced with the instance iteration number.
 * @param iteration Instance iteration number. An error is thrown if not enough zeros are provided at the end of the template to fit the given instance iteration number.
 */
export function predictableUuid(template: string, iteration: number): string {
    const iterationString = '' + iteration;
    if (!template.match(uuidTest)) {
        throw new Error('Invalid template: Not a valid UUID');
    }
    if (!template.endsWith('0'.repeat(iterationString.length))) {
        throw new Error('Invalid template: Not enough zeros provided at the end to allow an instance iteration number of ' + iteration);
    }
    return template.slice(0, -iterationString.length) + iterationString;
}
