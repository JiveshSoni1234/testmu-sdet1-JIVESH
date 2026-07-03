# features/dashboard.feature
# Dashboard Module BDD Scenarios
# Generated with AI assistance (Claude) using structured prompt engineering.
# Associated prompts are documented in prompts.md.

Feature: Dashboard Management

  As an authenticated OrangeHRM administrator
  I want to access and interact with the dashboard
  So that I can efficiently manage HR operations

  Background:
    Given I am logged in as an administrator using username "Admin" and password "admin123"
    And I am on the Dashboard page

  # ------------------------------------------------------------------
  # Dashboard Widgets
  # ------------------------------------------------------------------

  Scenario: TC_DASH_001 - Dashboard loads within the expected response time
    Then the Dashboard page should load within 8 seconds

  Scenario: TC_DASH_002 - Dashboard page header is displayed
    Then I should see the Dashboard page header

  Scenario: TC_DASH_003 - Time at Work widget is displayed
    Then I should see the "Time at Work" widget

  Scenario: TC_DASH_004 - My Actions widget is displayed
    Then I should see the "My Actions" widget

  Scenario: TC_DASH_005 - Sidebar displays the required navigation menu items
    Then I should see the "Admin" menu item
    And I should see the "PIM" menu item
    And I should see the "Leave" menu item
    And I should see the "Recruitment" menu item

  Scenario: TC_DASH_006 - User profile menu displays the Logout option
    When I click my username in the navigation bar
    Then I should see the "Logout" option

  # ------------------------------------------------------------------
  # Navigation and Search
  # ------------------------------------------------------------------

  Scenario: TC_DASH_008 - Admin menu opens the Admin module
    When I click the "Admin" menu item in the sidebar
    Then I should be redirected to the Admin module

  Scenario: TC_DASH_009 - User Management search returns matching records
    Given I am on the User Management page
    When I search for username "Admin"
    And I click the Search button
    Then matching user records should be displayed

  Scenario: TC_DASH_010 - Employee List displays available records
    Given I am on the Employee List page
    Then I should see the employee table
    And at least one employee record should be displayed

  Scenario: TC_DASH_011 - Employee search filters the results
    Given I am on the Employee List page
    When I search for employee "Admin"
    And I click the Search button
    Then the employee list should display the filtered results

  Scenario: TC_DASH_012 - Leave module is accessible from the sidebar
    When I click the "Leave" menu item
    Then I should be redirected to the Leave module
    And the page should load successfully

  # ------------------------------------------------------------------
  # Permission Validation
  # ------------------------------------------------------------------

  Scenario: TC_DASH_014 - Administrator can view the Admin menu
    Then the "Admin" menu item should be visible

  Scenario: TC_DASH_015 - Administrator can access User Management
    When I navigate directly to the User Management page
    Then the page should load successfully
    And I should not see an "Access Denied" message

  Scenario: TC_DASH_016 - Administrator can access the Job Titles page
    When I navigate to the Job Titles page
    Then the page should load successfully

  Scenario: TC_DASH_018 - Unauthenticated users cannot access the Admin module
    Given I am not logged in
    When I navigate directly to the User Management URL
    Then I should be redirected to the Login page

  Scenario: TC_DASH_019 - Logged-in user's name is displayed
    Then I should see my username displayed in the navigation bar
    And the username should not be empty