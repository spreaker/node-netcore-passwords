# .NET Core passwords on Node.JS

This library provides Node.js compatibility with .NET Core Identity framework. If you're migrating a .NET Core application to Node.js, or if you need to share the same users database, this library is here to help.

### Compatibility

This library is compatible with both **Version 2** and **Version 3** hashes.

#### Version 2

```
PBKDF2 with HMAC-SHA1, 128-bit salt, 256-bit subkey, 1000 iterations.
Format: { 0x00, salt, subkey }
```

#### Version 3

```
PBKDF2 with HMAC-SHA256, 128-bit salt, 256-bit subkey, 10000 iterations.
Format: { 0x01, prf (UInt32), iter count (UInt32), salt length (UInt32), salt, subkey }
(All UInt32s are stored big-endian.)
```

### Install

`npm install netcore-passwords`

### Hash passwords

#### Default (V3)

```
const p = require('netcore-passwords');

// Generate hash
const hash = p.hash('clearTextPassword');
console.log(hash);
```

#### Using a specific version

```
const p = require('netcore-passwords');

// Generate hash
const hash = p.hash('clearTextPassword', { version: 2 });
console.log(hash);
```

### Verify passwords

```
const p = require('netcore-passwords');

const hash = ''; // Fetch this has from your users database;

// Verify
if (p.verify('clearTextPassword', hash)) {
    console.log("PASSWORD MATCH");
} else {
    console.log("PASSWORD DOESN'T MATCH");
}
```

**NOTE:** you don't need to specify the version when verifying a password. The version is stored in the first byte of the hash, so the library auto-detects it and use the appropriate verification algorithm

### Run test suite

`npm test`

### License

MIT
