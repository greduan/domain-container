[![NPM](https://nodei.co/npm/domain-container.png)](https://nodei.co/npm/domain-container/)

# DomainContainer

DomainContainer is a tool to help you isolate your different Krypton ORM
environments and anything that the Krypton models may need, also can be used for
storing anything in general.

You just need some reliable way of identifying the different DomainContainer
instances, for example a sub-domain in the URL or something like this.

Check the `SPEC.md` file for detailed use-cases and the reasoning behind this
module.

## Usage

It's all explained in the `SPEC.md` file, check it out.

## Installation

``` text
$ npm i -SE domain-container
```

## Tests

``` text
$ npm i
$ npm run test:once
```

You may need to configure Knex under `test/create-table.js` and
`test/domain-container.js`.  You need Postgres installed.

## Changelog

Check the `CHANGELOG.md` file for the changelog.

## License

Check the `LICENSE` file for licensing details.
