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

### Hashing passwords (Default - Version 3)

```
/*
 * Callback-style
 */ 
passwords.hash("qwerty", (err, hash) => {
	console.log(hash);
})

/*
 * Promise
 */ 
passwords.hash("qwerty").then((hash) => {
	console.log(hash);
})

/*
 * Async / Await
 */
console.log(await passwords.hash("qwerty"));
```

### Hashing passwords (Version 2)

```
/*
 * Callback-style
 */ 
passwords.hash("qwerty", { version: 2 }, (err, hash) => {
	console.log(hash);
})

/*
 * Promise
 */ 
passwords.hash("qwerty", { version: 2 }).then((hash) => {
	console.log(hash);
})

/*
 * Async / Await
 */
console.log(await passwords.hash("qwerty", { version: 2 }));
```

### Verify passwords

```
/*
 * Callback-style
 */
passwords.verify("qwerty", "AQAAAAEAACcQAAAAEFsyb88d2/nTrV2QJ3CG6y8ac3QwYBdnb6SR3LT/rG/SZemrHAoh/MrQmxFrqMey5A==", 
	(err, valid) => { console.log(valid); });

/*
 * Promise
 */
passwords.verify("qwerty", "AQAAAAEAACcQAAAAEFsyb88d2/nTrV2QJ3CG6y8ac3QwYBdnb6SR3LT/rG/SZemrHAoh/MrQmxFrqMey5A==")
	.then((valid) => { console.log(valid); });

/*
 * Async / Await
 */
console.log(await passwords.verify("qwerty", "AQAAAAEAACcQAAAAEFsyb88d2/nTrV2QJ3CG6y8ac3QwYBdnb6SR3LT/rG/SZemrHAoh/MrQmxFrqMey5A=="));

```

**NOTE:** you don't need to specify the version when verifying a password. The version is stored in the first byte of the hash, so the library auto-detects it and use the appropriate verification algorithm

### Run test suite

`npm test`

### License

MIT
