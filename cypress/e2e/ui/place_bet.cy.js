import { routes } from '../../fixtures/routes';
import {
    MATCH_ODDS,
    SPORTS_ITEMS,
    BET_AMOUNT_FIELD,
    PLACE_BET_BUTTON,
    REMOVE_ALL_SELECTED_MATCHES_BUTTON,
    SELECTED_MATCHES_CONTAINER,
    SELECTED_MATCH,
    CLOSE_MODAL,
    AMOUNT,
    MODAL_BLOCK,
    LOW_BALANCE_ERROR_TEXT,
} from '../../support/selectors/place_bet.selectors';
import { messages } from '../../fixtures/messages';
import { ERROR_MESSAGE_TEXT } from '../../support/selectors/general.selectors';

let betId, shortBetId;

const selectOdds = (index) => {
    cy.get(MATCH_ODDS)
        .eq(index)
        .find('button')
        .eq(index)
        .then(($el) => {
            $el.trigger('click');
            $el.hasClass('selected');
        });
};

const selectMatches = () => {
    cy.get(SPORTS_ITEMS).contains('Soccer').click();
    cy.location('pathname').should('eq', '/en-ke/s/soccer');

    // select home win, draw and away win for the first three soccer matches
    selectOdds(0); // select home win for first soccer match
    selectOdds(1); // select draw for second soccer match
    selectOdds(2); // select away win for third soccer match

    // selected matches should equal 3
    cy.get(SELECTED_MATCHES_CONTAINER).find(SELECTED_MATCH).should('have.length', 3);
};

describe.skip('Placing of Bets', () => {
    beforeEach(() => {
        cy.login(Cypress.env('account'), Cypress.env('password'));

        cy.intercept('POST', routes.place_bet).as('placeBet');
        cy.intercept('POST', routes.my_bets).as('myBets');
    });

    afterEach(() => {
        cy.get('a[href="/en-ke/profile"]').contains('Profile').click();
        cy.get('.button.full').contains('Sign Out').click();
    });

    it('places a bet', () => {
        selectMatches();

        cy.get(BET_AMOUNT_FIELD).focus().type('{selectall}').type(1);
        cy.get(PLACE_BET_BUTTON).should('have.attr', 'amount', '1'); // verify that bet amount is KES 1
        cy.get(PLACE_BET_BUTTON).click();
        cy.wait('@placeBet').then((res) => {
            expect(res.response.statusCode).to.equal(201);
            shortBetId = res.response.body.params.short_bet_id;
            betId = res.response.body.params.bet_id;
        });
        cy.get('a[href="/en-ke/mybets"]').contains('My Bets').click();
        cy.location('pathname').should('eq', '/en-ke/mybets');

        // placed bet should be on my bets page
        cy.wait('@myBets').then((res) => {
            expect(res.response.body.bets[0].short_bet_id).to.equal(shortBetId);
            expect(res.response.body.bets[0].bet_id).to.equal(betId.toString());
        });
    });

    it('submit bet button is disabled when amount to bet is zero', () => {
        selectMatches();

        cy.get(BET_AMOUNT_FIELD).focus().type('{selectall}').clear();
        cy.get(PLACE_BET_BUTTON).should('have.attr', 'disabled', 'disabled'); // place bet button should be disabled

        cy.get(REMOVE_ALL_SELECTED_MATCHES_BUTTON).contains('Remove All').click();
    });

    it('remove all matches after selection', () => {
        selectMatches();
        cy.get(REMOVE_ALL_SELECTED_MATCHES_BUTTON).contains('Remove All').click();
        cy.get(SELECTED_MATCHES_CONTAINER).should('not.exist');
    });

    it('remove one match', () => {
        selectMatches();

        cy.get('button[class="stacked__remove"]').first().click();
        cy.get(SELECTED_MATCHES_CONTAINER).find(SELECTED_MATCH).should('have.length', 2); // selected matches should be reduced to two

        cy.get(REMOVE_ALL_SELECTED_MATCHES_BUTTON).contains('Remove All').click();
    });

    it('place a bet greater than the allowed maximum amount', () => {
        selectMatches();
        cy.get(BET_AMOUNT_FIELD).focus().type('{selectall}').type(500001);
        cy.get(PLACE_BET_BUTTON).click();
        cy.get(ERROR_MESSAGE_TEXT).should('have.text', messages['bet amount exceeded error']);
        cy.get(REMOVE_ALL_SELECTED_MATCHES_BUTTON).contains('Remove All').click();
    });

    it('place bet with amount greater than user account balance', () => {
        selectMatches();

        cy.get(AMOUNT)
            .first()
            .then(($el) => {
                let balance = $el.text();
                let amountToBet = 5 + parseInt(balance.slice(3));
                cy.get(BET_AMOUNT_FIELD).focus().type('{selectall}').type(amountToBet);
                cy.get(PLACE_BET_BUTTON).click();
                cy.get(MODAL_BLOCK).find(LOW_BALANCE_ERROR_TEXT).should('contain.text', messages['low balance error']);
                cy.get(CLOSE_MODAL).click();
            });

        cy.get(REMOVE_ALL_SELECTED_MATCHES_BUTTON).contains('Remove All').click();
    });
});
