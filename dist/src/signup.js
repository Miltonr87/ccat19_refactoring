"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const express_1 = __importDefault(require("express"));
const validateCpf_1 = require("./validateCpf");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = req.body;
        const connection = (0, pg_promise_1.default)()("postgres://postgres:123456@localhost:5432/app");
        try {
            const id = crypto_1.default.randomUUID();
            let result;
            const [acc] = yield connection.query("select * from ccca.account where email = $1", [input.email]);
            if (!acc) {
                if (input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
                    if (input.email.match(/^(.+)@(.+)$/)) {
                        if ((0, validateCpf_1.validateCpf)(input.cpf)) {
                            if (input.isDriver) {
                                if (input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
                                    yield connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
                                    const obj = {
                                        accountId: id
                                    };
                                    result = obj;
                                }
                                else {
                                    // invalid car plate
                                    result = -5;
                                }
                            }
                            else {
                                yield connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
                                const obj = {
                                    accountId: id
                                };
                                result = obj;
                            }
                        }
                        else {
                            // invalid cpf
                            result = -1;
                        }
                    }
                    else {
                        // invalid email
                        result = -2;
                    }
                }
                else {
                    // invalid name
                    result = -3;
                }
            }
            else {
                // already exists
                result = -4;
            }
            if (typeof result === "number") {
                res.status(422).json({ message: result });
            }
            else {
                res.json(result);
            }
        }
        finally {
            yield connection.$pool.end();
        }
    });
});
app.listen(3000);
