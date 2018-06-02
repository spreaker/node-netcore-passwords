var passwords = require("./passwords");

describe("Passwords", () => {

    describe("hash", () => {

        it("should generate a password that can be verified (default)", () => {
            expect(passwords.verify("FOOBAR", passwords.hash("FOOBAR")))
                .toBe(true);
        });

        it("should generate a password that can be verified (v3)", () => {
            expect(passwords.verify("FOOBAR", passwords.hash("FOOBAR", { version: 3 })))
                .toBe(true);
        });

        it("should generate a password that can be verified (v2)", () => {
            expect(passwords.verify("FOOBAR", passwords.hash("FOOBAR", { version: 2 })))
                .toBe(true);
        });
    });

    describe("verify", () => {

        it("should return true when there is a match (V2)", () => {
            expect(passwords.verify("qqqqqq",
                "AKiAkSGL2icPJ5Pfbn/0eKMdq4bQR71um2GHXsiU2uCLiA3lls3vzvl+9ovGynQy2g=="))
                .toBe(true);
        });

        it("should return false when there is no match (V2)", () => {
            expect(passwords.verify("aaaaaa",
                "AKiAkSGL2icPJ5Pfbn/0eKMdq4bQR71um2GHXsiU2uCLiA3lls3vzvl+9ovGynQy2g=="))
                .toBe(false);
        });

        it("should return true when there is a match (V3)", () => {
            expect(passwords.verify("qqqqqq",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA=="))
                .toBe(true);
        });

        it("should return false when there is no match (V3)", () => {
            expect(passwords.verify("aaaaaa",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA=="))
                .toBe(false);
        });

        it("should return false when salt size is too small (V3)", () => {
            expect(passwords.verify("qqqqqq",
                "AQAAAAEAACcQAAAAAV8q0/quenQ7V+jfUZfndcBHN3rfnK1XlbdgLIJ/0fAsfpG5xC2HomtN27P0Q466rQ=="))
                .toBe(false);
        });

        it("should return false when the hash doesn't make sense", () => {
            expect(passwords.verify("qqqqqq",null))
                .toBe(false);
            expect(passwords.verify("qqqqqq",""))
                .toBe(false);
            expect(passwords.verify("qqqqqq","foobar"))
                .toBe(false);
        });
    });
});