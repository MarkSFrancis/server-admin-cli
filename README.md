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

# Commands

## `docs`

Opens the `server-admin-docs` in the browser

## `sum`

Adds a range of numbers together. Used as an example command

## `tv names`

Manages and structures media files in an opinionated way, for use with Plex

This application is expected to be ran in an interactive terminal. It will ask the user questions to help resolve ambigious issues (such as being unable to determine the episode number for a file)

### Recommended Keys

These resources are not required, and you can use as many or as few as you'd like.  
Each one enhances this tool, but for just episode naming (e.g. `E01.mkv`), you won't need them.

- themoviedb.org API key (identifies the episode's title and other metadata). This is a [secret](#secrets), `TMDB_API_KEY`
