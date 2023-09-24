export interface Session {
  id: string | null;
  timestamp: number;
  registration: string;
  start: number | null;
  taxi: number | null;
  takeoff: number | null;
  land: number | null;
  shutoff: number | null;
}
