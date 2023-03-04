import {defineStore} from 'pinia';
export interface ErrorState {
    error: any
}
export const useErrorStore = defineStore('error', {
    state: (): ErrorState => ({
        error: null
    }),
    getters: {
        error: (state: any): ErrorState | null => state.error ?? null
    },
    actions: {
        setError(error: ErrorState) {
            this.error = error;
        },
        removeError() {
            this.error = null;
        }
    }
});
