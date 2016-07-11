# Change Log

All notable changes to this project will be documented in this file.  This
project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0] - 2016-07-07

### Changed

- Basically, all the models now get a new constructor made for them at instantiation time.
- `#create()` model no longer receives a Knex instance.

## [2.6.0] - 2016-05-18

### Fixed

- Made `krypton-orm` a peer dependecy to avoid over-writing Krypton
  functionality.

## [2.5.0] - 2016-05-12

It's all in the SPEC.md file.

### Added

- `#get`
  - Returned Class now has as static properties:
    - `_container`
    - `_modelExtras`
  - Returned Class now has in prototype, in addition to the previously
    available ones, the following:
    - `_knex`

## [2.4.0] - 2016-05-09

It's all in the SPEC.md file.

### Added

- Added `#cleanup` method, which just destroys the Knex version.

## [2.3.0] - 2016-05-03

It's all in the SPEC.md file.

### Changed

- Method `#update` now takes the second parameter (`body`) as optional, so you
  can use `#update` just to save the model to DB.

## [2.2.0] - 2016-04-29

It's all in the SPEC.md file.

### Fixed

- Method `#get` wasn't returning a working model, now it is according to spec.

## [2.1.0] - 2016-04-29

It's all in the SPEC.md file.

### Added

- `#create`, `#update` and `#destroy` methods add `_container` to models now.

## [2.0.0] - 2016-04-29

It's all in the SPEC.md file.

### Added

- `.props` property to DomainContainer.
- `#get` method.

### Changed

- `customProps` has been renamed to `modelExtras`.
- `._modelExtras` now added as a property to model instances, instead of
  extending model with contents of `._modelExtras`.

## [1.0.0] - 2016-04-26

### Added

Initial release.  It's all in the SPEC.md file.

[3.0.0]: https://github.com/greduan/domain-container/commit/131eb94ccd185f39996e0647d754607f13ff6b55
[2.6.0]: https://github.com/greduan/domain-container/tree/a5e6af0ea00388634ca30353d3972166d6568aca
[2.5.0]: https://github.com/greduan/domain-container/tree/c73420f4520c2d0d1eedf8c8298779be9a079a6b
[2.4.0]: https://github.com/greduan/domain-container/tree/f9bb3cfd9ecdfa928380c7070bcc46cf59af30cc
[2.3.0]: https://github.com/greduan/domain-container/tree/6b4cbfc1cb0f5b841759197270304e35fa1ec20e
[2.2.0]: https://github.com/greduan/domain-container/tree/2119cd6652c6df034837a0e980b030d35ded81e8
[2.1.0]: https://github.com/greduan/domain-container/tree/6cd8fbb020b24bd86a4f6df192ab1814b0de544c
[2.0.0]: https://github.com/greduan/domain-container/tree/83fde0835c8db9d2cdcbae07defdb8e0a7e5dbdd
[1.0.0]: https://github.com/greduan/domain-container/tree/e519c8b60fa3bb82513e45f1fb62444eb0ba26c5
