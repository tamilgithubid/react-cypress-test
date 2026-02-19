# Cypress E2E Testing — Complete Beginner's Guide

> A step-by-step guide to End-to-End testing with Cypress, React, and Vite.
> Built from a real project: a multi-page app with Login, Home, and Profile pages.

---

## Table of Contents

1. [What is E2E Testing?](#1-what-is-e2e-testing)
2. [Tech Stack Overview](#2-tech-stack-overview)
3. [Project Setup from Scratch](#3-project-setup-from-scratch)
4. [Cypress Installation](#4-cypress-installation)
5. [Folder Structure](#5-folder-structure)
6. [Cypress Configuration](#6-cypress-configuration)
7. [Writing Your First Test](#7-writing-your-first-test)
8. [All Cypress Commands (Cheat Sheet)](#8-all-cypress-commands-cheat-sheet)
9. [Selecting Elements — data-cy Attributes](#9-selecting-elements--data-cy-attributes)
10. [API Mocking with cy.intercept()](#10-api-mocking-with-cyintercept)
11. [Fixtures — External Test Data](#11-fixtures--external-test-data)
12. [Custom Commands](#12-custom-commands)
13. [Screenshots and Videos](#13-screenshots-and-videos)
14. [Testing a Full Multi-Page Flow](#14-testing-a-full-multi-page-flow)
15. [Running Tests — All Commands](#15-running-tests--all-commands)
16. [CI/CD with GitHub Actions](#16-cicd-with-github-actions)
17. [Debugging Failed Tests](#17-debugging-failed-tests)
18. [Common Errors and Fixes](#18-common-errors-and-fixes)
19. [Best Practices](#19-best-practices)
20. [Quick Reference Card](#20-quick-reference-card)

---

## 1. What is E2E Testing?

**End-to-End (E2E) testing** simulates a real user interacting with your app in a real browser. Unlike unit tests (which test individual functions) or integration tests (which test components together), E2E tests verify the **entire flow** from start to finish.

```
Unit Test:        Does add(2, 3) return 5?
Integration Test: Does the LoginForm call the API correctly?
E2E Test:         Can a user type credentials, click login, see the dashboard?
```

### Why E2E Testing?

| Benefit | Description |
|---------|-------------|
| Catches real bugs | Tests what users actually experience |
| Tests the full stack | Frontend + API + routing + state all together |
| Confidence to deploy | If E2E tests pass, the app works |
| Visual proof | Screenshots and videos show exactly what happened |

### The Testing Pyramid

```
        /  E2E  \        ← Few but critical (slow, high confidence)
       /----------\
      / Integration \    ← Medium amount (moderate speed)
     /----------------\
    /    Unit Tests     \ ← Many and fast (low-level logic)
   /--------------------\
```

---

## 2. Tech Stack Overview

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 19.x | UI framework |
| **Vite** | 7.x | Dev server + build tool |
| **React Router** | 7.x | Client-side routing |
| **Tailwind CSS** | 4.x | Styling |
| **Cypress** | 15.x | E2E test runner |
| **start-server-and-test** | 2.x | Starts dev server, then runs tests |

### How They Work Together

```
npm run test:e2e
       |
       v
start-server-and-test
       |
       ├── 1. Starts: npm run dev  (Vite on port 5173)
       ├── 2. Waits:  http://localhost:5173 is responding
       └── 3. Runs:   npm run cy:run (Cypress tests)
```

---

## 3. Project Setup from Scratch

### Step 1: Create a Vite + React project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

### Step 2: Install app dependencies

```bash
npm install react-router-dom lucide-react
npm install clsx tailwind-merge class-variance-authority
```

### Step 3: Install dev dependencies

```bash
npm install -D cypress start-server-and-test
npm install -D tailwindcss @tailwindcss/vite
```

### Step 4: Add scripts to package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:headed": "cypress run --headed",
    "test:e2e": "start-server-and-test dev http://localhost:5173 cy:run"
  }
}
```

### What each script does:

| Script | Command | What it does |
|--------|---------|--------------|
| `dev` | `vite` | Start the dev server |
| `build` | `vite build` | Build for production |
| `cy:open` | `cypress open` | Open Cypress GUI (interactive) |
| `cy:run` | `cypress run` | Run tests headless (terminal only) |
| `cy:run:headed` | `cypress run --headed` | Run tests in visible browser |
| `test:e2e` | `start-server-and-test ...` | Start server + run tests (CI-ready) |

### Step 5: Open Cypress for the first time

```bash
npx cypress open
```

This creates the `cypress/` folder structure automatically.

---

## 4. Cypress Installation

### Installing Cypress

```bash
# Install as a dev dependency
npm install -D cypress

# Verify it installed correctly
npx cypress verify

# Open it for the first time (creates folder structure)
npx cypress open
```

### What happens on first open:

1. Cypress downloads its browser (Electron)
2. Creates the `cypress/` folder:
   - `cypress/e2e/` — your test files go here
   - `cypress/fixtures/` — test data (JSON files)
   - `cypress/support/` — custom commands and global setup
3. Creates `cypress.config.js` in the project root

### Install the server runner

```bash
npm install -D start-server-and-test
```

This package:
1. Starts your dev server (`npm run dev`)
2. Waits until the URL responds with HTTP 200
3. Runs Cypress tests
4. Shuts everything down when done

---

## 5. Folder Structure

```
my-app/
├── cypress/
│   ├── e2e/                          # Test files
│   │   ├── login.cy.js               # Login page tests
│   │   ├── home.cy.js                # Home page tests
│   │   ├── profile.cy.js             # Profile page tests
│   │   └── full-flow.cy.js           # Complete journey test
│   ├── fixtures/                     # Test data
│   │   └── users.json                # User credentials + API responses
│   ├── support/                      # Shared code
│   │   ├── e2e.js                    # Runs before every test file
│   │   └── commands.js               # Custom commands (cy.login, etc.)
│   ├── screenshots/                  # Auto-generated screenshots
│   │   ├── login.cy.js/
│   │   ├── home.cy.js/
│   │   ├── profile.cy.js/
│   │   └── full-flow.cy.js/
│   └── videos/                       # Auto-recorded videos
│       ├── login.cy.js.mp4
│       ├── home.cy.js.mp4
│       ├── profile.cy.js.mp4
│       └── full-flow.cy.js.mp4
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx             # Has data-cy attributes for testing
│   │   ├── Layout.jsx                # Navbar with data-cy attributes
│   │   └── ProtectedRoute.jsx        # Auth guard
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx
│   │   └── ProfilePage.jsx
│   └── context/
│       └── AuthContext.jsx            # Auth state management
├── cypress.config.js                  # Cypress settings
└── package.json
```

### Naming conventions:

| Convention | Example | Rule |
|-----------|---------|------|
| Test files | `login.cy.js` | Always end with `.cy.js` |
| Fixture files | `users.json` | JSON files in `fixtures/` |
| Support file | `e2e.js` | Runs before all tests |
| Commands file | `commands.js` | Custom `cy.*` commands |

---

## 6. Cypress Configuration

### `cypress.config.js` — The main config file

```js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URL — all cy.visit() calls are relative to this
    baseUrl: 'http://localhost:5173',

    // Where test files live (glob pattern)
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',

    // Runs before every test file
    supportFile: 'cypress/support/e2e.js',

    // Browser viewport size
    viewportWidth: 1280,
    viewportHeight: 720,

    // How long to wait for elements to appear (ms)
    defaultCommandTimeout: 6000,

    // Screenshots + Videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,

    // Memory optimization (important for CI and large test suites)
    numTestsKeptInMemory: 0,

    // Node-side event hooks
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          console.log('Video saved:', results.video);
        }
      });
      return config;
    },
  },
});
```

### All config options explained:

| Option | Default | What it does |
|--------|---------|--------------|
| `baseUrl` | `null` | Prepended to `cy.visit('/')` and `cy.request()` URLs |
| `specPattern` | `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}` | Which files are tests |
| `supportFile` | `cypress/support/e2e.js` | Code that runs before every spec |
| `viewportWidth` | `1000` | Browser width in pixels |
| `viewportHeight` | `660` | Browser height in pixels |
| `defaultCommandTimeout` | `4000` | How long `cy.get()` waits before failing |
| `video` | `true` | Record videos of test runs |
| `screenshotsFolder` | `cypress/screenshots` | Where screenshots are saved |
| `videosFolder` | `cypress/videos` | Where videos are saved |
| `numTestsKeptInMemory` | `50` | DOM snapshots kept in memory (0 = save memory) |
| `retries` | `0` | Auto-retry failed tests N times |

---

## 7. Writing Your First Test

### Test file structure

Every Cypress test file follows this pattern:

```js
// cypress/e2e/my-test.cy.js

describe('Feature Name', () => {
  // Runs BEFORE each test in this describe block
  beforeEach(() => {
    cy.visit('/');
  });

  // Individual test
  it('should do something', () => {
    cy.get('selector').should('be.visible');
  });

  // Another test
  it('should do something else', () => {
    cy.get('selector').click();
    cy.url().should('include', '/next-page');
  });
});
```

### Key building blocks:

| Block | Purpose | Runs when |
|-------|---------|-----------|
| `describe()` | Groups related tests | — |
| `it()` | One individual test | Once |
| `beforeEach()` | Setup before each test | Before every `it()` in its `describe` |
| `afterEach()` | Cleanup after each test | After every `it()` |
| `before()` | One-time setup | Once before all tests in `describe` |
| `after()` | One-time cleanup | Once after all tests in `describe` |

### Real example — Login page test:

```js
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/');   // Go to the login page before each test
  });

  it('displays the login form', () => {
    // Find elements and check they're visible
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="submit-btn"]').should('contain.text', 'Sign In');
  });

  it('shows browser validation for empty fields', () => {
    // Click submit without filling in anything
    cy.get('[data-cy="submit-btn"]').click();

    // We should still be on the login page (form prevented submit)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
```

---

## 8. All Cypress Commands (Cheat Sheet)

### Navigation

| Command | What it does | Example |
|---------|-------------|---------|
| `cy.visit(url)` | Navigate to a page | `cy.visit('/')` |
| `cy.go('back')` | Browser back button | `cy.go('back')` |
| `cy.go('forward')` | Browser forward button | `cy.go('forward')` |
| `cy.reload()` | Refresh the page | `cy.reload()` |

### Selecting Elements

| Command | What it does | Example |
|---------|-------------|---------|
| `cy.get(selector)` | Find element by CSS selector | `cy.get('[data-cy="btn"]')` |
| `cy.contains(text)` | Find element containing text | `cy.contains('Sign In')` |
| `cy.find(selector)` | Find child element within a parent | `cy.get('form').find('input')` |
| `cy.first()` | Get first matching element | `cy.get('li').first()` |
| `cy.last()` | Get last matching element | `cy.get('li').last()` |
| `cy.eq(index)` | Get element at index | `cy.get('li').eq(2)` |

### Actions (User Interactions)

| Command | What it does | Example |
|---------|-------------|---------|
| `cy.click()` | Click an element | `cy.get('button').click()` |
| `cy.dblclick()` | Double-click | `cy.get('div').dblclick()` |
| `cy.type(text)` | Type into an input | `cy.get('input').type('hello')` |
| `cy.clear()` | Clear an input | `cy.get('input').clear()` |
| `cy.check()` | Check a checkbox | `cy.get('[type="checkbox"]').check()` |
| `cy.uncheck()` | Uncheck a checkbox | `cy.get('[type="checkbox"]').uncheck()` |
| `cy.select(value)` | Select dropdown option | `cy.get('select').select('Option 1')` |
| `cy.scrollTo(pos)` | Scroll the page | `cy.scrollTo('bottom')` |
| `cy.trigger(event)` | Trigger a DOM event | `cy.get('div').trigger('mouseover')` |

### Special key combinations in `.type()`:

```js
cy.get('input').type('hello{enter}');       // Type and press Enter
cy.get('input').type('{selectall}{del}');    // Select all and delete
cy.get('input').type('{ctrl+a}');            // Ctrl+A
cy.get('input').type('{esc}');               // Press Escape
cy.get('input').type('{backspace}');         // Press Backspace
```

### Assertions (.should)

| Assertion | What it checks | Example |
|-----------|---------------|---------|
| `.should('exist')` | Element is in DOM | `cy.get('div').should('exist')` |
| `.should('be.visible')` | Element is visible | `cy.get('div').should('be.visible')` |
| `.should('not.exist')` | Element is NOT in DOM | `cy.get('.error').should('not.exist')` |
| `.should('be.disabled')` | Button/input is disabled | `cy.get('button').should('be.disabled')` |
| `.should('be.enabled')` | Button/input is enabled | `cy.get('button').should('be.enabled')` |
| `.should('be.focused')` | Element has focus | `cy.get('input').should('be.focused')` |
| `.should('have.text', 'x')` | Exact text match | `cy.get('h1').should('have.text', 'Hello')` |
| `.should('contain.text', 'x')` | Text contains substring | `cy.get('p').should('contain.text', 'Welcome')` |
| `.should('have.value', 'x')` | Input value equals | `cy.get('input').should('have.value', 'test')` |
| `.should('have.class', 'x')` | Has CSS class | `cy.get('div').should('have.class', 'active')` |
| `.should('have.attr', 'x')` | Has HTML attribute | `cy.get('a').should('have.attr', 'href')` |
| `.should('have.length', n)` | Number of elements | `cy.get('li').should('have.length', 5)` |

### Chaining assertions with `.and()`:

```js
cy.get('[data-cy="submit-btn"]')
  .should('be.visible')
  .and('contain.text', 'Sign In')
  .and('not.be.disabled');
```

### URL Assertions

| Command | What it checks | Example |
|---------|---------------|---------|
| `cy.url()` | Get the current URL | `cy.url().should('include', '/home')` |
| `cy.location('pathname')` | Get just the path | `cy.location('pathname').should('eq', '/home')` |
| `cy.hash()` | Get the URL hash | `cy.hash().should('eq', '#section')` |

### Waiting

| Command | What it does | Example |
|---------|-------------|---------|
| `cy.wait('@alias')` | Wait for intercepted request | `cy.wait('@loginRequest')` |
| `cy.wait(ms)` | Wait fixed time (avoid this) | `cy.wait(1000)` |

### Browser APIs

| Command | What it does | Example |
|---------|-------------|---------|
| `cy.window()` | Access the `window` object | `cy.window().its('localStorage')` |
| `cy.document()` | Access the `document` object | `cy.document().its('title')` |
| `cy.title()` | Get page title | `cy.title().should('include', 'My App')` |

### Screenshots & Videos

| Command | What it does | Example |
|---------|-------------|---------|
| `cy.screenshot('name')` | Take a screenshot | `cy.screenshot('login-page')` |
| — | Videos are automatic | Set `video: true` in config |

---

## 9. Selecting Elements — data-cy Attributes

### The Problem

Selecting by CSS class or tag name is fragile:

```js
// BAD — breaks when you change styling
cy.get('.bg-blue-500.text-white.rounded-lg')

// BAD — breaks when you change element type
cy.get('button.submit')

// BAD — breaks when you change text
cy.contains('Log In')  // What if you rename it to "Sign In"?
```

### The Solution: data-cy attributes

Add `data-cy` attributes to elements you want to test:

```jsx
// In your React component
<form data-cy="login-form">
  <input data-cy="email-input" type="email" />
  <input data-cy="password-input" type="password" />
  <button data-cy="submit-btn" type="submit">Sign In</button>
  {error && <p data-cy="error-message">{error}</p>}
</form>
```

```js
// In your Cypress test
cy.get('[data-cy="email-input"]').type('alice@example.com');
cy.get('[data-cy="password-input"]').type('password123');
cy.get('[data-cy="submit-btn"]').click();
```

### Why data-cy is best:

| Selector | Resilient? | Why |
|----------|-----------|-----|
| `cy.get('.btn-primary')` | No | CSS classes change with styling |
| `cy.get('#submit')` | Somewhat | IDs can be reused or renamed |
| `cy.contains('Sign In')` | No | Text changes with i18n or redesigns |
| `cy.get('[data-cy="submit-btn"]')` | **Yes** | Purpose-built for testing, never changes accidentally |

### Naming convention for data-cy:

```
data-cy="[page]-[element]"

Examples:
  data-cy="login-form"
  data-cy="email-input"
  data-cy="submit-btn"
  data-cy="error-message"
  data-cy="nav-home"
  data-cy="nav-profile"
  data-cy="stat-users"
  data-cy="welcome-message"
```

---

## 10. API Mocking with cy.intercept()

### What is cy.intercept()?

`cy.intercept()` catches network requests before they reach the server and lets you return fake responses. This means:

- No real backend needed
- Tests are fast and deterministic
- You can simulate errors, slow responses, etc.

### Basic usage pattern:

```js
// 1. Set up the intercept BEFORE the action that triggers it
cy.intercept('POST', '/api/auth/login', {
  statusCode: 200,
  body: { token: 'fake-jwt-token', user: { name: 'Alice' } },
}).as('loginRequest');        // Give it an alias

// 2. Perform the action that triggers the request
cy.get('[data-cy="submit-btn"]').click();

// 3. Wait for the intercepted request
cy.wait('@loginRequest');

// 4. Assert on the result
cy.url().should('include', '/home');
```

### Simulating different scenarios:

```js
// SUCCESS (200)
cy.intercept('POST', '/api/auth/login', {
  statusCode: 200,
  body: { token: 'fake-jwt-token', user: { name: 'Alice' } },
}).as('loginSuccess');

// ERROR (401)
cy.intercept('POST', '/api/auth/login', {
  statusCode: 401,
  body: { message: 'Invalid credentials' },
}).as('loginFailed');

// SLOW RESPONSE (simulate loading state)
cy.intercept('POST', '/api/auth/login', {
  statusCode: 200,
  body: { token: 'fake-jwt-token' },
  delay: 2000,                // 2 second delay
}).as('slowLogin');

// NETWORK ERROR
cy.intercept('POST', '/api/auth/login', {
  forceNetworkError: true,
}).as('networkError');
```

### Inspecting the request body:

```js
cy.intercept('POST', '/api/auth/login').as('loginReq');

cy.get('[data-cy="email-input"]').type('test@email.com');
cy.get('[data-cy="password-input"]').type('mypassword');
cy.get('[data-cy="submit-btn"]').click();

// Check what was actually sent
cy.wait('@loginReq').its('request.body').should('deep.equal', {
  email: 'test@email.com',
  password: 'mypassword',
});
```

### Intercept flow diagram:

```
Your App                   cy.intercept()              Real Server
    |                           |                           |
    |--- POST /api/login ------>|                           |
    |                           |  (catches the request)    |
    |                           |  (returns fake response)  |
    |<-- { token: '...' } -----|                           |
    |                           |     (never reaches here)  |
```

---

## 11. Fixtures — External Test Data

### What are fixtures?

Fixtures are JSON files that store test data, keeping your tests clean and maintainable.

### Creating a fixture file:

```json
// cypress/fixtures/users.json
{
  "validUser": {
    "email": "alice@example.com",
    "password": "password123"
  },
  "adminUser": {
    "email": "admin@example.com",
    "password": "adminpass"
  },
  "apiResponse": {
    "token": "fake-jwt-token",
    "user": {
      "name": "Alice Johnson",
      "email": "alice@example.com"
    }
  }
}
```

### Loading fixtures in tests:

```js
describe('Login with fixtures', () => {
  let users;

  beforeEach(() => {
    // Load the fixture file
    cy.fixture('users').then((data) => {
      users = data;
    });
    cy.visit('/');
  });

  it('logs in with fixture data', () => {
    // Use fixture data for the API mock
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: users.apiResponse,
    });

    // Use fixture data for input
    cy.get('[data-cy="email-input"]').type(users.validUser.email);
    cy.get('[data-cy="password-input"]').type(users.validUser.password);
    cy.get('[data-cy="submit-btn"]').click();

    cy.url().should('include', '/home');
  });
});
```

### Benefits of fixtures:

| Without Fixtures | With Fixtures |
|-----------------|---------------|
| Data scattered across test files | Data in one place |
| Hard to update test data | Change one JSON file |
| Repetitive strings | Reusable objects |
| Messy test code | Clean test code |

---

## 12. Custom Commands

### What are custom commands?

Custom commands extend `cy` with your own reusable functions. Instead of repeating the same 5 lines in every test, you write it once.

### File: `cypress/support/commands.js`

```js
// cy.login() — Full UI login with intercepted API
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

// cy.loginByApi() — Skip UI, set localStorage directly (FASTER!)
Cypress.Commands.add('loginByApi', (email = 'test@example.com') => {
  const user = { name: 'Alice Johnson', email };
  localStorage.setItem('token', 'fake-jwt-token');
  localStorage.setItem('user', JSON.stringify(user));
  cy.visit('/home');
});
```

### File: `cypress/support/e2e.js`

```js
// This file runs before every single test file
import './commands';
```

### Using custom commands in tests:

```js
// BEFORE (repetitive)
it('test 1', () => {
  cy.intercept('POST', '/api/auth/login', { statusCode: 200, body: { ... } });
  cy.visit('/');
  cy.get('[data-cy="email-input"]').type('alice@example.com');
  cy.get('[data-cy="password-input"]').type('password123');
  cy.get('[data-cy="submit-btn"]').click();
  // ... actual test logic
});

// AFTER (clean)
it('test 1', () => {
  cy.login('alice@example.com', 'password123');
  // ... actual test logic
});

// EVEN FASTER (skip UI entirely)
it('test 1', () => {
  cy.loginByApi('alice@example.com');
  // ... actual test logic
});
```

### When to use which login:

| Command | Speed | When to use |
|---------|-------|-------------|
| `cy.login(email, pass)` | Slow (~2s) | When testing the login flow itself |
| `cy.loginByApi(email)` | Fast (~0.2s) | When you just need to BE logged in |

---

## 13. Screenshots and Videos

### Screenshots

#### Automatic screenshots (on failure):

When a test fails, Cypress automatically saves a screenshot. No setup needed.

```
cypress/screenshots/
  login.cy.js/
    Login Page -- displays the login form (failed).png
```

#### Manual screenshots (in test code):

```js
it('displays the home page', () => {
  cy.loginByApi('alice@example.com');
  cy.get('[data-cy="welcome-message"]').should('be.visible');
  cy.screenshot('home-welcome-message');  // Saved to cypress/screenshots/
});
```

#### Screenshot at every key point (recommended):

```js
it('completes the full journey', () => {
  cy.visit('/');
  cy.screenshot('step-1-login-page');       // Capture starting state

  // ... perform login ...
  cy.screenshot('step-2-home-page');        // After login

  cy.get('[data-cy="nav-profile"]').click();
  cy.screenshot('step-3-profile-page');     // After navigation

  cy.get('[data-cy="nav-logout"]').click();
  cy.screenshot('step-4-logged-out');       // After logout
});
```

### Videos

Videos are recorded automatically when `video: true` is set in config.

```
cypress/videos/
  login.cy.js.mp4
  home.cy.js.mp4
  profile.cy.js.mp4
  full-flow.cy.js.mp4
```

### Viewing results:

```bash
# Open screenshots folder
open cypress/screenshots

# Play a video
open cypress/videos/full-flow.cy.js.mp4

# Or in the terminal
ls -la cypress/screenshots/**/*.png
ls -la cypress/videos/*.mp4
```

### Our project's screenshots (20 total):

| Spec | Screenshot Name | What it captures |
|------|----------------|-----------------|
| login.cy.js | `login-form-rendered` | Login form on initial load |
| login.cy.js | `login-success-redirect` | Home page after successful login |
| login.cy.js | `login-error-message` | Error message on invalid credentials |
| login.cy.js | `login-loading-state` | "Signing in..." disabled button |
| home.cy.js | `home-auth-redirect` | Redirect to login when unauthenticated |
| home.cy.js | `home-welcome-message` | Welcome banner with user name |
| home.cy.js | `home-stat-cards` | All 4 dashboard stat cards |
| home.cy.js | `home-navbar` | Navbar with links and username |
| home.cy.js | `home-nav-to-profile` | Profile page after nav click |
| home.cy.js | `home-logout-redirect` | Login page after logout |
| profile.cy.js | `profile-auth-redirect` | Redirect to login when unauthenticated |
| profile.cy.js | `profile-user-info` | User info card with avatar |
| profile.cy.js | `profile-edit-section` | Edit profile form |
| profile.cy.js | `profile-logout-redirect` | Login page after profile logout |
| profile.cy.js | `profile-nav-to-home` | Home page after nav click |
| full-flow.cy.js | `flow-1-login-page` | Starting login page |
| full-flow.cy.js | `flow-2-home-page` | Home after login |
| full-flow.cy.js | `flow-3-profile-page` | Profile page |
| full-flow.cy.js | `flow-4-back-to-home` | Home after returning |
| full-flow.cy.js | `flow-5-logged-out` | Login page after logout |

---

## 14. Testing a Full Multi-Page Flow

### The app flow:

```
Login (/) → Home (/home) → Profile (/profile) → Logout → Login (/)
```

### Complete journey test:

```js
// cypress/e2e/full-flow.cy.js

describe('Full App Flow', () => {
  it('completes the entire login -> home -> profile -> logout journey', () => {

    // STEP 1: Visit the login page
    cy.visit('/');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.screenshot('flow-1-login-page');

    // STEP 2: Set up API mock and log in
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

    // STEP 3: Verify home page
    cy.url().should('include', '/home');
    cy.get('[data-cy="welcome-message"]').should('contain.text', 'Alice Johnson');
    cy.get('[data-cy="stat-cards"]').should('be.visible');
    cy.screenshot('flow-2-home-page');

    // STEP 4: Navigate to profile
    cy.get('[data-cy="nav-profile"]').click();
    cy.url().should('include', '/profile');
    cy.get('[data-cy="profile-name"]').should('contain.text', 'Alice Johnson');
    cy.get('[data-cy="profile-email"]').should('contain.text', 'alice@example.com');
    cy.screenshot('flow-3-profile-page');

    // STEP 5: Navigate back to home
    cy.get('[data-cy="nav-home"]').click();
    cy.url().should('include', '/home');
    cy.get('[data-cy="welcome-message"]').should('be.visible');
    cy.screenshot('flow-4-back-to-home');

    // STEP 6: Logout
    cy.get('[data-cy="nav-logout"]').click();

    // STEP 7: Verify redirect to login
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.screenshot('flow-5-logged-out');

    // STEP 8: Verify localStorage cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('user')).to.be.null;
    });
  });
});
```

### Testing protected routes:

```js
// Users without a token should be redirected
it('redirects unauthenticated users to login', () => {
  cy.visit('/home');   // Try to access protected page
  cy.url().should('eq', Cypress.config().baseUrl + '/');  // Redirected to login
  cy.get('[data-cy="login-form"]').should('be.visible');
});
```

### Testing page content:

```js
describe('when authenticated', () => {
  beforeEach(() => {
    cy.loginByApi('alice@example.com');  // Fast login via localStorage
  });

  it('displays all 4 stat cards', () => {
    cy.get('[data-cy="stat-cards"]').should('be.visible');
    cy.get('[data-cy="stat-users"]').should('contain.text', '2,847');
    cy.get('[data-cy="stat-revenue"]').should('contain.text', '$48,250');
    cy.get('[data-cy="stat-orders"]').should('contain.text', '1,024');
    cy.get('[data-cy="stat-growth"]').should('contain.text', '+12.5%');
  });
});
```

---

## 15. Running Tests — All Commands

### Development commands:

```bash
# Start the dev server (needed for cy:open and cy:run)
npm run dev

# Open Cypress GUI — interactive mode, pick tests, watch in real-time
npm run cy:open

# Run all tests headless (terminal output only)
npm run cy:run

# Run tests in a visible browser
npm run cy:run:headed

# ONE COMMAND — start server + run tests + shut down (for CI)
npm run test:e2e
```

### Running specific tests:

```bash
# Run a single spec file
npx cypress run --spec cypress/e2e/login.cy.js

# Run multiple spec files
npx cypress run --spec "cypress/e2e/login.cy.js,cypress/e2e/home.cy.js"

# Run with a specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
npx cypress run --browser electron    # default
```

### Overriding config from command line:

```bash
# Disable video
npx cypress run --config video=false

# Change viewport
npx cypress run --config viewportWidth=375,viewportHeight=667

# Change base URL
npx cypress run --config baseUrl=http://localhost:3000

# Increase timeout
npx cypress run --config defaultCommandTimeout=10000
```

### Environment variables:

```bash
# Pass env vars to tests
npx cypress run --env apiUrl=http://staging.api.com

# Access in tests
Cypress.env('apiUrl')  // 'http://staging.api.com'
```

### Summary of all scripts:

| Command | What it does | When to use |
|---------|-------------|-------------|
| `npm run dev` | Start dev server only | Before `cy:open` |
| `npm run cy:open` | Open Cypress GUI | During development |
| `npm run cy:run` | Run tests headless | Quick check (needs server running) |
| `npm run cy:run:headed` | Run tests in browser | Debug visually |
| `npm run test:e2e` | Server + tests + shutdown | CI/CD or final verification |

---

## 16. CI/CD with GitHub Actions

### `.github/workflows/cypress.yml`

```yaml
name: Cypress E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest

    steps:
      # 1. Check out the code
      - name: Checkout
        uses: actions/checkout@v4

      # 2. Set up Node.js
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # 3. Install dependencies
      - name: Install dependencies
        run: npm ci

      # 4. Build + Start server + Run Cypress
      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm run dev
          wait-on: 'http://localhost:5173'
          wait-on-timeout: 120
          browser: chrome
          record: false

      # 5. Save screenshots if tests fail
      - name: Upload screenshots on failure
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
          retention-days: 7

      # 6. Always save videos
      - name: Upload videos always
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
          retention-days: 7
```

### What this does:

```
Push to main/develop  ──>  GitHub Actions triggers
                               |
                               ├── 1. Checks out code
                               ├── 2. Installs Node.js 20
                               ├── 3. Runs npm ci (install deps)
                               ├── 4. Builds the app
                               ├── 5. Starts dev server
                               ├── 6. Runs Cypress tests in Chrome
                               ├── 7. If tests FAIL → uploads screenshots
                               └── 8. Always uploads video recordings
```

---

## 17. Debugging Failed Tests

### Method 1: Use Cypress GUI (best for development)

```bash
npm run dev          # Start server in terminal 1
npm run cy:open      # Open Cypress GUI in terminal 2
```

The GUI lets you:
- Click on any test to run it
- Watch it execute step by step
- Time-travel through each command
- Inspect the DOM at each step
- See network requests

### Method 2: Run headed (see the browser)

```bash
npm run cy:run:headed
```

### Method 3: Check screenshots

```bash
# After a test failure, check the screenshot
open cypress/screenshots/
```

### Method 4: Watch the video

```bash
# Videos are recorded for every spec
open cypress/videos/login.cy.js.mp4
```

### Method 5: Add cy.pause() for breakpoints

```js
it('debug this test', () => {
  cy.visit('/');
  cy.get('[data-cy="email-input"]').type('test@test.com');
  cy.pause();    // <-- Test pauses here, you can inspect the app
  cy.get('[data-cy="submit-btn"]').click();
});
```

### Method 6: Add cy.debug() for console debugging

```js
it('debug this test', () => {
  cy.get('[data-cy="email-input"]')
    .debug()     // <-- Logs the element to browser console
    .type('test@test.com');
});
```

### Method 7: Console log in tests

```js
it('check values', () => {
  cy.window().then((win) => {
    console.log('Token:', win.localStorage.getItem('token'));
    console.log('User:', win.localStorage.getItem('user'));
  });
});
```

---

## 18. Common Errors and Fixes

### Error 1: "Timed out retrying: expected to find element"

```
CypressError: Timed out retrying after 4000ms:
Expected to find element: [data-cy="submit-btn"], but never found it.
```

**Cause:** Element doesn't exist or hasn't rendered yet.

**Fixes:**
```js
// Increase timeout for slow-loading elements
cy.get('[data-cy="submit-btn"]', { timeout: 10000 }).should('be.visible');

// Or increase globally in cypress.config.js
defaultCommandTimeout: 10000
```

### Error 2: "cy.visit() failed trying to load"

```
CypressError: cy.visit() failed trying to load:
http://localhost:5173/
```

**Cause:** Dev server is not running.

**Fix:** Use `npm run test:e2e` instead of `npm run cy:run` — it starts the server automatically.

### Error 3: SIGKILL — Test Runner unexpectedly exited

```
The Test Runner unexpectedly exited via a exit event with signal SIGKILL
```

**Cause:** Out of memory — Cypress + Electron uses too much RAM.

**Fixes:**
```js
// In cypress.config.js — free DOM snapshots after each test
numTestsKeptInMemory: 0

// Disable video if you don't need it
video: false

// Or run fewer specs at a time
npx cypress run --spec cypress/e2e/login.cy.js
```

### Error 4: "Port 5173 is in use"

**Cause:** A previous dev server is still running.

**Fix:**
```bash
# Kill processes on port 5173
lsof -ti:5173 | xargs kill -9

# Then run tests again
npm run test:e2e
```

### Error 5: Intercept not catching requests

**Cause:** `cy.intercept()` was set up after the request was made.

**Fix:** Always set up intercepts BEFORE the action that triggers the request:
```js
// CORRECT — intercept first, then act
cy.intercept('POST', '/api/auth/login', { ... }).as('login');
cy.get('[data-cy="submit-btn"]').click();
cy.wait('@login');

// WRONG — action before intercept
cy.get('[data-cy="submit-btn"]').click();
cy.intercept('POST', '/api/auth/login', { ... });  // TOO LATE!
```

### Error 6: "Cannot read properties of undefined"

**Cause:** Fixture data not loaded yet.

**Fix:** Load fixtures in `beforeEach` and use `then`:
```js
let users;

beforeEach(() => {
  cy.fixture('users').then((data) => {
    users = data;  // Now it's available
  });
});
```

---

## 19. Best Practices

### 1. Use data-cy for selectors

```jsx
// Component
<button data-cy="submit-btn">Submit</button>

// Test
cy.get('[data-cy="submit-btn"]').click();
```

### 2. One assertion concept per test

```js
// GOOD — focused test
it('shows error on invalid credentials', () => { ... });
it('shows loading state', () => { ... });
it('redirects on success', () => { ... });

// BAD — too many things in one test
it('handles login', () => {
  // tests error, loading, success, redirect, localStorage all in one
});
```

### 3. Use beforeEach for common setup

```js
describe('when authenticated', () => {
  beforeEach(() => {
    cy.loginByApi('alice@example.com');
  });

  it('test 1', () => { /* already logged in */ });
  it('test 2', () => { /* already logged in */ });
});
```

### 4. Use cy.loginByApi() for speed (skip UI when possible)

```js
// Only test login UI in login.cy.js
// For all other tests, use the fast approach:
cy.loginByApi('alice@example.com');
```

### 5. Never use cy.wait(ms) for timing

```js
// BAD — flaky, wastes time
cy.wait(3000);
cy.get('[data-cy="result"]').should('be.visible');

// GOOD — waits exactly as long as needed
cy.get('[data-cy="result"]').should('be.visible');  // auto-retries until found

// GOOD — wait for specific API call
cy.wait('@loginRequest');
```

### 6. Keep tests independent

Each test should work on its own. Never depend on another test running first.

```js
// BAD — test 2 depends on test 1
it('logs in', () => { /* sets up session */ });
it('sees dashboard', () => { /* assumes logged in from test 1 */ });

// GOOD — each test sets up its own state
it('logs in', () => { cy.visit('/'); /* login flow */ });
it('sees dashboard', () => { cy.loginByApi(); /* check dashboard */ });
```

### 7. Organize with describe blocks

```js
describe('Home Page', () => {
  it('redirects unauthenticated users', () => { ... });

  describe('when authenticated', () => {
    beforeEach(() => cy.loginByApi());

    it('shows welcome message', () => { ... });
    it('shows stat cards', () => { ... });
    it('navbar works', () => { ... });
  });
});
```

### 8. Add screenshots at key points

```js
cy.screenshot('descriptive-name');  // Creates visual evidence
```

### 9. Clean up localStorage between tests

Cypress automatically clears cookies between tests. For localStorage:

```js
afterEach(() => {
  cy.window().then((win) => win.localStorage.clear());
});
```

### 10. Add .gitignore for generated files

```gitignore
# Cypress generated files
cypress/videos/
cypress/screenshots/
```

---

## 20. Quick Reference Card

### Start testing:

```bash
npm run test:e2e                # Full run (start server + tests)
npm run cy:open                 # Interactive GUI
npm run cy:run:headed           # Watch in browser
```

### Write tests:

```js
describe('Page', () => {
  beforeEach(() => cy.visit('/'));

  it('does something', () => {
    cy.get('[data-cy="element"]')   // Find element
      .should('be.visible')         // Assert visible
      .click();                     // Act
    cy.url().should('include', '/next');  // Assert URL
    cy.screenshot('step-name');     // Capture proof
  });
});
```

### Mock APIs:

```js
cy.intercept('POST', '/api/endpoint', {
  statusCode: 200,
  body: { data: 'fake' },
}).as('apiCall');

cy.get('button').click();
cy.wait('@apiCall');
```

### Custom commands:

```js
// Define in cypress/support/commands.js
Cypress.Commands.add('myCommand', (arg) => { ... });

// Use in tests
cy.myCommand('value');
```

### File locations:

```
Tests:       cypress/e2e/*.cy.js
Fixtures:    cypress/fixtures/*.json
Commands:    cypress/support/commands.js
Config:      cypress.config.js
Screenshots: cypress/screenshots/
Videos:      cypress/videos/
```

---

**You're now ready to write professional E2E tests!**

Run `npm run test:e2e` and watch all 19 tests pass.
