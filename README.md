# Node.js .NET Core compatibile passwords

This library provides Node.js compatibility with .NET Core Identity framework. If you're migrating a .NET Core application to Node.js, or if you need to share the same users database, this library is here to help.

### Install

`npm install netcore-password`

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
if (p.verify('clearTextPassword', 'hash')) {
    console.log("PASSWORD MATCH");
} else {
    console.log("PASSWORD DOESN'T MATCH");
}
```

### Run test suite

`npm run tests`

### License

MIT
