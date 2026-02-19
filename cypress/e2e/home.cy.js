// cypress/e2e/home.cy.js

describe('Home Page', () => {
  it('redirects unauthenticated users to login', () => {
    cy.visit('/home');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.screenshot('home-auth-redirect');
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      cy.loginByApi('alice@example.com');
    });

    it('displays welcome message with user name', () => { // it - should display welcome message with user name
      cy.get('[data-cy="welcome-message"]')
        .should('be.visible')
        .and('contain.text', 'Welcome back, Alice Johnson');
      cy.screenshot('home-welcome-message');
    });

    it('displays all 4 stat cards', () => {
      cy.get('[data-cy="stat-cards"]').should('be.visible');
      cy.get('[data-cy="stat-users"]').should('contain.text', '2,847');
      cy.get('[data-cy="stat-revenue"]').should('contain.text', '$48,250');
      cy.get('[data-cy="stat-orders"]').should('contain.text', '1,024');
      cy.get('[data-cy="stat-growth"]').should('contain.text', '+12.5%');
      cy.screenshot('home-stat-cards');
    });

    it('displays the navbar with links', () => {
      cy.get('[data-cy="navbar"]').should('be.visible');
      cy.get('[data-cy="nav-home"]').should('be.visible');
      cy.get('[data-cy="nav-profile"]').should('be.visible');
      cy.get('[data-cy="nav-username"]').should('contain.text', 'Alice Johnson');
      cy.get('[data-cy="nav-logout"]').should('be.visible');
      cy.screenshot('home-navbar');
    });

    it('navigates to profile page via navbar', () => {
      cy.get('[data-cy="nav-profile"]').click();
      cy.url().should('include', '/profile');
      cy.get('[data-cy="profile-page"]').should('be.visible');
      cy.screenshot('home-nav-to-profile');
    });

    it('logs out from navbar and redirects to login', () => {
      cy.get('[data-cy="nav-logout"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/'); // Should redirect to login page
      cy.get('[data-cy="login-form"]').should('be.visible');
      cy.screenshot('home-logout-redirect');
    });
  });
});
