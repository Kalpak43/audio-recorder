interface RecordingType {
  blob: Blob;
  name: string;
  timestamp?: Date;
  duration: number;
}

interface RecordingWithId extends RecordingType {
  id: number;
}
