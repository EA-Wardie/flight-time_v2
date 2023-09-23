export interface Session {
    id: string | null,
    registration: string,
    start: string | null,
    taxi: string | null,
    takeoff: string | null,
    land: string | null,
    shutoff: string | null,
    created_at: string | null,
}