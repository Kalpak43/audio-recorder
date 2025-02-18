import { Mp3Encoder } from "@breezystack/lamejs";

export const convertToMp3 = async (blob: Blob) => {
  // Read the audio data from the Blob
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Convert the audio to MP3 using lamejs
  const encoder = new Mp3Encoder(
    audioBuffer.numberOfChannels,
    audioBuffer.sampleRate,
    128
  );

  const samples = audioBuffer.getChannelData(0); // Mono conversion

  // Convert Float32Array to Int16Array
  const int16Samples = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    int16Samples[i] = Math.max(-32768, Math.min(32767, samples[i] * 0x7fff));
  }

  const mp3Data = encoder.encodeBuffer(int16Samples);
  encoder.flush();

  const mp3Blob = new Blob([mp3Data], { type: "audio/mmpeg" });

  return mp3Blob;
};
