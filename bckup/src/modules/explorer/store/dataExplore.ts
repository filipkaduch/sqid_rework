import {defineStore} from 'pinia';
import {createDatasetsObjects} from '@/modules/explorer/utils/explorerUtils';
import cloneDeep from 'lodash/cloneDeep';
import {Formatting} from '@/modules/widget/components/widget-controls/consts/formatTypes';

export enum actionType {
	ADD = 'add',
	REMOVE = 'remove',
	UPDATE = 'update'
}

export interface DatasetExploration {
	datasetId: string | null;
	catalogItemId: string | null,
	name: string;
	attributes: Attributes
}

export interface ExplorationSection extends DatasetExploration {
	dataExplorationId: string
}

export interface Attributes {
	filteredByType?: string | null;
	list?: Attribute[]
}

export interface Attribute {
	name: string;
	displayName: string;
	favorite?: boolean;
	selected: string | null;
	type: string;
	uniqueValuesCount?: number;
	aggregations?: string[];
	aggregation?: string;
	function?: string;
	bucketsDatetime?: string;
	numberOfBuckets?: number;
	id?: number;
	customExpressionEnabled: boolean;
	customExpression?: string;
	customColumnName: string;
	data?: any;
	orderBy?: any,
	index: number;
	topValues?: any;
	selectedFormat?: Formatting
}

export interface ExplorationGroup {
	name: string;
	datasetExplores: {
		[datasetExploreId: string]: DatasetExploration;
	};
}

export interface Explore {
	selectedDatasetExplorationId: string;
	selectedExplorationGroupId: string;
	// TODO maybe we don't need to save List of group, only working group
	explorationGroups: { [explorationId: string]: ExplorationGroup };
	draggedAttribute: DraggedAttribute | null,
	isChangingWidget: boolean,
	usedAttributes: Attribute[] | null;
}

export interface DraggedAttribute {
	name: string,
	type: string
}
export const useDataExploreStore = defineStore('dataExplore', {
	state: (): Explore => ({
		selectedDatasetExplorationId: '',
		selectedExplorationGroupId: '',
		explorationGroups: {},
		draggedAttribute: null,
		isChangingWidget: false,
		usedAttributes: null
	}),
	getters: {
		selectedExploration: (state: any): ExplorationGroup | null => state.explorationGroups[state.selectedExplorationGroupId] ?? null,
		selectedDataExploration(): DatasetExploration | null {
			return this.explorationGroups[this.selectedExplorationGroupId]?.datasetExplores[this.selectedDatasetExplorationId]
				?? null;
		},
		getAttributes: (state: any): Attributes => {
			if (!state.selectedExplorationGroupId || !state.selectedDatasetExplorationId) {
				return {};
			}
			return state.explorationGroups[state.selectedExplorationGroupId]
				.datasetExplores[state.selectedDatasetExplorationId].attributes;
		},
		getDraggedAttribute: (state): DraggedAttribute | null => state.draggedAttribute,
		getUsedAttributes: (state) => state.usedAttributes
	},
	actions: {
		addAttributeList(attributeList: Attribute[]) {
			this.explorationGroups[this.selectedExplorationGroupId].datasetExplores[this.selectedDatasetExplorationId].attributes.list = attributeList;
		},
		copyAttributeList(sourceId: string, destinationId:string) {
			const attrs = cloneDeep(this.explorationGroups[this.selectedExplorationGroupId].datasetExplores[sourceId].attributes);
			this.explorationGroups[this.selectedExplorationGroupId].datasetExplores[destinationId].attributes = attrs;
		},
		addDataExplore(dataExploration: ExplorationSection) {
			const dataExplorations = this.explorationGroups[this.selectedExplorationGroupId].datasetExplores;
			this.explorationGroups[this.selectedExplorationGroupId].datasetExplores = {
				...dataExplorations,
				...createDatasetsObjects([dataExploration])
			};
		},
		renameDataExploration(dataExplorationId: string, name: string) {
			this.explorationGroups[this.selectedExplorationGroupId].datasetExplores[dataExplorationId].name = name;
		},
		removeDataExplore(exploreId: string) {
			delete this.explorationGroups[this.selectedExplorationGroupId].datasetExplores[exploreId];
		},
		createExplorationList(name: string, exploreGroupId: string, selectedDatasets: ExplorationSection[]) {
			this.selectedDatasetExplorationId = '';
			this.selectedExplorationGroupId = '';
			this.explorationGroups = {};
			this.explorationGroups[exploreGroupId] = {
				name,
				datasetExplores: createDatasetsObjects(selectedDatasets)
			};
			// TODO temporary will be selected from create or list
			this.selectedExplorationGroupId = exploreGroupId;
			[this.selectedDatasetExplorationId]
				= Object.keys(this.explorationGroups[this.selectedExplorationGroupId].datasetExplores);
		},
		setDraggedAttribute(attribute: DraggedAttribute) {
			this.draggedAttribute = attribute;
		},
		removeDraggedAttribute() {
			this.draggedAttribute = null;
		},
		setUsedAttributes(usedAttributes: Attribute[]) {
			this.usedAttributes = usedAttributes;
		}
	}
});
