Feature: Operations with tabs
Scenario: Adding a new tab to exploration
Given The Data Explorer is opened and there is a single tab loaded
When User adds a new tab and selects a catalog item or dataset
Then  User is able to select a dataset or catalog item which adds   changes both in the bucket and in the legend in the visualisation

Scenario: Removing existing tab
Given The Data Explorer is opened and there is a single tab loaded
When User selects to remove tab
Then  User is able to select a dataset or catalog item which adds   changes both in the bucket and in the legend in the visualisation

Scenario: Renaming existing tab
Given The Data Explorer is opened and there is a single tab loaded
When User opens a tab renames the tab
Then  Tab is correctly renamed
