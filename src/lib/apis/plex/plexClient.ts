import axios from 'axios'

export const getPlexUrl = () => {
  const url = process.env.SERVER_ADMIN_CLI_PLEX_URL

  if (!url) {
    throw new Error('Plex URL not found in environment variables')
  }

  return url
}

export const getPlexToken = () => {
  const token = process.env.SERVER_ADMIN_CLI_PLEX_TOKEN

  if (!token) {
    throw new Error('Plex token not found in environment variables')
  }

  return token
}

export const plexClient = axios.create({
  baseURL: getPlexUrl(),
})
