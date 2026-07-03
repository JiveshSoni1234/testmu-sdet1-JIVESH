# features/api.feature
# REST API Module BDD Scenarios
# Generated with AI assistance (Claude) using structured prompt engineering.
# Associated prompts are documented in prompts.md.

Feature: REST API Validation

  As a QA Engineer
  I want to validate the OrangeHRM REST APIs
  So that I can ensure the application's reliability, security, and data integrity

  # ------------------------------------------------------------------
  # Authentication Validation
  # ------------------------------------------------------------------

  Scenario: TC_API_001 - Valid credentials return a successful response
    Given the API base URL is "https://opensource-demo.orangehrmlive.com"
    When I send a POST request to "/web/index.php/api/v2/auth/login"
    And I provide username "Admin" and password "admin123"
    Then the response status should be 200 or 302

  Scenario: TC_API_002 - Employee List API requires authentication
    When I send a GET request to "/web/index.php/api/v2/pim/employees" without authentication
    Then the response status should be 401 or 403

  Scenario: TC_API_003 - Invalid authentication token is rejected
    When I send a GET request to "/web/index.php/api/v2/pim/employees"
    And I include the header Authorization "Bearer fake_invalid_token_12345"
    Then the response status should be 401 or 403

  Scenario: TC_API_004 - Application base URL is reachable
    When I send a GET request to the login page
    Then the response status should be 200

  Scenario: TC_API_005 - Response contains a valid Content-Type header
    When I send a GET request to the login page
    Then the response headers should contain "content-type"
    And the Content-Type should indicate HTML or JSON

  # ------------------------------------------------------------------
  # CRUD Operations
  # ------------------------------------------------------------------

  Scenario: TC_API_006 - Administrator creates a new job title
    Given I am authenticated as an administrator
    When I navigate to the Job Titles page
    And I create a unique job title
    Then a success notification should be displayed

  Scenario: TC_API_007 - Employee List displays available records
    Given I am authenticated as an administrator
    When I navigate to the Employee List page
    Then I should see the employee table
    And at least one employee record should be displayed

  Scenario: TC_API_008 - Employee profile can be accessed
    Given I am authenticated as an administrator
    When I open an employee profile
    Then I should be redirected to the Personal Details page

  Scenario: TC_API_009 - User Management contains existing records
    Given I am authenticated as an administrator
    When I navigate to the User Management page
    Then the user table should contain at least one record

  Scenario: TC_API_010 - Canceling a delete operation preserves the record
    Given I am authenticated as an administrator
    When I initiate deletion of a user record
    And I select "No, Cancel" in the confirmation dialog
    Then the total number of records should remain unchanged

  # ------------------------------------------------------------------
  # Error Handling
  # ------------------------------------------------------------------

  Scenario: TC_API_011 - Invalid page request does not return an internal server error
    When I send a GET request to a non-existent page
    Then the response status should not be 500

  Scenario: TC_API_012 - Invalid API endpoint returns an appropriate client error
    When I send a GET request to "/web/index.php/api/v2/fake/endpoint/9999"
    Then the response status should be 401, 403, 404, or 405

  Scenario: TC_API_013 - Unsupported HTTP method is handled correctly
    When I send a DELETE request to the login endpoint
    Then the response status should be 404 or 405

  Scenario: TC_API_015 - Error responses do not expose internal server information
    When I request a non-existent API resource
    Then the response body should not contain "Fatal error"
    And the response body should not contain "Stack trace"

  Scenario: TC_API_016 - Invalid employee ID is handled gracefully
    When I request employee ID "99999999"
    Then the response status should be 401, 403, or 404
    And the response status should not be 500

  Scenario: TC_API_017 - API response time meets the performance requirement
    When I send a GET request to the login page
    Then the response time should be less than 5000 milliseconds

  # ------------------------------------------------------------------
  # Performance and Stability
  # ------------------------------------------------------------------

  Scenario: TC_API_018 - Multiple concurrent requests do not affect server stability
    When I send 5 concurrent GET requests
    Then none of the responses should return status 500

  Scenario: TC_API_019 - Server remains responsive during repeated requests
    When I send 3 consecutive GET requests
    Then each response should return status 200 or 302

  # ------------------------------------------------------------------
  # Response Validation
  # ------------------------------------------------------------------

  Scenario: TC_API_020 - Response contains a valid Content-Type header
    When I call an API endpoint
    Then the "content-type" response header should be present
    And the header value should not be empty

  Scenario: TC_API_022 - Application enforces HTTPS
    When I access the application using HTTPS
    Then the response status should be 200, 301, or 302