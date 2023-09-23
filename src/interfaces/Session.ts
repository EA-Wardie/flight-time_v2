import {Dayjs} from "dayjs";

export interface Session {
    id: string | null,
    registration: string,
    start: Dayjs | null,
    taxi: Dayjs | null,
    takeoff: Dayjs | null,
    land: Dayjs | null,
    shutoff: Dayjs | null,
}