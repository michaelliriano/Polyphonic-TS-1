import { useEffect, useState } from "react";

interface UseAudioRecorderProps {
  audioContext: AudioContext;
}

interface UseAudioRecorderReturn {
  startRecording: () => void;
  stopRecording: () => void;
  downloadRecording: () => void;
  recordingDuration: number;
}

const useAudioRecorder = ({
  audioContext,
}: UseAudioRecorderProps): UseAudioRecorderReturn => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );
  const [recordingDuration, setRecordingDuration] = useState(0);

  useEffect(() => {
    const handleDataAvailable = (event: BlobEvent) => {
      setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
    };

    if (mediaRecorder) {
      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
    }

    return () => {
      if (mediaRecorder) {
        mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
      }
    };
  }, [mediaRecorder]);

  useEffect(() => {
    let interval: number | undefined;

    if (recordingStartTime) {
      interval = window.setInterval(() => {
        const duration = Date.now() - recordingStartTime;
        setRecordingDuration(duration);
      }, 100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [recordingStartTime]);

  const startRecording = () => {
    const mediaStream = audioContext.createMediaStreamDestination().stream;
    const newMediaRecorder = new MediaRecorder(mediaStream);

    setRecordedChunks([]);
    setRecordingStartTime(Date.now());
    setRecordingDuration(0);
    setMediaRecorder(newMediaRecorder);

    newMediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecordingStartTime(null);
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) {
      console.error("No recorded data available.");
      return;
    }

    const blob = new Blob(recordedChunks, { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recorded_audio.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    startRecording,
    stopRecording,
    downloadRecording,
    recordingDuration,
  };
};

export default useAudioRecorder;
