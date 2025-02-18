interface RecordingType {
  blob: Blob;
  name: string;
  timeStamp?: Date;
}

interface RecordingWithId extends RecordingType {
  id: number;
}
