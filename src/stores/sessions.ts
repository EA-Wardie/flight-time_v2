import {defineStore} from 'pinia';
import {Session} from "@/interfaces/Session";

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
                id: Date.now(),
            } as Session);
        },
        async delete(sessionId: number | null): Promise<void> {
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