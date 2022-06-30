import { BankAccount } from './BankAccount'

export class BankRepository {
  private accounts: Record<string, BankAccount> = {
    FR7630006000011234567890189: new BankAccount('FR7630006000011234567890189', 'Joe Bidjoba'),
    FO9264600123456789: new BankAccount('FO9264600123456789', 'Sigurd Joensen'),
    GB33BUKB20201555555555: new BankAccount('GB33BUKB20201555555555', 'Bob Rich')
  }

  getAccountByIBAN(iban: string): BankAccount {
    return this.accounts[iban]
  }

  getAllAccounts(): BankAccount[] {
    return Object.values(this.accounts)
  }

  getCurrentDate() {
    return new Date().toISOString()
  }
}
