// cypress/e2e/login.cy.js

describe('Login Page', () => {
  beforeEach(() => { // Visit the login page before each test
    cy.visit('/');
  });

  it('displays the login form', () => {
    cy.get('[data-cy="email-input"]').should('be.visible'); // Check if email input is visible
    cy.get('[data-cy="password-input"]').should('be.visible'); // Check if password input is visible
    cy.get('[data-cy="submit-btn"]').should('contain.text', 'Sign In'); // Check if submit button has correct text
    cy.screenshot('login-form-rendered'); // Take a screenshot of the rendered login form
  });

  it('shows browser validation for empty fields', () => {
    cy.get('[data-cy="submit-btn"]').click();  // Click submit without filling fields
    cy.url().should('eq', Cypress.config().baseUrl + '/');  // Should stay on login page due to validation
    cy.get('[data-cy="email-input"]').should('be.focused'); // Email input should be focused due to HTML5 validation
  });
});

describe('Login — API Tests', () => {
  beforeEach(() => cy.visit('/'));

  it('redirects to /home on successful login', () => {
    cy.intercept('POST', '/api/auth/login', { // Mock successful login response
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
    cy.url().should('include', '/home');
    cy.screenshot('login-success-redirect');

    // Verify user object stored in localStorage
    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user'));
      expect(user).to.deep.equal({ name: 'Alice Johnson', email: 'alice@example.com' });
      expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token');
    });
  });

  it('shows error message on invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('failedLogin');

    cy.get('[data-cy="email-input"]').type('wrong@example.com');
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    cy.get('[data-cy="submit-btn"]').click();

    cy.wait('@failedLogin');

    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain.text', 'Invalid credentials');
    cy.screenshot('login-error-message');

    cy.url().should('not.include', '/home');
  });

  it('shows loading state while request is pending', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 't', user: { name: 'Test' } },
      delay: 2000,
    }).as('slowLogin');

    cy.get('[data-cy="email-input"]').type('user@test.com');
    cy.get('[data-cy="password-input"]').type('pass123');
    cy.get('[data-cy="submit-btn"]').click();

    cy.get('[data-cy="submit-btn"]')
      .should('contain.text', 'Signing in...')
      .and('be.disabled');
    cy.screenshot('login-loading-state');
  });

  it('sends the correct data to the API', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 't', user: { name: 'Test' } },
    }).as('loginReq');

    cy.get('[data-cy="email-input"]').type('test@email.com');
    cy.get('[data-cy="password-input"]').type('mypassword');
    cy.get('[data-cy="submit-btn"]').click();

    cy.wait('@loginReq').its('request.body').should('deep.equal', {
      email: 'test@email.com',
      password: 'mypassword',
    });
  });
});

describe('Login with fixtures', () => {
  let users;

  beforeEach(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
    cy.visit('/');
  });

  it('logs in with fixture data', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: users.apiResponse,
    });

    cy.get('[data-cy="email-input"]').type(users.validUser.email);
    cy.get('[data-cy="password-input"]').type(users.validUser.password);
    cy.get('[data-cy="submit-btn"]').click();
    cy.url().should('include', '/home');
  });
});
