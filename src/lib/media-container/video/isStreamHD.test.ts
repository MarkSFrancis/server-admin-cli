import { stub } from '@/lib/test-utils/stub';
import { FfprobeStream } from 'fluent-ffmpeg';
import { getHighestResolutionStream, isStreamHD } from './isStreamHD';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('isStreamHD', () => {
  it('should return `true` when stream is 1920x1080', () => {
    const isHD = isStreamHD(
      stub<FfprobeStream>({
        width: 1920,
        height: 1080,
      })
    );

    assert.strictEqual(isHD, true);
  });

  it('should return `true` when stream is 3840x2160', () => {
    const isHD = isStreamHD(
      stub<FfprobeStream>({
        width: 3840,
        height: 2160,
      })
    );

    assert.strictEqual(isHD, true);
  });

  it('should return `true` when stream is 1920x800', () => {
    const isHD = isStreamHD(
      stub<FfprobeStream>({
        width: 1920,
        height: 800,
      })
    );

    assert.strictEqual(isHD, true);
  });

  it('should return `true` when stream is 1920 width but height is unknown', () => {
    const isHD = isStreamHD(
      stub<FfprobeStream>({
        width: 1920,
      })
    );

    assert.strictEqual(isHD, true);
  });

  it('should return `false` when stream is 1280x720', () => {
    const isHD = isStreamHD(
      stub<FfprobeStream>({
        width: 1280,
        height: 720,
      })
    );

    assert.strictEqual(isHD, false);
  });
});

describe('getHighestResolutionStream', () => {
  it('should return `undefined` when there are no streams', () => {
    const bestStream = getHighestResolutionStream([]);

    assert.strictEqual(bestStream, undefined);
  });

  it('should return first stream even if dimensions are unknown when there is only one stream', () => {
    const bestStream = getHighestResolutionStream(stub<FfprobeStream[]>([{}]));

    assert.deepStrictEqual(bestStream, {});
  });

  it('should return first stream that has dimensions, even if dimensions are zero', () => {
    const bestStream = getHighestResolutionStream(
      stub<FfprobeStream[]>([{}, { width: 0, height: 0 }, {}])
    );

    assert.deepStrictEqual(bestStream, { width: 0, height: 0 });
  });

  it('should return first stream that has dimensions', () => {
    const bestStream = getHighestResolutionStream(
      stub<FfprobeStream[]>([{}, { width: 1, height: 1 }, {}])
    );

    assert.deepStrictEqual(bestStream, { width: 1, height: 1 });
  });

  it('should return the stream with as many dimensions as possible, regardless of their value', () => {
    const bestStream = getHighestResolutionStream(
      stub<FfprobeStream[]>([{}, { width: 1, height: 1 }, { width: 3000 }])
    );

    assert.deepStrictEqual(bestStream, { width: 1, height: 1 });
  });

  it('should return the stream with the highest total resolution, even if one dimension is higher in some streams', () => {
    const bestStream = getHighestResolutionStream(
      stub<FfprobeStream[]>([
        { width: 10, height: 10 },
        { width: 50, height: 1 },
        { width: 1, height: 50 },
      ])
    );

    assert.deepStrictEqual(bestStream, { width: 10, height: 10 });
  });
});
