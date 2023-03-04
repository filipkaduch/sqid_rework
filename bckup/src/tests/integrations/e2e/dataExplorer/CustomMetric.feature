Feature: Custom Metric
Scenario: Create custom metric
Given Data Explorer with dataset or catalog item is loaded
When User selects to add a custom metric AND enters a valid metric expression
Then A custom metric is created AND displayed in the chart

Scenario: Delete custom metric used in visualisation
Given Data Explorer is loaded, visualisation is built that uses custom metric
When User removes the custom metric from the attribute list
Then Custom metric is removed from the attribute list and from the Metrics bucket and visualisation is re-rendered
