
# npm-clone

Clone a node module(, install its dependencies (and run its tests)).

## Usage

```bash
# clone a node module
npm-clone periodic

# clone using its private url
npm-clone --ssh periodic
npm-clone --https periodic

# clone and install dependencies
npm-clone install periodic

# clone, install dependencies and run its tests
npm-clone install test periodic

# with a short form
npm-clone all periodic

# flags still apply
npm-clone --ssh all periodic
```

## Installation

With [npm](https://npmjs.org/) do:

```bash
npm install -g npm-clone
```

## License

The MIT license.
