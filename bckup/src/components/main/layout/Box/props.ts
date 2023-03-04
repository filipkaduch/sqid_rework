import {PropType} from 'vue';
import {Align, AlignY, FlexType, PositiveSpaceUnit, Borders, BorderRadii, BoxShadows} from '@/components/main/layout/utils/types';

export const componentProps = {
	flexType: {
		type: String as PropType<FlexType>
	},
	noGrow: {
		type: Boolean
	},
	padding: {
		type: String as PropType<PositiveSpaceUnit>
	},
	paddingX: {
		type: String as PropType<PositiveSpaceUnit>
	},
	paddingY: {
		type: String as PropType<PositiveSpaceUnit>
	},
	paddingRight: {
		type: String as PropType<PositiveSpaceUnit>
	},
	paddingLeft: {
		type: String as PropType<PositiveSpaceUnit>
	},
	paddingTop: {
		type: String as PropType<PositiveSpaceUnit>
	},
	paddingBottom: {
		type: String as PropType<PositiveSpaceUnit>
	},
	border: {
		type: String as PropType<Borders>
	},
	borderLeft: {
		type: String as PropType<Borders>
	},
	borderRight: {
		type: String as PropType<Borders>
	},
	borderTop: {
		type: String as PropType<Borders>
	},
	borderBottom: {
		type: String as PropType<Borders>
	},
	borderRadius: {
		type: String as PropType<BorderRadii>
	},
	// X-axis alignment of the whole element inside flexbox or grid
	alignSelf: {
		type: String as PropType<Align>
	},
	// Y-axis alignment of the whole element inside flexbox or grid
	alignYSelf: {
		type: String as PropType<AlignY>
	},
	// X-axis alignment inside the Box
	align: {
		type: String as PropType<Align>
	},
	// Y-axis alignment inside the Box
	alignY: {
		type: String as PropType<AlignY>
	},
	boxShadow: {
		type: String as PropType<BoxShadows>
	}
};
