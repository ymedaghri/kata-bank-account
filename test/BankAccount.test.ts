import {expect} from "chai";
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
    it('should retrieve an account balance of zero', function () {
        // Given
        const bobAccount = new BankAccount("12345")
        // When
        // Then
        expect(bobAccount.balance()).to.equal(0);
    });
    it('should make a deposit and retrieve the correct account balance', function () {
        // Given
        const bobAccount = new BankAccount("12345")

        // When
        bobAccount.deposit(150, "10/10/2021")

        // Then
        expect(bobAccount.balance()).to.equal(150);
    });
    it('should make a checkout and retrieve the correct account balance', function () {
        // Given
        const bobAccount = new BankAccount("12345")
        bobAccount.deposit(150, "10/10/2021")
        bobAccount.checkout(200, "11/10/2021")

        // When

        // Then
        expect(bobAccount.balance()).to.equal(-50);
    });
    it('should return all the transactions made on the account', function () {
        // Given
        const bobAccount = new BankAccount("12345")
        bobAccount.deposit(350, "10/10/2021")
        bobAccount.checkout(200, "12/10/2021")
        bobAccount.checkout(100, "01/11/2021")

        // When

        // Then
        expect(bobAccount.transactionList()).to.deep.equal([
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
