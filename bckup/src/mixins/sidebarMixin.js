import {mapActions} from 'vuex';

export default {
	data() {
		return {
			sidebarClosingTimeout: null,
			showSidebar: false
		};
	},
	methods: {
		...mapActions('widgetInstances', ['selectWidgetInstance']),
		closeSidebar() {
			this.sidebarClosingTimeout = setTimeout(() => {
				this.sidebarClosingTimeout = null;
				this.showSidebar = false;
			}, 500);
		},
		onClickOutside() {
			if (this.showSidebar && this.sidebarClosingTimeout === null) {
				this.closeSidebar();
			}
		},
		navClick(step = null) {
			if (step) {
				this.selectWidgetInstance(step);
			}
			if (this.showSidebar && this.sidebarClosingTimeout === null) {
				this.closeSidebar();
			} else {
				this.showSidebar = true;
				if (this.sidebarClosingTimeout !== null) {
					clearTimeout(this.sidebarClosingTimeout);
					this.sidebarClosingTimeout = null;
				}
			}
		}
	}
};
