import {defineStore} from 'pinia';
export interface AppLoadingState {
    loading: boolean
}
export const useLoadingStore = defineStore('appLoading', {
    state: (): AppLoadingState => ({
        loading: false
    }),
    getters: {
        isLoading: (state: any): boolean => state.loading ?? false
    },
    actions: {
        setState(loadingState: boolean) {
            this.loading = loadingState;
        }
    }
});
