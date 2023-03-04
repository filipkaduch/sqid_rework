Feature: Explorer filters
	Scenario: Filter existing visualisation
		Given Data Explorer with dataset or catalog item is loaded and a visualisation is built
		When User opens filter and defines a valid filter condition
		Then Visualisation and the Metrics/Dimensions columns are filtered according the defined filter conditions
