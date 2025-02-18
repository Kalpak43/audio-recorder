interface RecordingType {
  blob: Blob;
  name: string;
  timeStamp?: Date;
  duration: number;
}

interface RecordingWithId extends RecordingType {
  id: number;
}
