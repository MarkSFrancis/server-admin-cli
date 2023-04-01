# Server Admin CLI

This app is designed to help me to manage my server, via the CLI. It includes multiple commands focused on organising files and configuration

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

Here's an example:

```
SERVER_ADMIN_CLI_TMDB_API_KEY=your_api_key_here
```

### Using environment variables

You can also use environment variables.

Here's an example:

```sh
export SERVER_ADMIN_CLI_TMDB_API_KEY="your_api_key_here"
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

- themoviedb.org API key
  - `SERVER_ADMIN_CLI_TMDB_API_KEY`
  - Identifies the episode's title and other metadata
