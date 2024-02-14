# Discord Bot Faucet

This is a Discord Bot that dispenses Testnet ETH written in TypeScript.

![CodeSample1](https://i.imgur.com/AYpndSV.png)

![CodeSample2](https://i.imgur.com/ll8qLX7.png)

## Setup

Edit `config.json` and fill in the required fields.

Create a file called `.env` and paste in the following lines. Make sure to fill it out with your details

```env
WALLET_PRIVATE_KEY="<wallet-private-key>"
BOT_TOKEN="<bot-token>"
```

## Installation

1. If you do not have pnpm, run `npm i -g pnpm@7`.

2. Install Dependencies using `pnpm install`.

    _Optionally you can update the dependencies using `pnpm update`._

3. Fill in the config and run the bot : `pnpm start:dev`

### Running with Docker

The bot can also be run with Docker:

```sh
docker built --tag discord-bot-faucet .
docker run --detach --env BOT_TOKEN --env WALLET_PRIVATE_KEY discord-bot-faucet
```

Alternatively, it is also possible to read the environment variables from the `.env` file:

```sh
docker run --detach --env-file=.env discord-bot-faucet
```

## Adding Networks or Tokens

Adding Networks is fairly straightforward.

1. Open up the `config.json`.
2. Add a network Object in the `networks` field
   ex :

    ```json
    {
    	"name": "networkName",
    	"nativeCurrency": "kool",
    	"RPC_URL": "https://rpc-url/xxx",
    	"scan": "https://myscan.kool.io"
    }
    ```

## Inspired by

-   [DJS - Reconlx](https://github.com/reconlx/djs-typescript-handler)
-   [Typescript Faucet Template - AlanRacciatti](https://github.com/AlanRacciatti/FaucetDiscordBot)
-   [Discord Bot Template - KevinNovak](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template)
