export interface exploreList {
	[explorationId: string]: {
		name: string,
		datasetExplores: {
			[datasetId: string]: {datasetName: string}
		}
	}
}

