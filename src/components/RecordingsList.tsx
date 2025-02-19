import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { fetchRecordings } from "../features/recording/recordingThunk";
import AudioPlayer from "./AudioPlayer";
import { ListMusic, X } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";
import { AnimatePresence, motion } from "motion/react";

function RecordingsList() {
  const { theme } = useTheme();
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
      <motion.button
        className={`cursor-pointer z-50 fixed top-0 right-0 m-4 border-2 rounded-full p-4 transition-all duration-300 flex gap-2 justify-start items-center group ${
          theme === "dark"
            ? "bg-black hover:bg-white hover:text-black"
            : "bg-white hover:bg-black hover:text-white"
        }`}
        onClick={() => setOpenList(true)}
        initial={{ width: "3.5rem", height: "3.5rem" }}
        whileHover={{ width: "13.5rem" }}
        transition={{ duration: 0.1 }}
      >
        <div className="-ml-[0.1rem]">
          <ListMusic />
        </div>
        <motion.span
          className="uppercase  overflow-hidden whitespace-nowrap"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
        >
          Your Recordings
        </motion.span>
      </motion.button>
      <div className="bg-[#00000080]"></div>
      <div
        className={`${
          theme == "dark"
            ? "bg-black text-white shadow-white"
            : " bg-white text-black shadow-xl"
        } bg-black z-50 space-y-2 fixed border-l border-blue-200 inset-y-0 py-4 px-4 w-fit right-0 overflow-y-auto transition-all duration-500 overflow-x-hidden ${
          openList ? "translate-x-0" : "translate-x-[150%]"
        } ${theme == "dark" ? "" : ""}`}
      >
        <div className="flex justify-between gap-16 items-center mb-4">
          <p className="text-xl font-[600]">Your Recordings</p>
          <button
            className={`cursor-pointer border-2 rounded-full p-2 ${
              theme == "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
            }`}
            onClick={() => setOpenList(false)}
          >
            <X />
          </button>
        </div>
        <AnimatePresence>
          {recordings.length > 0 ? (
            recordings.map((recording) => (
              <motion.div
                layout
                key={recording.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ delay: 0.3 }}
              >
                <AudioPlayer
                  editable={false}
                  key={recording.id}
                  recording={recording}
                />
              </motion.div>
            ))
          ) : (
            <div className="h-[500px] flex items-center justify-center">
              No Recordings Found
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default RecordingsList;
