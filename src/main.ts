import { init, start } from './server'
import { BankRepository } from './BankRepository'
import {Bank} from "./Bank";

const bankRepository = new BankRepository()
const bankApplication = new Bank(bankRepository)
init(bankApplication).then(() => start())
