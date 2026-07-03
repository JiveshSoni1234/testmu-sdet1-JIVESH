# features/login.feature
# Login Module BDD Scenarios
# Generated with AI assistance (Claude) using structured prompt engineering.
# Associated prompts are documented in prompts.md.

Feature: User Authentication

  As an authorized OrangeHRM user
  I want to securely authenticate into the application
  So that I can access the system based on my permissions

  Background:
    Given I am on the OrangeHRM login page

  # ------------------------------------------------------------------
  # Valid Login
  # ------------------------------------------------------------------

  Scenario: TC_LOGIN_001 - User logs in successfully with valid credentials
    When I enter username "Admin" and password "admin123"
    And I click the Login button
    Then I should be redirected to the Dashboard page
    And my username should be displayed in the navigation bar

  Scenario: TC_LOGIN_002 - Login page displays all required UI elements
    Then I should see the username input field
    And I should see the password input field
    And I should see the Login button
    And I should see the company logo
    And I should see the "Forgot your password?" link

  Scenario: TC_LOGIN_003 - Password field masks entered characters
    When I type in the password field
    Then the entered password should be masked

  # ------------------------------------------------------------------
  # Invalid Login
  # ------------------------------------------------------------------

  Scenario: TC_LOGIN_006 - Login fails with an invalid password
    When I enter username "Admin" and password "wrongpassword"
    And I click the Login button
    Then I should see the error message "Invalid credentials"
    And I should remain on the Login page

  Scenario: TC_LOGIN_007 - Login fails with an invalid username
    When I enter username "FakeUser999" and password "admin123"
    And I click the Login button
    Then I should see the error message "Invalid credentials"

  Scenario: TC_LOGIN_008 - Username is required
    When I leave the username field empty
    And I enter password "admin123"
    And I click the Login button
    Then I should see a required field validation message for the username

  Scenario: TC_LOGIN_009 - Password is required
    When I enter username "Admin"
    And I leave the password field empty
    And I click the Login button
    Then I should see a required field validation message for the password

  Scenario: TC_LOGIN_010 - Username and password are required
    When I leave both the username and password fields empty
    And I click the Login button
    Then I should see two required field validation messages

  Scenario: TC_LOGIN_011 - SQL injection attempt is rejected
    When I enter username "' OR 1=1 --" and password "' OR 1=1 --"
    And I click the Login button
    Then I should not be redirected to the Dashboard page
    And I should see an authentication error message

  # ------------------------------------------------------------------
  # Forgot Password
  # ------------------------------------------------------------------

  Scenario: TC_LOGIN_012 - Forgot Password link is displayed
    Then I should see the "Forgot your password?" link

  Scenario: TC_LOGIN_013 - Forgot Password link opens the password reset page
    When I click the "Forgot your password?" link
    Then I should be redirected to the Password Reset page

  Scenario: TC_LOGIN_015 - Password reset request is submitted successfully
    Given I am on the Password Reset page
    When I enter username "Admin"
    And I click the Reset Password button
    Then I should see a password reset confirmation message

  Scenario: TC_LOGIN_016 - Username is required on the Password Reset page
    Given I am on the Password Reset page
    When I leave the username field empty
    And I click the Reset Password button
    Then I should see a required field validation message

  Scenario: TC_LOGIN_017 - Cancel returns the user to the Login page
    Given I am on the Password Reset page
    When I click the Cancel button
    Then I should be redirected to the Login page

  # ------------------------------------------------------------------
  # Session Management
  # ------------------------------------------------------------------

  Scenario: TC_LOGIN_018 - Logout terminates the user session
    Given I am logged in as "Admin"
    When I click my username in the navigation bar
    And I click Logout
    Then I should be redirected to the Login page
    And my session should be terminated

  Scenario: TC_LOGIN_019 - Browser Back button does not restore the session after logout
    Given I have successfully logged out
    When I press the browser Back button
    Then I should remain on the Login page
    And I should not have access to the Dashboard

  Scenario: TC_LOGIN_020 - Unauthenticated users cannot access the Dashboard
    Given I am not logged in
    When I navigate directly to the Dashboard URL
    Then I should be redirected to the Login page