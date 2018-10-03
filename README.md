# Floodgates

> "OPEN THE FLOODGATES!" CLI to Help Manage Git Flow and Releases

## Prerequisites

* Node LTS
* NPM or yarn

## Installation

1. `npm install -g floodgates` or `yarn global add floodgates`

## Usage

```text
usage: floodgates [<args>] [<options>]

Commands:
  floodgates prepare  create release branch, update package and changelog
  floodgates release  merge release branch and publish package to NPM and Github

Options:
  -M, --major    Prepare a major release (x.0.0)                       [boolean]
  -m, --minor    Prepare a minor release (0.x.0)                       [boolean]
  -p, --patch    Prepare a patch release (0.0.x)                       [boolean]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```

## Development

1. `yarn install`
2. `yarn run build`
