Feature: Create exploration
	Scenario: Create exploration from a single dataset
		Given There is an existing dataset available with name "100000 Sales Records"
		When User select dataset "100000 Sales Records"
			And User click button create new exploration
		Then Data Explorer is opened and the appropriate datasets is loaded

	Scenario: Create exploration from a single catalog item
		Given There is an existing catalog items available
		When User choses to create new exploration
		Then Data Explorer is opened and the appropriate catalog item is loaded

	Scenario: Create exploration from combination of datasets and catalog items
		Given There are more existing catalog items or datasets available
		When User chooses to create new exploration and select one or more datasets and one or more catalogs items
		Then Data Explorer is opened and the appropriate datasets and catalog items are loaded in separate tabs
