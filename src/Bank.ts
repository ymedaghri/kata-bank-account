import { BankAccount } from './BankAccount'
import * as Boom from '@hapi/boom'
import {BankRepository} from "./BankRepository";

export class Bank {
    constructor(private readonly bankRepository: BankRepository) {
    }

    getAccountByIBAN(iban: string): BankAccount {
        const account = this.bankRepository.getAccountByIBAN(iban)
        if (!account) {
            throw Boom.forbidden(`The account with IBAN ${iban} is not an account registred in our bank`)
        }
        return account
    }

    makeATransfer(iban: string, fromAccountIBAN: string, amount: number, currentDate: string): string {
        const account = this.getAccountByIBAN(iban)

        const transactionNumber = account.deposit(amount, currentDate, fromAccountIBAN)
        return `The transfer has been recorder with transactionNumber ${transactionNumber}`
    }

    getTransfers(iban: string) {
        const transfersReceived = this.bankRepository.getAllAccounts().flatMap((account: BankAccount) =>
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

    getCurrentDate() {
        return this.bankRepository.getCurrentDate()
    }
}
