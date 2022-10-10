# Server Admin CLI

Template project for a Typescript app designed to run on node 16

[![Actions Status](https://github.com/MarkSFrancis/server-admin-cli/workflows/Build/badge.svg)](https://github.com/MarkSFrancis/server-admin-cli/actions)

This project uses [commander.js](https://github.com/tj/commander.js/) to enable the command line parsing

## Prerequisites

- NodeJS
- yarn

## Secrets

Some commands require secrets to be able to run. You can set these by a config file or environment variables. If you set both, the config file takes precedence

For themoviedb.org, make sure to use a [v4 auth bearer token](https://developers.themoviedb.org/3/getting-started/authentication#bearer-token) in your config

### Using a config file

You'll need to create a `.env` file at the root of this project, then set your API keys within it.

Here's an example with the TMDB_API_KEY set:

```
TMDB_API_KEY=your_api_key_here
```

### Using environment variables

You can also use environment variables.

Here's an example with all keys set using bash:

```sh
export TMDB_API_KEY=your_api_key_here
```

If you use both, the config file will override your environment variables

## Getting Started

```sh
yarn install
yarn start --help
```

### Recommended Keys

These resources are not required, and you can use as many or as few as you'd like.  
Each one enhances this tool, but for most commands, you won't need them. Run `--help` at the end of the command you want to find out which keys it might need

- themoviedb.org API key (identifies the episode's title and other metadata). This is a [secret](#secrets), `TMDB_API_KEY`
