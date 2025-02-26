Feature: Search Functionality on BBC Sport

  Scenario: Retrieve Search Results
    Title: As an editor, I want to ensure that whenever someone searches for "Sport in 2023," at least 4 relevant results are returned, so that users can access diverse and informative content.
    As an editor
    I want the search functionality to return at least 4 relevant results whenever someone searches for "Sport in 2023"
    So that users have a wide range of articles, reports, and media to explore on the topic.

    Given I am on the BBC Sport search page
    When I search for "Sport in 2023"
    Then I should see at least 4 search results
    Then the search results should be relevant to the "Sport in 2023" search term