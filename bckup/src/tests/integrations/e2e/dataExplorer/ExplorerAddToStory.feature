Feature: Add Exploration to story
Scenario: Adding existing exploration to an existing story
Given Data Explorer with dataset or catalog item is loaded and a visualisation is built
When The user selects to add the exploration to a story and selects an existing story
Then The exploration is added as a new section to the end of the selected story, the visualisation configuration is preserved

Scenario: Adding existing exploration to a new story
Given Data Explorer with dataset or catalog item is loaded and a visualisation is built
When The user selects to add the exploration to a new story and enters story name
Then A new story is created and exploration is added to the second section (after the section with title), the visualisation configuration is preserved
