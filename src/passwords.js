const crypto      = require("crypto");
const HEADER_SIZE = 13;
const SALT_SIZE   = 16;
const KEY_SIZE    = 32;
const ITERATIONS  = 10000;
const ALGORITHM   = "SHA256";

function hash (password) {

    // Generate salt
    let salt = Buffer.alloc(SALT_SIZE);
    crypto.randomFillSync(salt);

    // Generate key
    let derivedKey = crypto.pbkdf2Sync(
        new Buffer(password), salt, ITERATIONS, KEY_SIZE, ALGORITHM);

    // Generate final buffer
    let result = Buffer.alloc(HEADER_SIZE + SALT_SIZE + KEY_SIZE);
    result.writeInt8(1);                                // v3 format
    result.writeUInt32BE(1, 1);                         // HMAC SHA256
    result.writeUInt32BE(ITERATIONS, 5);                // Iterations
    result.writeUInt32BE(SALT_SIZE, 9);                 // Salt size
    salt.copy(result, HEADER_SIZE);                     // Salt
    derivedKey.copy(result, HEADER_SIZE + SALT_SIZE);   // Derived key

    return result.toString("base64");
}

function verify (password, hashedPassword) {

    if (!password || !hashedPassword) {
        return false;
    }

    const hash = new Buffer(hashedPassword, "base64");

    // Ensure we're working with a "Version 3" hash
    if (hash.readUInt8(0) != 1) {
        return false;
    }

    // Extract salt
    const saltSize = hash.readUInt32BE(9);
    if (saltSize < SALT_SIZE) {
        return false;
    }

    const iterations = hash.readUInt32BE(5);
    const salt       = Buffer.alloc(saltSize);
    const key        = Buffer.alloc(KEY_SIZE);

    // Extract salt
    if (hash.copy(salt, 0, HEADER_SIZE, HEADER_SIZE + saltSize) != saltSize) {
        return false;
    }

    // Extract key
    if (hash.copy(key, 0, HEADER_SIZE + saltSize, HEADER_SIZE + saltSize + KEY_SIZE) != KEY_SIZE) {
        return false;
    }

    // Create derived key
    var derivedKey = crypto.pbkdf2Sync(
        new Buffer(password), salt, iterations, KEY_SIZE, ALGORITHM);

    return derivedKey.equals(key);
}

module.exports = {
    hash: hash,
    verify: verify
}
