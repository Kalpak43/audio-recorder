import { RefObject, useRef, useState } from "react";

function AudioRecorder({
  className,
  onStart,
  onStop,
  visualizer,
}: {
  className?: string;
  onStart: () => void;
  onStop: (recordedBlob: Blob) => void;
  visualizer?: RefObject<HTMLCanvasElement | null>;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<any[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup Web Audio API
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      if (analyser && visualizer) {
        analyser.current = audioContextRef.current.createAnalyser();
        source.connect(analyser.current);

        // Configure analyser
        analyser.current.fftSize = 256;
        const bufferLength = analyser.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        drawWaveform();
      }

      // Start drawing waveform

      // Start MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      onStart();

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        onStop(audioBlob);
        audioChunksRef.current = []; // Clear chunks
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Some error occurred: ", e);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (analyser && visualizer) {
      cancelAnimationFrame(animationFrameRef.current!);
      const canvas = visualizer.current;
      const ctx = canvas!.getContext("2d");
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    }
  }

  function drawWaveform() {
    if (
      (visualizer && !visualizer.current) ||
      (analyser && !analyser.current) ||
      !dataArrayRef.current
    ) {
      return;
    }

    const canvas = visualizer!.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if ((analyser && !analyser.current) || !dataArrayRef.current) return;

      analyser && analyser.current!.getByteTimeDomainData(dataArrayRef.current);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#00f";
      ctx.beginPath();

      const sliceWidth = canvas.width / dataArrayRef.current.length;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  }

  const drawCircularWaveform = () => {
    if (
      (visualizer && !visualizer.current) ||
      (analyser && !analyser.current) ||
      !dataArrayRef.current
    ) {
      return;
    }

    const canvas = visualizer!.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if ((analyser && !analyser.current) || !dataArrayRef.current) return;

      analyser && analyser!.current!.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
      ctx.stroke();

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const angle = (i / dataArrayRef.current.length) * 2 * Math.PI;
        const amplitude = dataArrayRef.current[i] / 255;
        const x = centerX + radius * Math.cos(angle) * (1 + amplitude * 0.3);
        const y = centerY + radius * Math.sin(angle) * (1 + amplitude * 0.3);

        ctx.beginPath();
        ctx.arc(x, y, 2 + amplitude * 5, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${
          (i * 360) / dataArrayRef.current.length
        }, 100%, 50%)`;
        ctx.fill();

        if (i > 0) {
          const prevAngle =
            ((i - 1) / dataArrayRef.current.length) * 2 * Math.PI;
          const prevAmplitude = dataArrayRef.current[i - 1] / 255;
          const prevX =
            centerX + radius * Math.cos(prevAngle) * (1 + prevAmplitude * 0.3);
          const prevY =
            centerY + radius * Math.sin(prevAngle) * (1 + prevAmplitude * 0.3);

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `hsla(${
            (i * 360) / dataArrayRef.current.length
          }, 100%, 50%, 0.5)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  return (
    <button
      className={`cursor-pointer ${className}`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
}

export default AudioRecorder;
