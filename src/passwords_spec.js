var passwords = require("./passwords");

describe("Passwords", () => {

    describe("hash - callback", () => {

        it("should generate a password that can be verified (default)", (done) => {
            passwords.hash("FOOBAR", (err, result) => {
                expect(err).toBeFalsy();
                passwords.verify("FOOBAR", result, (err, valid) => {
                    expect(valid).toBe(true);
                    done();
                });
            });
        });

        it("should generate a password that can be verified (v3)", (done) => {
            passwords.hash("FOOBAR", { version: 3 }, (err, result) => {
                expect(err).toBeFalsy();
                passwords.verify("FOOBAR", result, (err, valid) => {
                    expect(valid).toBe(true);
                    done();
                });
            });
        });

        it("should generate a password that can be verified (v2)", (done) => {
            passwords.hash("FOOBAR", { version: 2 }, (err, result) => {
                expect(err).toBeFalsy();
                passwords.verify("FOOBAR", result, (err, valid) => {
                    expect(valid).toBe(true);
                    done();
                });
            });
        });
    });

    describe("hash - promise", () => {

        it("should generate a password that can be verified (default)", (done) => {
            passwords.hash("FOOBAR").then((result) => {
                passwords.verify("FOOBAR", result).then((valid) => {
                    expect(valid).toBe(true);
                    done();
                });
            });
        });

        it("should generate a password that can be verified (v3)", (done) => {
            passwords.hash("FOOBAR", { version: 3 }).then((result) => {
                passwords.verify("FOOBAR", result).then((valid) => {
                    expect(valid).toBe(true);
                    done();
                });
            });
        });

        it("should generate a password that can be verified (v2)", (done) => {
            passwords.hash("FOOBAR", { version: 2 }).then((result) => {
                passwords.verify("FOOBAR", result).then((valid) => {
                    expect(valid).toBe(true);
                    done();
                });
            });
        });
    });

    describe("verify - async", () => {

        it("should return true when there is a match (V2)", (done) => {
            passwords.verify("qqqqqq",
                "AKiAkSGL2icPJ5Pfbn/0eKMdq4bQR71um2GHXsiU2uCLiA3lls3vzvl+9ovGynQy2g==",
                (err, valid) => {
                    expect(err).toBeFalsy();
                    expect(valid).toBe(true);
                    done();
                }
            );
        });

        it("should return false when there is no match (V2)", (done) => {
            passwords.verify("aaaaaa",
                "AKiAkSGL2icPJ5Pfbn/0eKMdq4bQR71um2GHXsiU2uCLiA3lls3vzvl+9ovGynQy2g==",
                (err, valid) => {
                    expect(err).toBeFalsy();
                    expect(valid).toBe(false);
                    done();
                }
            );
        });

        it("should return true when there is a match (V3)", (done) => {
            passwords.verify("qqqqqq",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA==",
                (err, valid) => {
                    expect(err).toBeFalsy();
                    expect(valid).toBe(true);
                    done();
                }
            );
        });

        it("should return false when there is no match (V3)", (done) => {

            passwords.verify("aaaaaa",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA==",
                (err, valid) => {
                    expect(err).toBeFalsy();
                    expect(valid).toBe(false);
                    done();
                }
            );
        });

        it("should return false when salt size is too small (V3)", (done) => {

            passwords.verify("aaaaaa",
                "AQAAAAEAACcQAAAAAV8q0/quenQ7V+jfUZfndcBHN3rfnK1XlbdgLIJ/0fAsfpG5xC2HomtN27P0Q466rQ==",
                (err, valid) => {
                    expect(err).toBeFalsy();
                    expect(valid).toBe(false);
                    done();
                }
            );
        });
    });

    describe("verify - promise", () => {

        it("should return true when there is a match (V2)", (done) => {
            passwords.verify("qqqqqq",
                "AKiAkSGL2icPJ5Pfbn/0eKMdq4bQR71um2GHXsiU2uCLiA3lls3vzvl+9ovGynQy2g==")
                .then((valid) => {
                    expect(valid).toBe(true);
                    done();
                }
            );
        });

        it("should return false when there is no match (V2)", (done) => {
            passwords.verify("aaaaaa",
                "AKiAkSGL2icPJ5Pfbn/0eKMdq4bQR71um2GHXsiU2uCLiA3lls3vzvl+9ovGynQy2g==")
                .then((valid) => {
                    expect(valid).toBe(false);
                    done();
                }
            );
        });

        it("should return true when there is a match (V3)", (done) => {
            passwords.verify("qqqqqq",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA==")
                .then((valid) => {
                    expect(valid).toBe(true);
                    done();
                }
            );
        });

        it("should return false when there is no match (V3)", (done) => {

            passwords.verify("aaaaaa",
                "AQAAAAEAACcQAAAAEJPe46k2ujUyQqFeSbME49vn+X7Mk1F1HH65w6rHc/gozE94JLP70KZNKOa48cINwA==")
                .then((valid) => {
                    expect(valid).toBe(false);
                    done();
                }
            );
        });

        it("should return false when salt size is too small (V3)", (done) => {

            passwords.verify("aaaaaa",
                "AQAAAAEAACcQAAAAAV8q0/quenQ7V+jfUZfndcBHN3rfnK1XlbdgLIJ/0fAsfpG5xC2HomtN27P0Q466rQ==")
                .then((valid) => {
                    expect(valid).toBe(false);
                    done();
                }
            );
        });
    });
});