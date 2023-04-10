// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { routes } from '../fixtures/routes';
import { LOGIN_BUTTON, PASSWORD_FIELD, PHONE_NUMBER_FIELD } from './selectors/login.selectors';

Cypress.Commands.add('login', (account, password, url) => {
    cy.intercept('POST', '/v1/login').as('login');
    if (url) {
        cy.visit(url);
        cy.get('a').contains('Login').click();
        cy.url().should('include', routes.login);
    } else {
        cy.visit(Cypress.env('url') + routes.login);
    }
    cy.get(PHONE_NUMBER_FIELD).type(account, { log: false });
    cy.get(PASSWORD_FIELD).type(password, { log: false });
    cy.get(LOGIN_BUTTON).click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
});
