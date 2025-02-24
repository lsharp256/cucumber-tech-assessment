Feature: Validation In A Table Of Results
    As a user
    I want to be able to see the top 3 finishers of the 2023 Las Vegas Grand Prix

    Scenario: Report the top 3 finishers of the 2023 Las Vegas Grand Prix
        Given I am on the BBC Sport page
        When I navigate to the results table
        Then I should see "Max Verstappen" in the results
        And I should see "Charles Leclerc" in the results
        And I should see "Sergio Perez" in the results