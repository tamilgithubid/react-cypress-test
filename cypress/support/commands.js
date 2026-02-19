// cypress/support/commands.js
// Custom commands available as cy.commandName()

// cy.login() — complete login through the UI with intercepted API
Cypress.Commands.add('login', (email, password) => {
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      token: 'fake-jwt-token',
      user: { name: 'Alice Johnson', email },
    },
  }).as('loginRequest');

  cy.visit('/');
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="submit-btn"]').click();
  cy.wait('@loginRequest');
});

// cy.loginByApi() — skip UI, set localStorage directly (FASTER!)
Cypress.Commands.add('loginByApi', (email = 'test@example.com') => {
  const user = { name: 'Alice Johnson', email };
  localStorage.setItem('token', 'fake-jwt-token');
  localStorage.setItem('user', JSON.stringify(user));
  cy.visit('/home');
});
