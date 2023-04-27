import {defineStore} from 'pinia';
export interface ErrorState {
    error: string | null
}
export const useErrorStore = defineStore('error', {
    state: (): ErrorState => ({
        error: null
    }),
    getters: {
        getError: (state: ErrorState): string | null => state.error ?? null
    },
    actions: {
        setError(error: string) {
            this.error = error;
        },
        removeError() {
            this.error = null;
        }
    }
});
