import { expect } from 'chai'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { BankAccount } from '../src/BankAccount'
import {Bank} from "../src/Bank";

describe('BankAccount Tests', () => {
  let bank: StubbedInstance<Bank>

  beforeEach(() => {
    bank = stubInterface()
    const bobAccount = new BankAccount('12345', 'Bob')
    bank.getAccountByIBAN.returns(bobAccount)
    const currentDate = new Date().toISOString()
    bank.getCurrentDate.returns(currentDate)
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

    // When
    account.deposit(150, bank.getCurrentDate())
    account.checkout(200, bank.getCurrentDate())

    // Then
    expect(account.balance()).to.equal(-50)
  })
  it('should return all the transactions made on the account', function () {
    // Given
    const account = bank.getAccountByIBAN('12345')

    // When
    account.deposit(350, bank.getCurrentDate())
    account.checkout(200, bank.getCurrentDate())
    account.checkout(100, bank.getCurrentDate())

    // Then
    expect(account.transactionList()).to.deep.equal([
      {
        accountNumber: '12345',
        amount: 350,
        balance: 350,
        date: bank.getCurrentDate(),
        from: undefined,
        transactionNumber: `12345/DEPOSIT/${bank.getCurrentDate()}`,
        type: 'DEPOSIT'
      },
      {
        accountNumber: '12345',
        amount: -200,
        balance: 150,
        date: bank.getCurrentDate(),
        from: undefined,
        transactionNumber: `12345/CHECKOUT/${bank.getCurrentDate()}`,
        type: 'CHECKOUT'
      },
      {
        accountNumber: '12345',
        amount: -100,
        balance: 50,
        date: bank.getCurrentDate(),
        from: undefined,
        transactionNumber: `12345/CHECKOUT/${bank.getCurrentDate()}`,
        type: 'CHECKOUT'
      }
    ])
  })
})
