import { FfprobeStream } from 'fluent-ffmpeg';

/**
 * Gets whether the stream is at least 1080p high or 1920p across
 * @returns `true` if HD, `false` if not HD, or `undefined` if the resolution couldn't be detected
 */
export const isStreamHD = (stream: FfprobeStream | undefined) => {
  if (!stream) return undefined;

  if (stream.width === undefined && stream.height === undefined) {
    return undefined;
  }

  if (stream.width !== undefined && stream.width >= 1920) {
    return true;
  } else if (stream.height !== undefined && stream.height >= 1080) {
    return true;
  } else {
    return false;
  }
};

export const getHighestResolutionStream = (streams: FfprobeStream[]) =>
  streams.reduce<FfprobeStream | undefined>((best, current) => {
    if (!best) {
      return current;
    }

    const { width: bestWidth, height: bestHeight } = best;
    const { width: curWidth, height: curHeight } = current;

    if (curWidth === undefined && curHeight === undefined) {
      // Both dimensions missing - cannot be better that best so far
      return best;
    } else if (curWidth === undefined || curHeight === undefined) {
      // Missing one of the 2 dimensions
      if (bestWidth === undefined && bestHeight === undefined) {
        // Best is missing both dimensions, but current is only missing 1. Assume current is better
        return current;
      } else if (bestWidth === undefined || bestHeight === undefined) {
        // Both only have 1 dimension. Keep the higher value
        const sSize = curWidth ?? curHeight ?? 0;
        const bestSize = bestWidth ?? bestHeight ?? 0;

        if (sSize > bestSize) {
          return current;
        } else {
          return best;
        }
      } else {
        // Best has both dimensions, but current only has 1. Assume best is better
        return best;
      }
    } else if (bestWidth === undefined || bestHeight === undefined) {
      // Current has both dimensions, but best is missing at least 1. Assume best is better
      return current;
    }

    const curSize = curHeight * curWidth;
    const bestSize = bestHeight * bestWidth;

    if (curSize > bestSize) {
      return current;
    } else {
      return best;
    }
  }, undefined);
