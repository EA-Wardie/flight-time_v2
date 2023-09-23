import {defineStore} from 'pinia';
import {v4 as uuid} from 'uuid';
import {Session} from "@/interfaces/Session";
import dayjs from "dayjs";

export const useSessionsStore = defineStore('sessions', {
    state: (): { sessions: Session[] } => ({
        sessions: [] as Session[],
    }),
    getters: {
        allSessions: (state) => state.sessions as Session[],
        hasSessions: (state) => state.sessions.length > 0 as boolean,
    },
    actions: {
        create(session: Session): void {
            this.sessions.push({
                ...session,
                id: uuid(),
                created_at: dayjs(Date.now()).format('DD-MM-YYYY HH:mm:ss'),
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