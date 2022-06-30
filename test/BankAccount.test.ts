import { expect } from 'chai'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { Bank } from '../src/Bank'
import { BankAccount } from '../src/BankAccount'

describe('BankAccount Tests', () => {
  let bank: StubbedInstance<Bank>

  beforeEach(() => {
    bank = stubInterface()
    const bobAccount = new BankAccount('12345', 'Bob')
    bank.getAccountByIBAN.returns(bobAccount)
  })

  it('should retrieve an account balance of zero', function () {
    // Given
    const account = bank.getAccountByIBAN('12345')

    // When- Then
    expect(account.balance()).to.equal(0)
  })

  it('should make a deposit and retrieve the correct account balance', function () {
    // Given
    const account = bank.getAccountByIBAN('12345')

    // When
    account.deposit(150, '10/10/2021')

    // Then
    expect(account.balance()).to.equal(150)
  })

  it('should make a checkout and retrieve the correct account balance', function () {
    // Given
    const account = bank.getAccountByIBAN('12345')
    const dateDeposit = new Date().toISOString()
    const dateCheckout = new Date().toISOString()
    // When
    account.deposit(150, dateDeposit)
    account.checkout(200, dateCheckout)

    // Then
    expect(account.balance()).to.equal(-50)
  })
  it('should return all the transactions made on the account', function () {
    // Given
    const dateDeposit = new Date().toISOString()
    const dateCheckout1 = new Date().toISOString()
    const dateCheckout2 = new Date().toISOString()
    const account = bank.getAccountByIBAN('12345')

    // When
    account.deposit(350, dateDeposit)
    account.checkout(200, dateCheckout1)
    account.checkout(100, dateCheckout2)

    // Then
    expect(account.transactionList()).to.deep.equal([
      {
        accountNumber: '12345',
        amount: 350,
        balance: 350,
        date: dateDeposit,
        from: undefined,
        transactionNumber: `12345/DEPOSIT/${dateDeposit}`,
        type: 'DEPOSIT'
      },
      {
        accountNumber: '12345',
        amount: -200,
        balance: 150,
        date: dateCheckout1,
        from: undefined,
        transactionNumber: `12345/CHECKOUT/${dateCheckout1}`,
        type: 'CHECKOUT'
      },
      {
        accountNumber: '12345',
        amount: -100,
        balance: 50,
        date: dateCheckout2,
        from: undefined,
        transactionNumber: `12345/CHECKOUT/${dateCheckout2}`,
        type: 'CHECKOUT'
      }
    ])
  })
})
