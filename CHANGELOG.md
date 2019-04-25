# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.3.1](https://github.com/cfware/debouncer/compare/v0.3.0...v0.3.1) (2019-04-25)


### Bug Fixes

* Drop node.js 6 from testing ([c33aca5](https://github.com/cfware/debouncer/commit/c33aca5))



# [0.3.0](https://github.com/cfware/debouncer/compare/v0.2.2...v0.3.0) (2019-03-13)


### Features

* Use default instead of named export. ([d4d2976](https://github.com/cfware/debouncer/commit/d4d2976))


### BREAKING CHANGES

* This module no longer has a named export `Debouncer`,
it is now the default export so terser can rename it.



## [0.2.2](https://github.com/cfware/debouncer/compare/v0.2.1...v0.2.2) (2019-03-13)


### Bug Fixes

* Remove babel.config.js from package ([f1a6d2b](https://github.com/cfware/debouncer/commit/f1a6d2b))


### Features

* Add immediately optional argument to debouncer.run. ([fa0b875](https://github.com/cfware/debouncer/commit/fa0b875))



## [0.2.1](https://github.com/cfware/debouncer/compare/v0.2.0...v0.2.1) (2019-03-12)


### Bug Fixes

* Rename undocumented delay and maxDelays properties to be private. ([76634c3](https://github.com/cfware/debouncer/commit/76634c3))
