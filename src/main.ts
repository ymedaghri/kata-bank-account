import { init, start } from "./server";
import {Bank} from "./Bank";

const bankApplication = new Bank()
init(bankApplication).then(() => start());
