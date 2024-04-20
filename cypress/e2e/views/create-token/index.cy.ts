import * as DappKit from '@mysten/dapp-kit';

describe('Create Coin', () => {
  beforeEach(() => {
    const walletAccount = {
      address:
        '0x73286aa99484e43483b382cdbd92b5f63b1d26e8414c49eba70a6c94e39059a3',
    };
    cy.stub(DappKit, 'useCurrentAccount').returns(walletAccount);
  });
  it('Create Coin Flow', () => {
    cy.visit('/');
    cy.get('[data-testid="createtoken"]').click();
    cy.get('input[name=name]').type('Sample Coin');
    cy.get('input[name=symbol]').type('SMPC');
    cy.get('input[name=description]').type('Sampe coin description: E2E');
    cy.get('input[name=totalSupply]').type('10000');
  });
});
