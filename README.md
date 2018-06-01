# .NET Core passwords on Node.JS

This library provides Node.js compatibility with .NET Core Identity framework. If you're migrating a .NET Core application to Node.js, or if you need to share the same users database, this library is here to help.

### Compatibility

This library is compatible **ONLY with the Version 3** of the .NET Password Hasher, in it's default configuration.

PBKDF2 with HMAC-SHA256, 128-bit salt, 256-bit subkey, 10000 iterations.

### Install

`npm install netcore-passwords`

### Hash passwords

```
const p = require('netcore-passwords');

// Generate hash
const hash = p.hash('clearTextPassword');
console.log(hash);

// Save this hash into your users database

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

### Run test suite

`npm test`

### License

MIT
