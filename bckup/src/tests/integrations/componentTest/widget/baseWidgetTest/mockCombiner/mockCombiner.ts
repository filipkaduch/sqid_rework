import datasetsMock from './datasetsMock.json';
import storyMock from './storyMock.json';
// @ts-ignore
import _ from 'lodash';

/*
	How to use mockCombiner in order to create a new snapshot test for widget?
		1. Design and choose your test on localhost
		2. Open network dev tool
		3. Copy the widget configuration response from PUT/POST
			 request to url://widgets/widget-id/data-configuration/data-config-id
			 and format it in something like (https://jsonformatter.curiousconcept.com/#)
			 then paste it to respective mock.json widget configs test object
		4. Copy the widget data response from POST request to url://queries/fetch-data and format it in
			 something like (https://jsonformatter.curiousconcept.com/#) then paste it
			 to respective dataMock.json widget data test object
		*. If you are using a dataset which is not present in mockCombiner/datasetsMock.json, copy the dataset
			 response from url://stories/story-id, format it in something
			 like (https://jsonformatter.curiousconcept.com/#) and paste it into datasetsMock.json
			 dataMocks/suggestionConst.ts as a new key and add the dataset key name in order to use it
		5. Open chart.spec.ts where you would like to create new test
		6. Create new key in mock object for the newly designed test
		7. To see the output run: npx playwright test --headed (you need to have localhost launched in order to run tests)
		8. If there is a chromium package missing in your project run: npx playwright install
		*. If you are using windows go with WSL 2 to launch playwright
 */


export const createMock = (dataset: any, widget: any, data: any = [], story: any = 'storyConfig'): any => {
	const newMock = {};
	// @ts-ignore
	newMock.data = data;
	// @ts-ignore
	newMock.story = storyMock[story];
	// @ts-ignore
	newMock.story.datasets = [];
	// @ts-ignore
	newMock.story.datasets.push(datasetsMock[dataset]);
	// @ts-ignore
	newMock.story.sections[0].widgets = [];
	// @ts-ignore
	newMock.story.sections[0].widgets.push(widget);
	return _.cloneDeep(newMock);
};
