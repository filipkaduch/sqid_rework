<template>
	<span class="d-flex align-items-center justify-content-center" :class="dataType !== null ? '' : 'filterLabel'">
		<div v-if="single === false" class="d-flex my-xxl-0 my-1 align-items-center" :class="dataType !== null ? 'filterLabel' : ''">
			<span :class="dataType !== null ? 'd-flex align-items-center' : ''">
				<app-value-resizer :value="isObject(filter[0]) ? filter[0]?.displayName ?? filter[0].name : filter[0]" :dropDirection="dropDirection" />
				<app-datatype-badge v-if="dataType !== null" :datatype="dataType" :show-datatype-text="false" :filter-variant="true" />
			</span>
			<div v-if="filter.length > 1" class="position-relative hovering">
				<span
					v-if="filter.length > 1"
					:class="dataType === null ? 'ml-1' : ''"
					@mouseover="isHoverCols = true"
					@mouseout="isHoverCols = false">
					<div class="d-flex align-items-center justify-content-center hoverCircle">
						{{ filter.length - 1 }}
					</div>
				</span>
				<div
					v-if="isHoverCols"
					class="mx-1 position-absolute filterLabel"
					:style="dropDirection === 'bottom' ? '' : 'top: -25px;'"
					style="right: -35px; z-index: 2500 !important;">
					<div v-for="(colu, ind) in filter.slice(1, filter.length)" :key="ind">
						{{ typeof colu.name === 'undefined' ? colu : colu.name }}
					</div>
				</div>
			</div>
		</div>
		<div v-else class="d-flex align-items-center">
			{{ filter }}
			<app-datatype-badge
				v-if="dataType"
				:datatype="dataType"
				:filter-variant="true"
				:show-datatype-text="false" />
		</div>
		<div
			class="ml-1 my-xxl-0 my-1 d-flex align-items-center filterLabel">
			<span class="mr-1">
				{{ logic === logicConstants.NOT_LIKE ? 'NOT LIKE' : logic }}
			</span>
			<template v-if="Array.isArray(value)">
				<span class="mx-1">
					{{ value[0] }}
				</span>
				<div v-if="value.length > 1" class="position-relative hovering">
					<span
						class="mx-1 d-flex"
						@mouseover="isHover = true"
						@mouseout="isHover = false">
						<span class="d-flex align-items-center justify-content-center hoverCircle">
							{{ value.length - 1 }}
						</span>
					</span>
					<div
						v-if="isHover"
						class="mx-1 position-absolute filterLabel"
						:style="dropDirection === 'bottom' ? '' : 'top: -25px;'"
						style="z-index: 2500 !important;">
						<div v-for="(val, ind) in value" :key="val"><p v-if="ind !== 0" class="mb-1">
							{{ val }}</p></div>
					</div>
				</div>
			</template>
			<template v-else>
				<div v-if="logic === logicConstants.LAST || logic === logicConstants.NOT_IN_LAST">
					{{ `${filterMap.find((el) => el.index === index).value} ${filterMap.find((el) => el.index === index).unit}` }}
				</div>
				<div v-else>
					<app-value-resizer
						v-if="!(value === null && (logic === logicConstants.IS_EMPTY || logic === logicConstants.IS_NOT_EMPTY))"
						:value="value ?? 'null'" />
				</div>
			</template></div>
	</span>
</template>

<script>
import AppDatatypeBadge from '@/components/design/AppDatatypeBadge.vue';
import AppValueResizer from '@/components/design/AppValueResizer.vue';
import {logicConstants} from '@/util/consts/logicConstants';

export default {
	name: 'AppHoverInfo',
	components: {
		AppDatatypeBadge,
		AppValueResizer
	},
	props: {
		filter: {
			type: [
				Array,
				String,
				null
			],
			required: true
		},
		value: {
			type: [
				Array,
				String
			],
			default: null
		},
		logic: {
			type: String,
			default: null
		},
		dataType: {
			type: String,
			default: null
		},
		index: {
			type: Number,
			default: 0
		},
		filterMap: {
			type: Array,
			default: null
		},
		single: {
			type: Boolean,
			default: false
		},
		dropDirection: {
			type: String,
			default: 'bottom'
		}
	},
	data() {
		return {
			isHoverCols: false,
			isHover: false,
			logicConstants
		};
	},
	methods: {
		isObject(value) {
			return typeof value === 'object';
		}
	}
};
</script>
