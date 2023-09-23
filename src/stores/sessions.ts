import {defineStore} from 'pinia';
import {v4 as uuid} from 'uuid';
import {Session} from "@/interfaces/Session";
import dayjs from "dayjs";

export const useSessionsStore = defineStore('sessions', {
    state: (): { sessions: Session[] } => ({
        sessions: [] as Session[],
    }),
    getters: {
        allSessions: (state) => state.sessions.sort((a: Session, b: Session) => a.start !== null ? dayjs(a.start).isBefore(dayjs(b.start)) ? 1 : 0 : -1) as Session[],
        hasSessions: (state) => state.sessions.length > 0 as boolean,
    },
    actions: {
        create(session: Session): void {
            this.sessions.push({
                ...session,
                id: uuid(),
            } as Session);
        },
        async delete(sessionId: string | null): Promise<void> {
            const index = this.sessions.findIndex(({id}) => sessionId === id);

            if (index !== -1) {
                this.sessions.splice(index, 1);
            }
        },
        deleteAll(): void {
            this.sessions = [];
        },
    },
    persist: {storage: localStorage},
});