# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2018-06-02

- **BREAKING:** Converted to async. The key derivation operation is very costly and moving to async will reduce the pressure on the main loop. The library supports  callbacks, promises, and `async/await`

## [1.1.0] - 2018-06-02

- **ADDED:** Support for Version 2 hashes, both generation and verifications

## [1.0.1] - 2018-06-01

- **BUGFIX:** Dependencies are now correctly declared as `devDependencies`

## [1.0.0] - 2018-06-01

- Initial release