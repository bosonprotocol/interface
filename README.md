[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

<h2 align="center">Boson Protocol dApp</h2>

<a href="">![](https://img.shields.io/badge/license-Apache--2.0-brightgreen?style=flat-square)</a>
<a href="https://discord.com/invite/QSdtKRaap6">![](https://img.shields.io/badge/Chat%20on-Discord-%235766f2?style=flat-square)</a>
<a href="https://twitter.com/BosonProtocol">![](https://img.shields.io/twitter/follow/BosonProtocol?style=social)</a>

</div align="center">

<div align="center">

🛠️ ** The official dApp built on top of [Boson Protocol](https://bosonprotocol.io).**

[![codecov](https://codecov.io/gh/bosonprotocol/interface/branch/main/graph/badge.svg?token=X52bEA3Bf6)](https://codecov.io/gh/bosonprotocol/interface)


<a href="https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml">[![Build Status](https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml)</a>

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