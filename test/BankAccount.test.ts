import {expect} from "chai";
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { Bank } from "../src/Bank";
import {BankAccount} from "../src/BankAccount";

/*
    Test List
    - - - - -

    2. Faire un Dépôt et récupérer le solde de son compte
    3. Faire un Retrait et récupérer le solde de son compte
    4. Faire la liste des transactions sous la forme :
     Date           Transaction     Balance
     14/01/2012     -500.00         2500.00
     13/01/2012     2000.00         3000.00
     10/01/2012     1000.00         1000.00

 */

describe("BankAccount Tests", () => {
    let bank:StubbedInstance<Bank>

    beforeEach(()=>{
        bank=stubInterface()
        const bobAccount = new BankAccount("12345", "Bob")
        bank.getAccountByNumber.returns(bobAccount)
    })

    it('should retrieve an account balance of zero', function () {
        // Given
        const account = bank.getAccountByNumber("12345");

        // When- Then
        expect(account.balance()).to.equal(0);
    });

    it('should make a deposit and retrieve the correct account balance', function () {
        // Given
        const account = bank.getAccountByNumber("12345");

        // When
        account.deposit(150, "10/10/2021")

        // Then
        expect(account.balance()).to.equal(150);
    });

    it('should make a checkout and retrieve the correct account balance', function () {
        // Given
        const account = bank.getAccountByNumber("12345");

        // When
        account.deposit(150, "10/10/2021")
        account.checkout(200, "11/10/2021")

        // Then
        expect(account.balance()).to.equal(-50);
    });
    it('should return all the transactions made on the account', function () {
        // Given

        const account = bank.getAccountByNumber("12345");

        // When
        account.deposit(350, "10/10/2021")
        account.checkout(200, "12/10/2021")
        account.checkout(100, "01/11/2021")

        // Then
        expect(account.transactionList()).to.deep.equal([
            {
                "amount": 350,
                "balance": 350,
                "date": "10/10/2021"
            },
            {
                "amount": -200,
                "balance": 150,
                "date": "12/10/2021"
            },
            {
                "amount": -100,
                "balance": 50,
                "date": "01/11/2021"
            }
        ]);
    });
})
