import { BankAccount } from './BankAccount'
import * as Boom from '@hapi/boom'

export class Bank {
  private accounts: Record<string, BankAccount> = {
    FR7630006000011234567890189: new BankAccount('FR7630006000011234567890189', 'Joe Bidjoba'),
    FO9264600123456789: new BankAccount('FO9264600123456789', 'Sigurd Joensen'),
    GB33BUKB20201555555555: new BankAccount('GB33BUKB20201555555555', 'Bob Rich')
  }

  getAccountByIBAN(iban: string): BankAccount {
    const account = this.accounts[iban]
    if (!account) {
      throw Boom.forbidden('The account with IBAN ${accountIBAN} is not a count registred in our bank')
    }
    return account
  }

  makeATransfer(iban: string, fromAccountIBAN: string, amount: number): string {
    const account = this.getAccountByIBAN(iban)

    const transactionNumber = account.deposit(amount, new Date().toISOString(), fromAccountIBAN)
    return `The transfer has been recorder with transactionNumber ${transactionNumber}`
  }

  getTransfers(iban: string) {
    const transfersReceived = Object.values(this.accounts).flatMap((account: BankAccount) =>
      account
        .transactionList()
        .filter((transaction) => transaction.from === iban)
        .map((transaction) => ({
          number: `${transaction.accountNumber}/${transaction.type}/${transaction.date}`,
          at: transaction.date,
          ibanFrom: iban,
          ibanTo: transaction.accountNumber,
          amount: transaction.amount
        }))
    )
    return {
      transfersReceived
    }
  }
}
