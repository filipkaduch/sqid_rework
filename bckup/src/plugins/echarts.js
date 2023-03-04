import * as echarts from 'echarts';

import {
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	VisualMapComponent,
	GridComponent,
	DataZoomComponent,
	TimelineComponent,
	LegendScrollComponent,
	MarkPointComponent,
	CalendarComponent
} from 'echarts/components';
import {BarChart, ScatterChart, HeatmapChart, LineChart, PieChart, RadarChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
	BarChart,
	ScatterChart,
	HeatmapChart,
	LineChart,
	PieChart,
	RadarChart,
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	VisualMapComponent,
	GridComponent,
	DataZoomComponent,
	TimelineComponent,
	LegendScrollComponent,
	MarkPointComponent,
	CalendarComponent,
	CanvasRenderer
]);
import ECharts from 'vue-echarts';
export default ECharts;
