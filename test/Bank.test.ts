import { expect } from 'chai'
import { Bank } from '../src/Bank'

describe('Bank Tests', () => {
  it('should retrieve an bank account from its number', function () {
    // Given
    const bank = new Bank()

    // When
    const bobAccount = bank.getAccountByIBAN('GB33BUKB20201555555555')

    // Then
    expect(bobAccount.owner()).to.equal('Bob Rich')
  })
})
