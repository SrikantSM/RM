export class CountryConfig {
    private code!: string; //
    private workingMinutesPerWeek!: number;
    private holidays!: Date[];

    constructor(code: string, workingMinutesPerWeek: number, holidays: Date[]) {
        this.code = code;
        this.workingMinutesPerWeek = workingMinutesPerWeek;
        this.holidays = holidays;
    }

    public getCode(): string {
        return this.code;
    }

    public getWorkingMinutesPerWeek(): number {
        return this.workingMinutesPerWeek;
    }

    public getHolidays(): Date[] {
        return this.holidays;
    }

}
