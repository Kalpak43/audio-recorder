import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { fetchRecordings } from "../features/recording/recordingThunk";
import AudioPlayer from "./AudioPlayer";
import { ListMusic, X } from "lucide-react";

function RecordingsList() {
  const dispatch = useAppDispatch();
  const recordings = useAppSelector((state) => state.recordings.list);
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    dispatch(fetchRecordings());
  }, [dispatch]);

  useEffect(() => {
    console.log(recordings);
  }, [recordings]);

  return (
    <>
      <button
        className="cursor-pointer fixed top-0 right-0 m-4 border-2 rounded-full p-4 hover:bg-white hover:text-black"
        onClick={() => setOpenList(true)}
      >
        <ListMusic />
      </button>
      <div
        className={`bg-black shadow-white space-y-2 fixed border-l border-blue-200 inset-y-0 py-4 px-4 w-fit right-0 overflow-y-auto transition-all duration-500 ${
          openList ? "translate-x-0" : "translate-x-[150%]"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-[600]">Your Recordings</p>
          <button
            className="cursor-pointer border-2 rounded-full p-2 hover:bg-white hover:text-black"
            onClick={() => setOpenList(false)}
          >
            <X />
          </button>
        </div>
        {recordings.map((recording) => (
          <AudioPlayer key={recording.id} recording={recording} />
        ))}
      </div>
    </>
  );
}

export default RecordingsList;
