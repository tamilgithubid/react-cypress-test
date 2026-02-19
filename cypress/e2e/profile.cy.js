// cypress/e2e/profile.cy.js

describe('Profile Page', () => {
  it('redirects unauthenticated users to login', () => {
    cy.visit('/profile');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.screenshot('profile-auth-redirect');
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      cy.loginByApi('alice@example.com');
      cy.get('[data-cy="nav-profile"]').click();
    });

    it('displays user info card with name and email', () => {
      cy.get('[data-cy="user-info-card"]').should('be.visible');
      cy.get('[data-cy="profile-name"]').should('contain.text', 'Alice Johnson');
      cy.get('[data-cy="profile-email"]').should('contain.text', 'alice@example.com');
      cy.get('[data-cy="user-avatar"]').should('be.visible');
      cy.screenshot('profile-user-info');
    });

    it('displays edit profile section with inputs', () => {
      cy.get('[data-cy="edit-profile-section"]').should('be.visible');
      cy.get('[data-cy="edit-name"]').should('have.value', 'Alice Johnson');
      cy.get('[data-cy="edit-email"]').should('have.value', 'alice@example.com');
      cy.get('[data-cy="save-profile"]').should('be.visible');
      cy.screenshot('profile-edit-section');
    });

    it('logs out from profile page', () => {
      cy.get('[data-cy="profile-logout"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('[data-cy="login-form"]').should('be.visible');
      cy.screenshot('profile-logout-redirect');
    });

    it('navigates back to home via navbar', () => {
      cy.get('[data-cy="nav-home"]').click();
      cy.url().should('include', '/home');
      cy.get('[data-cy="home-page"]').should('be.visible');
      cy.screenshot('profile-nav-to-home');
    });
  });
});
