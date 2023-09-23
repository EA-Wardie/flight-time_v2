export interface Session {
    id: number | null,
    registration: string,
    start: string | null,
    taxi: string | null,
    takeoff: string | null,
    land: string | null,
    shutoff: string | null,
}