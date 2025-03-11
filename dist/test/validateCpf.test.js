"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateCpf_1 = require("../src/validateCpf");
test.each([
    "97456321558",
    "974.563.215-58",
    "71428793860",
    "87748248800"
])("Deve validar o cpf %s", function (cpf) {
    const isValid = (0, validateCpf_1.validateCpf)(cpf);
    expect(isValid).toBe(true);
});
test.each([
    null,
    undefined,
    "",
    "11111111111"
])("Não deve validar o cpf %s", function (cpf) {
    const isValid = (0, validateCpf_1.validateCpf)(cpf);
    expect(isValid).toBe(false);
});
