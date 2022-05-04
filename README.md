# Boson Protocol dApp

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

## e2e tests

### Prerequisites

Playwright browsers need to be installed on your system
```
npx playwright install
```

### Run e2e tests

```
npm run e2e
```