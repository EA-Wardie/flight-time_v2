export interface Session {
  id: string | null;
  timestamp: number;
  registration: string;
  start: string | null;
  taxi: string | null;
  takeoff: string | null;
  land: string | null;
  shutoff: string | null;
}
