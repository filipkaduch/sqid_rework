import {defineStore} from 'pinia';
export interface MobileState {
    mobile: boolean,
    screenWidth: number
}
export const useMobileStore = defineStore('mobile', {
    state: (): MobileState => ({
        mobile: false,
        screenWidth: 1201
    }),
    getters: {
        isMobile: (state: MobileState): boolean => state.mobile ?? false,
        getScreenSize: (state: MobileState): number => state.screenWidth
    },
    actions: {
        setState(mobile: boolean, width: number) {
            this.mobile = mobile;
            this.screenWidth = width;
        }
    }
});
