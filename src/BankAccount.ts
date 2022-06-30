enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  CHECKOUT = 'CHECKOUT',
  DEPOSIT_VIA_TRANSFER = 'TRANSFER'
}

export class BankAccount {
  private transactions: { type: TransactionType; amount: number; date: string; from?: string; accountNumber: string }[]

  constructor(private readonly accountIBAN: string, private readonly accountOwner: string) {
    this.transactions = []
  }

  id(): string {
    return this.accountIBAN
  }

  balance(): number {
    return this.transactions
      .map((transaction) => {
        if (transaction.type === TransactionType.DEPOSIT || transaction.type === TransactionType.DEPOSIT_VIA_TRANSFER) {
          return transaction.amount
        }
        return -transaction.amount
      })
      .reduce((amount1, amount2) => amount1 + amount2, 0)
  }

  deposit(amount: number, date: string, fromAccountIBAN?: string): string {
    const from = fromAccountIBAN ? fromAccountIBAN : undefined
    this.transactions.push({ type: TransactionType.DEPOSIT, amount, date, from, accountNumber: this.id() })
    return `${this.id()}/${TransactionType.DEPOSIT}/${date}`
  }

  checkout(amount: number, date: string): string {
    this.transactions.push({ type: TransactionType.CHECKOUT, amount, date, accountNumber: this.id() })
    return `${this.id()}/${TransactionType.DEPOSIT}/${date}`
  }

  transactionList() {
    let balance = 0
    return this.transactions.map((transaction) => {
      const amount = transaction.type === TransactionType.DEPOSIT ? transaction.amount : -transaction.amount
      balance += amount
      return {
        type: transaction.type,
        date: transaction.date,
        amount,
        balance,
        transactionNumber: `${this.id()}/${transaction.type}/${transaction.date}`,
        accountNumber: this.id(),
        from: transaction.from
      }
    })
  }

  owner() {
    return this.accountOwner
  }
}
