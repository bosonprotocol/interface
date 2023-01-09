[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

<h2 align="center">Boson Protocol dApp</h2>

<div align="center">

<a href="">![](https://img.shields.io/badge/license-Apache--2.0-brightgreen?style=flat-square)</a>
<a href="https://discord.com/invite/QSdtKRaap6">![](https://img.shields.io/badge/Chat%20on-Discord-%235766f2?style=flat-square)</a>
<a href="https://twitter.com/BosonProtocol">![](https://img.shields.io/twitter/follow/BosonProtocol?style=social)</a>



<a href="https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml">[![Build Status](https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/bosonprotocol/interface/actions/workflows/ci.yaml)</a>

</div>

<div align="center">

🛠️ **The official dApp built on top of [Boson Protocol](https://bosonprotocol.io).**

</div>

## Environments

Each deployment is hosted on IPFS with a custom domain.

For ease of use, each environment has a DNS name that always points to the latest IPFS hash: 

| Env          | Network   | Endpoint                                                        |
| ------------ | --------- | --------------------------------------------------------------- |
| `testing`    | `mumbai` | https://interface-test.on.fleek.co/                             |
| `staging`    | `mumbai` | https://interface-staging.on.fleek.co/                          |
| `production` | `polygon` | https://dapp-interface-production.on.fleek.co/                                                           |

## Local development

### Node & npm

Installing the correct versions of node and npm can be done by installing [`volta`](https://volta.sh/). Volta will automatically get those versions from the package.json file. Once that's done, the required steps to develop and test the dApp interface locally are as follows:

1. Clone the repository: i.e. Run `git clone git@github.com:bosonprotocol/interface.git`
2. Navigate into the directory & install dependencies: i.e. Run `cd interface && npm ci`
3. Copy the `.env.example` file to `.env` and fill out any necessary values.
4. Start the application: i.e. Run `npm run dev`
5. Navigate to `http://localhost:3000/` in a browser.


## Contributing

We welcome contributions! The ultimate goal is for all of the Boson Protocol repositories to be fully owned by the community and contributors. Issues, pull requests, suggestions, and any sort of involvement are more than welcome.

By being in this community, you agree to the [Code of Conduct](/docs/code-of-conduct.md). Take a look at it, if you haven't already.
