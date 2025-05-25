import axios from 'axios';
import { TMDB_API_KEY, TMDB_URL } from './config';
import { type TmdbTvSearchResponse } from './types';

export const searchForTvShow = async (identifier: string): Promise<unknown> => {
  if (!TMDB_API_KEY) return null;

  const uri = new URL(TMDB_URL);
  uri.pathname += '/search/tv';
  uri.search = new URLSearchParams({
    language: 'en-US',
    page: '1',
    query: identifier,
  }).toString();

  const result = await axios.get<TmdbTvSearchResponse>(uri.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  });

  return result;
};
