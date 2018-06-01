var passwords = require("./passwords");

describe("Passwords", () => {

    describe("hash", () => {

        it("should generate a password that can be verified", () => {
            expect(passwords.verify("FOOBAR", passwords.hash("FOOBAR")))
                .toBe(true);
        });
    });

    describe("verify", () => {

        it("should return true when there is a match", () => {
            expect(passwords.verify("qqqqqq",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA=="))
                .toBe(true);
        });

        it("should return false when there is no match", () => {
            expect(passwords.verify("aaaaaa",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA=="))
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

        it("should return false when the hash is not version 3", () => {
            expect(passwords.verify("qqqqqq",
                "AAAAAAEAACcQAAAAEG7GhjinOTJzAB4rkwPqsKpMrscTkwv/HEoyFCA/MLEvyR1wpZ8o1RCCyjsv/6ggtg=="))
                .toBe(false);
        });

        it("should return false when salt size is too small", () => {
            expect(passwords.verify("qqqqqq",
                "AQAAAAEAACcQAAAAAV8q0/quenQ7V+jfUZfndcBHN3rfnK1XlbdgLIJ/0fAsfpG5xC2HomtN27P0Q466rQ=="))
                .toBe(false);
        });
    });
});