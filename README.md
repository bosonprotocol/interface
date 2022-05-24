# Boson Protocol dApp

<a href="https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml">[![Build Status](https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml)</a>
![](https://img.shields.io/badge/Coverage-9%25-733B27.svg?prefix=$coverage$)


| Env          | Network   | Endpoint                                                        |
| ------------ | --------- | --------------------------------------------------------------- |
| `testing`    | `ropsten` | https://interface-test.on.fleek.co/                             |
| `staging`    | `ropsten` | https://interface-staging.on.fleek.co/                          |
| `production` | `mainnet` | `TBD`                                                           |

## Local development

The required steps to develop and test the dApp interface locally are as follows:

1. Clone the repository: i.e. Run `git clone git@github.com:bosonprotocol/interface.git`
2. Navigate into the directory & install dependencies: i.e. Run `cd interface && npm ci`
3. Copy the `.env.example` file to `.env` and fill out any necessary values.
4. Start the application: i.e. Run `npm run dev`
5. Navigate to `http://localhost:3000/` in a browser.

## Running the tests

### E2E

Ensure Playwright browsers need to be installed on your system:

```bash
npx playwright install
```

Run the tests:
```bash
npm run test:e2e
```

### Unit & Integration

Run the tests:
```bash
npm run test
```