Feature: Creating a visualisation
Scenario: Render a visualisation
Given Data Explorer with dataset or catalog item is loaded
When User drags a metric to the metric bucket and attribute to the dimensions bucket
Then A bar chart is rendered

Scenario:Successful search in the list of attributes
Given Data Explorer with dataset or catalog item is loaded
When User tries to search for an attribute and there is no attribute that matches search criteria
Then A message is shown in the attribute list informing the user there were not matching results

Scenario: Unsuccessful search in the list of attributes
Given Data Explorer with dataset or catalog item is loaded
When User enters text in the attribute search box and there is no attribute that matches the search criteria
Then The attribute list is filtered and only the attributes matching the criteria are displayed

Scenario: Change number of values to show
Given  Data Explorer with dataset or catalog item is loaded and a visualisation is built
When User changes the value in the Number of values to show
Then Visualisation is re-rendered and the number of visible datapoints is displayed according the setting

Scenario: Changing the metric aggregation
Given  Data Explorer with dataset or catalog item loaded and there is a metric or attribute in the Metric bucket
When User opens the aggregation menu and selects one of the possible aggregation options
Then Visualisation is re-rendered and the metric or attribute is displayed with the selected aggregation

Scenario: Changing the visualisation type
Given There is an existing visualisation built with one or more metrics and one or more attributes
When User opens the Visualisation type menu and selects one of the supported types
Then Visualisation is re-rendered and displayed as the selected visualisation

Scenario: Set sorting
Given  There is an existing visualisation built with one or more metrics and one or more attributes
When User clicks on the sorting icon on a metric or dimension in the Metrics/Dimensions column
Then Visualisation and the Metrics/Dimensions columns are ordered according the selected metric/attribute

Scenario: Renaming the metric
Given  There is an existing visualisation built with one or more metrics and one or more attributes
When User double clicks on the metric title and enters some text
Then Metric name changes both in the Metrics column and in the legend in the visualisation, the Attribute list displays the original name, original metric name is displayed in the Metrics column on hoover

Scenario: Changing the metric color
Given There is one or more metrics in the Metric bucket in Data Explorer
When User clicks on the color icon next to the metric and enters some text
Then Metric name changes both in the bucket and in the legend in the visualisation

Scenario: Renaming the attribute value
Given There is an existing visualisation built with one or more metrics and one or more attributes
When User double clicks on the attribute value title and enters some text
Then Attribute value title changes both in the Dimensions column, in the legend or in the axis label visualisation, original attribute value title is displayed in the Dimensions column on hoover

Scenario:Changing the attribute value color
Given There is an existing visualisation built with one or more metrics and one or more attributes
When User hoovers on the row with attribute value, opens the … menu, selects the change color option and selects a specific color
Then Attribute value color is displayed in the Dimensions column, the selected color for the attribute value is displayed in the visualisation and in the legend

Scenario: Configuring Bucketing
Given There is an existing visualisation built with one or more metrics and one date attribute
When User opens the Bucketing option on the date attribute and selects from the available granularities
Then Chart and the dimension column it is adjusted according the selected bucketing granularity and rerendered

Scenario: Configuring Extracting
Given There is an existing visualisation built with one or more metrics and one date attribute
When User opens the Extracting option on the date attribute and selects from the available granularities
Then Chart and the dimension column it is adjusted according the selected extracting granularity and rerendered

Scenario: Top N values
Given There is an existing visualisation built with one or more metrics and two attributes
When User opens the Top N option on the second attribute and configures the conditions
Then Chart and the dimension column it is adjusted and filtered according the selected condition
