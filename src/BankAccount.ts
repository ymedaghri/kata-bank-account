enum TransactionType {
    DEPOSIT, CHECKOUT
}

export class BankAccount {
    private transactions: { type: TransactionType, amount: number, date: string }[]

    constructor(private readonly accountNumber: string, private readonly accountOwner: string) {
        this.transactions = []
    }

    balance(): number {
        return this.transactions.map(transaction => {
            if (transaction.type === TransactionType.DEPOSIT) {
                return transaction.amount
            }
            return -transaction.amount
        }).reduce((amount1, amount2) => amount1 + amount2, 0)
    }

    deposit(amount: number, date: string) {
        this.transactions.push({type: TransactionType.DEPOSIT, amount, date})
    }

    checkout(amount: number, date: string) {
        this.transactions.push({type: TransactionType.CHECKOUT, amount, date})
    }

    transactionList() {
        let balance = 0;
        return this.transactions.map(transaction => {
            const amount = (transaction.type === TransactionType.DEPOSIT) ? transaction.amount : -transaction.amount;
            balance += amount
            return ({
                date: transaction.date,
                amount,
                balance
            });
        })

    }

    owner() {
        return this.accountOwner
    }
}
