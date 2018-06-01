var passwords = require("./passwords");

describe("Passwords", () => {

    describe("verify", () => {

        it("should work with the same password hashed by the library", () => {

            expect(passwords.verify("FOOBAR", passwords.hash("FOOBAR")))
                .toBe(true);
        });
    });
});