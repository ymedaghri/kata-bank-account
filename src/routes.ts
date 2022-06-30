import {Bank} from './Bank'

export function index(): string {
    return 'Hello! Nice to have met you.'
}

export function getAccount(request: any, bankApplication: Bank) {
    const {id} = request.params
    const account = bankApplication.getAccountByNumber(id)
    if (!account) {
        throw new Error('Account unknown')
    }

    return {
        account: account.id(),
        owner: account.owner(),
        balance: account.balance()
    }
}

export function getTransactions(request: any, bankApplication: Bank) {
    const {id} = request.params
    const account = bankApplication.getAccountByNumber(id)
    if (!account) {
        throw new Error('Account unknown')
    }

    return {
        account: account.id(),
        owner: account.owner(),
        transactionList: account.transactionList()
    }
}

export function makeDeposit(request: any, bankApplication: Bank) {
    const {params: {id}, payload: {amount}} = request
    const account = bankApplication.getAccountByNumber(id)
    if (!account) {
        throw new Error('Account unknown')
    }

    account.deposit(amount, new Date().toISOString())

    return {
        message: `Deposit of ${amount} made successfully`
    }
}

export function makeCheckout(request: any, bankApplication: Bank) {
    const {params: {id}, payload: {amount}} = request
    const account = bankApplication.getAccountByNumber(id)
    if (!account) {
        throw new Error('Account unknown')
    }

    account.checkout(amount, new Date().toISOString())

    return {
        message: `Checkout of ${amount} made successfully`
    }
}

export function receiveATransfer(request: any, bankApplication: Bank) {
    const {payload: {ibanFrom, ibanTo, amount}} = request
    const message = bankApplication.makeATransfer(ibanTo, ibanFrom, amount);

    return {
        message
    }
}

