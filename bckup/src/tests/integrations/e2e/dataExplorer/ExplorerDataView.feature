Feature: Data view
Scenario: Filter data in data view
Given User is on the Data view and has an existing dataset or catalog item loaded
When User applies a valid filter conditions
Then The table displayed in the data view is filtered according the filter conditions

Scenario: Reset filter in data view
Given User is on the Data view and has an existing dataset or catalog item loaded and a filter applied
When User removes the applied filters
Then The table displayed in the data view displays unfiltered results
