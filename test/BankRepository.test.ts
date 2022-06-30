import { expect } from 'chai'
import { BankRepository } from '../src/BankRepository'

describe('BankRepository Tests', () => {
  it('should retrieve an bank account from its number', function () {
    // Given
    const bank = new BankRepository()

    // When
    const bobAccount = bank.getAccountByIBAN('GB33BUKB20201555555555')

    // Then
    expect(bobAccount.owner()).to.equal('Bob Rich')
  })
})
