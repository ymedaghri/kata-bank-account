import { BankAccount } from './BankAccount'
import * as Boom from "@hapi/boom";

export class Bank {
  private accounts: Record<string, BankAccount> = {
    FR7630006000011234567890189: new BankAccount('FR7630006000011234567890189', 'Jean Bon'),
    FO9264600123456789: new BankAccount('FO9264600123456789', 'Sigurd Joensen'),
    GB33BUKB20201555555555: new BankAccount('GB33BUKB20201555555555', 'Bob Rich')
  }

  getAccountByNumber(accountIBAN: string): BankAccount {
    return this.accounts[accountIBAN]
  }

  makeATransfer(accountIBAN: string, fromAccountIBAN: string, amount: number): string {
    const account = this.accounts[accountIBAN]

    if(!account){
      throw Boom.forbidden('The account with IBAN ${accountIBAN} is not a count registred in our bank')
    }

    const transactionNumber = account.deposit(amount, new Date().toISOString(), fromAccountIBAN);
    return `The transfer has been recorder with transactionNumber ${transactionNumber}`
  }
}
