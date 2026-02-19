// cypress/e2e/full-flow.cy.js
// Complete end-to-end journey: Login → Home → Profile → Home → Logout → Login

describe('Full App Flow', () => {
  it('completes the entire login → home → profile → logout journey', () => {
    // 1. Visit login page
    cy.visit('/');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.screenshot('flow-1-login-page');

    // 2. Intercept login API and submit
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { name: 'Alice Johnson', email: 'alice@example.com' },
      },
    }).as('loginRequest');

    cy.get('[data-cy="email-input"]').type('alice@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="submit-btn"]').click();
    cy.wait('@loginRequest');

    // 3. Verify we're on the home page
    cy.url().should('include', '/home');
    cy.get('[data-cy="welcome-message"]').should('contain.text', 'Alice Johnson');
    cy.get('[data-cy="stat-cards"]').should('be.visible');
    cy.screenshot('flow-2-home-page');

    // 4. Navigate to profile via navbar
    cy.get('[data-cy="nav-profile"]').click();
    cy.url().should('include', '/profile');
    cy.get('[data-cy="profile-name"]').should('contain.text', 'Alice Johnson');
    cy.get('[data-cy="profile-email"]').should('contain.text', 'alice@example.com');
    cy.screenshot('flow-3-profile-page');

    // 5. Navigate back to home via navbar
    cy.get('[data-cy="nav-home"]').click();
    cy.url().should('include', '/home');
    cy.get('[data-cy="welcome-message"]').should('be.visible');
    cy.screenshot('flow-4-back-to-home');

    // 6. Logout via navbar
    cy.get('[data-cy="nav-logout"]').click();

    // 7. Verify redirect back to login page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.screenshot('flow-5-logged-out');

    // 8. Verify localStorage was cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('user')).to.be.null;
    });
  });
});
