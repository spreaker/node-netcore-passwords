const crypto         = require("crypto");
const HEADER_SIZE_V2 = 1;
const HEADER_SIZE_V3 = 13;
const SALT_SIZE      = 16;
const KEY_SIZE       = 32;
const ITERATIONS_V2  = 1000;
const ITERATIONS_V3  = 10000;
const ALGORITHM_V2   = "SHA1";
const ALGORITHM_V3   = "SHA256";

function hashV2 (passwordBytes) {

    return new Promise((resolve, reject) => {

        // Generate salt
        let salt = Buffer.alloc(SALT_SIZE);
        crypto.randomFillSync(salt);

        // Generate key
        crypto.pbkdf2(passwordBytes, salt, ITERATIONS_V2, KEY_SIZE, ALGORITHM_V2, (err, derivedKey) => {

            if (err) {
                return reject(err);
            }

            // Generate final buffer
            let result = Buffer.alloc(HEADER_SIZE_V2 + SALT_SIZE + KEY_SIZE);
            result.writeInt8(0);                                    // v2 format
            salt.copy(result, HEADER_SIZE_V2);                      // Salt
            derivedKey.copy(result, HEADER_SIZE_V2 + SALT_SIZE);    // Derived key

            resolve(result.toString("base64"));
        });

    });
}

function hashV3 (passwordBytes) {

    return new Promise((resolve, reject) => {

        // Generate salt
        let salt = Buffer.alloc(SALT_SIZE);
        crypto.randomFillSync(salt);

        // Generate key
        crypto.pbkdf2(passwordBytes, salt, ITERATIONS_V3, KEY_SIZE, ALGORITHM_V3, (err, derivedKey) => {

            if (err) {
                return reject(err);
            }

            // Generate final buffer
            let result = Buffer.alloc(HEADER_SIZE_V3 + SALT_SIZE + KEY_SIZE);
            result.writeInt8(1);                                    // v3 format
            result.writeUInt32BE(1, 1);                             // HMAC SHA256
            result.writeUInt32BE(ITERATIONS_V3, 5);                 // Iterations
            result.writeUInt32BE(SALT_SIZE, 9);                     // Salt size
            salt.copy(result, HEADER_SIZE_V3);                      // Salt
            derivedKey.copy(result, HEADER_SIZE_V3 + SALT_SIZE);    // Derived key

            resolve(result.toString("base64"));
        });

    });
}

function verifyV2 (passwordBytes, hashedPasswordBytes) {

    return new Promise((resolve, reject) => {

        // Extract salt
        const salt = Buffer.alloc(SALT_SIZE);
        if (hashedPasswordBytes.copy(salt, 0, HEADER_SIZE_V2) != SALT_SIZE) {
            return resolve(false);
        }

        // Extract key
        const key = Buffer.alloc(KEY_SIZE);
        if (hashedPasswordBytes.copy(key, 0, HEADER_SIZE_V2 + SALT_SIZE, HEADER_SIZE_V2 + SALT_SIZE + KEY_SIZE) != KEY_SIZE) {
            return resolve(false);
        }

        // Generate key and verify
        crypto.pbkdf2(passwordBytes, salt, ITERATIONS_V2, KEY_SIZE, ALGORITHM_V2, (err, derivedKey) => {

            if (err) {
                return reject(err);
            }

            resolve(derivedKey.equals(key));
        });
    });
}

function verifyV3 (passwordBytes, hashedPasswordBytes) {

    return new Promise((resolve, reject) => {

        // Extract salt size
        const saltSize = hashedPasswordBytes.readUInt32BE(9);
        if (saltSize < SALT_SIZE) {
            return resolve(false);
        }

        const iterations = hashedPasswordBytes.readUInt32BE(5);
        const salt       = Buffer.alloc(saltSize);
        const key        = Buffer.alloc(KEY_SIZE);

        // Extract salt
        if (hashedPasswordBytes.copy(salt, 0, HEADER_SIZE_V3, HEADER_SIZE_V3 + saltSize) != saltSize) {
            return resolve(false);
        }

        // Extract key
        if (hashedPasswordBytes.copy(key, 0, HEADER_SIZE_V3 + saltSize, HEADER_SIZE_V3 + saltSize + KEY_SIZE) != KEY_SIZE) {
            return resolve(false);
        }

        // Generate key and verify
        crypto.pbkdf2(passwordBytes, salt, iterations, KEY_SIZE, ALGORITHM_V3, (err, derivedKey) => {

            if (err) {
                return reject(err);
            }

            resolve(derivedKey.equals(key));
        });
    });
}

function hash (password, options, callback) {

    /*
     * Accept callback passed as second parameter and no options
     */
    if (typeof options === 'function') {
        callback = options;
        options  = undefined;
    }

    options = options || {};

    let promise = null;

    switch (options.version || 3) {
        case 2:
            promise = hashV2(new Buffer(password), callback);
            break;
        case 3:
            promise = hashV3(new Buffer(password), callback);
            break;
        default:
            promise = Promise.reject(new Error("Version not supported"));
    }

    return callback ? promise
        .then((r) => { callback(undefined, r) })
        .catch((e) => { callback(e) }) :
        promise;
}

function verify (password, hashedPassword, callback) {

    if (!password || !hashedPassword) {
        return callback ? callback(null, false) : Promise.resolve(false);
    }

    const passwordBytes = new Buffer(password);
    const hashedPasswordBytes = new Buffer(hashedPassword, "base64");

    const version = hashedPasswordBytes.readUInt8(0) === 0 ? 2 :
        (hashedPasswordBytes.readUInt8(0) === 1 ? 3 : 0);

    let promise = null;

    switch (version) {
        case 2:
            promise = verifyV2(passwordBytes, hashedPasswordBytes);
            break;
        case 3:
            promise = verifyV3(passwordBytes, hashedPasswordBytes);
            break;
        default:
            promise = Promise.resolve(false);
            break;
    }

    return callback ? promise
        .then((r) => { callback(undefined, r) })
        .catch((e) => { callback(e) }) :
        promise;
}

module.exports = {
    hash: hash,
    verify: verify
}
