import { FfprobeStream } from 'fluent-ffmpeg'

/*
  From the MKV spec:
  Language codes can be either the 3 letters bibliographic ISO-639-2 form (like "fre" for french), or such a language code followed by a dash and a country code for specialities in languages (like "fre-ca" for Canadian French). Country codes are the same as used for internet domains.
*/

/*
  From the mp4 spec:
   ISO 639-2/T for the set of three character codes. Each character is packed as the difference between its ASCII value and 0x60. Since the code is confined to being three lower-case letters, these values are strictly positive.
*/

export const getStreamLanguage = (
  stream: FfprobeStream
): string | undefined => {
  const language = stream.tags?.language

  return language
}
