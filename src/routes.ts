import {Bank} from "./Bank";

export function index(): string {
    return "Hello! Nice to have met you.";
}

export function getAccount(request: any, bankApplication: Bank): string {

    const {id} = request.params
    const account = bankApplication.getAccountByNumber(id);
    if (!account) {
        throw new Error("Account unknown")
    }

    return `Hello ${account.owner()}! Welcome on you account, your balance is ${account.balance()}`;
}
