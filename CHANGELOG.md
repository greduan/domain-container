# Change Log

All notable changes to this project will be documented in this file.  This
project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2016-04-29

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

[2.1.0]: https://github.com/greduan/domain-container/tree/6cd8fbb020b24bd86a4f6df192ab1814b0de544c
[2.0.0]: https://github.com/greduan/domain-container/tree/83fde0835c8db9d2cdcbae07defdb8e0a7e5dbdd
[1.0.0]: https://github.com/greduan/domain-container/tree/e519c8b60fa3bb82513e45f1fb62444eb0ba26c5
