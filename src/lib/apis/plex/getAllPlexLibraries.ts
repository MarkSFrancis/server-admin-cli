import { getPlexToken, plexClient } from './plexClient';

export const getAllPlexLibraries = async () => {
  const queryString = new URLSearchParams({
    X_Plex_Token: getPlexToken(),
  });

  const result = await plexClient.get(
    `/library/sections?${queryString.toString()}`
  );

  return result;
};
