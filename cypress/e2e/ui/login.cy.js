import { messages } from '../../fixtures/messages';
import { routes } from '../../fixtures/routes';
import { ERROR_MESSAGE_TEXT, SUCCESS_MESSAGE_TEXT } from '../../support/selectors/general.selectors';
import {
    LOGIN_BUTTON,
    PASSWORD_FIELD,
    PHONE_ERROR_COLOR,
    PHONE_ERROR_MESSAGE,
    PHONE_NUMBER_FIELD,
    PROFILE,
} from '../../support/selectors/login.selectors';

const errorValidation = (message) => {
    cy.get(LOGIN_BUTTON).click();
    cy.get(PHONE_ERROR_COLOR).should('have.css', 'border-color', 'rgb(209, 0, 0)');
    cy.get(PHONE_ERROR_MESSAGE).should('have.text', message);
};

describe('Login Tests', () => {
    it('login through login button', () => {
        cy.login(Cypress.env('account'), Cypress.env('password'), Cypress.env('url'));
        cy.get(PROFILE).should('exist').and('be.visible');
    });

    it('login directly through login url', () => {
        cy.login(Cypress.env('account'), Cypress.env('password'));
        cy.get(SUCCESS_MESSAGE_TEXT).should('have.text', messages['login success']);
    });

    it('login with valid account and invalid password', () => {
        cy.visit(Cypress.env('url') + routes.login);
        cy.get(PHONE_NUMBER_FIELD).type(Cypress.env('account'), { log: false });
        cy.get(PASSWORD_FIELD).type('4323');
        cy.get(LOGIN_BUTTON).click();
        cy.get(ERROR_MESSAGE_TEXT).should('have.text', messages['password error']);
    });

    it('login with invalid account and valid password', () => {
        cy.visit(Cypress.env('url') + routes.login);
        cy.get(PHONE_NUMBER_FIELD).type('46346434433');
        cy.get(PASSWORD_FIELD).type(Cypress.env('password'), { log: false });
        errorValidation(messages['invalid phone error']);
    });

    it('login with invalid credentials', () => {
        cy.visit(Cypress.env('url') + routes.login);
        cy.get(PHONE_NUMBER_FIELD).type('46346434433');
        cy.get(PASSWORD_FIELD).type('4652');
        errorValidation(messages['invalid phone error']);
    });

    it('login without credentials', () => {
        cy.visit(Cypress.env('url') + routes.login);
        errorValidation(messages['no phone error']);
    });
});
