const crypto         = require("crypto");
const HEADER_SIZE_V2 = 1;
const HEADER_SIZE_V3 = 13;
const SALT_SIZE      = 16;
const KEY_SIZE       = 32;
const ITERATIONS_V2  = 1000;
const ITERATIONS_V3  = 10000;
const ALGORITHM_V2   = "SHA1";
const ALGORITHM_V3   = "SHA256";

function hashV2 (password) {

    // Generate salt
    let salt = Buffer.alloc(SALT_SIZE);
    crypto.randomFillSync(salt);

    // Generate key
    let derivedKey = crypto.pbkdf2Sync(
        new Buffer(password), salt, ITERATIONS_V2, KEY_SIZE, ALGORITHM_V2);

    // Generate final buffer
    let result = Buffer.alloc(HEADER_SIZE_V2 + SALT_SIZE + KEY_SIZE);
    result.writeInt8(0);                                    // v2 format
    salt.copy(result, HEADER_SIZE_V2);                      // Salt
    derivedKey.copy(result, HEADER_SIZE_V2 + SALT_SIZE);    // Derived key

    return result.toString("base64");
}

function hashV3 (password) {

    // Generate salt
    let salt = Buffer.alloc(SALT_SIZE);
    crypto.randomFillSync(salt);

    // Generate key
    let derivedKey = crypto.pbkdf2Sync(
        new Buffer(password), salt, ITERATIONS_V3, KEY_SIZE, ALGORITHM_V3);

    // Generate final buffer
    let result = Buffer.alloc(HEADER_SIZE_V3 + SALT_SIZE + KEY_SIZE);
    result.writeInt8(1);                                    // v3 format
    result.writeUInt32BE(1, 1);                             // HMAC SHA256
    result.writeUInt32BE(ITERATIONS_V3, 5);                 // Iterations
    result.writeUInt32BE(SALT_SIZE, 9);                     // Salt size
    salt.copy(result, HEADER_SIZE_V3);                      // Salt
    derivedKey.copy(result, HEADER_SIZE_V3 + SALT_SIZE);    // Derived key

    return result.toString("base64");

}

function hash (password, options) {

    options = options || {};
    const version = options.version || 3;

    switch (version) {
        case 2:
            return hashV2(password);
        case 3:
            return hashV3(password);
        default:
            throw new Error("Version not supported");
    }
}

function verifyV2 (passwordBytes, hashedPasswordBytes) {

    // Extract salt
    const salt = Buffer.alloc(SALT_SIZE);
    if (hashedPasswordBytes.copy(salt, 0, HEADER_SIZE_V2) != SALT_SIZE) {
        return false;
    }

    // Extract key
    const key = Buffer.alloc(KEY_SIZE);
    if (hashedPasswordBytes.copy(key, 0, HEADER_SIZE_V2 + SALT_SIZE, HEADER_SIZE_V2 + SALT_SIZE + KEY_SIZE) != KEY_SIZE) {
        return false;
    }

    // Create derived key
    var derivedKey = crypto.pbkdf2Sync(
        passwordBytes, salt, ITERATIONS_V2, KEY_SIZE, ALGORITHM_V2);

    return derivedKey.equals(key);
}

function verifyV3 (passwordBytes, hashedPasswordBytes) {

    // Extract salt size
    const saltSize = hashedPasswordBytes.readUInt32BE(9);
    if (saltSize < SALT_SIZE) {
        return false;
    }

    const iterations = hashedPasswordBytes.readUInt32BE(5);
    const salt       = Buffer.alloc(saltSize);
    const key        = Buffer.alloc(KEY_SIZE);

    // Extract salt
    if (hashedPasswordBytes.copy(salt, 0, HEADER_SIZE_V3, HEADER_SIZE_V3 + saltSize) != saltSize) {
        return false;
    }

    // Extract key
    if (hashedPasswordBytes.copy(key, 0, HEADER_SIZE_V3 + saltSize, HEADER_SIZE_V3 + saltSize + KEY_SIZE) != KEY_SIZE) {
        return false;
    }

    // Create derived key
    var derivedKey = crypto.pbkdf2Sync(
        passwordBytes, salt, iterations, KEY_SIZE, ALGORITHM_V3);

    return derivedKey.equals(key);
}

function verify (password, hashedPassword) {

    if (!password || !hashedPassword) {
        return false;
    }

    const passwordBytes = new Buffer(password);
    const hashedPasswordBytes = new Buffer(hashedPassword, "base64");

    const version = hashedPasswordBytes.readUInt8(0) === 0 ? 2 :
        (hashedPasswordBytes.readUInt8(0) === 1 ? 3 : 0);

    switch (version) {
        case 2:
            return verifyV2(passwordBytes, hashedPasswordBytes);
        case 3:
            return verifyV3(passwordBytes, hashedPasswordBytes);
        default:
            return false;
    }
}

module.exports = {
    hash: hash,
    verify: verify
}
