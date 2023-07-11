import React, { useContext, useEffect, useRef } from "react";
import { ColorContext, hexToRgb } from "../../context/ColorContext";
import { CustomAudioContext } from "../../context/CustomAudioContext";

interface OscilloscopeProps {
  type?: OscillatorType;
  frequency?: number;
  height?: number | "100%";
  width?: number | "100%";
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  type = "sine",
  frequency = 1313,
  width = 80,
  height = 70,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const audioContext = useContext(CustomAudioContext);

  const { color } = useContext(ColorContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || !audioContext) return;

    const analyser = audioContext.createAnalyser();
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    oscillator.start();



    const drawOscilloscope = () => {
      requestAnimationFrame(drawOscilloscope);

      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw oscilloscope visualization
      context.lineWidth = 2;
      context.strokeStyle = hexToRgb(color);
      context.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }

        x += sliceWidth;
      }

      context.lineTo(canvas.width, canvas.height / 2);
      context.stroke();
    };

    drawOscilloscope();

    return () => {
      // Clean up: Stop the oscillator when the component unmounts
      oscillator.stop();
    };
  }, [audioContext, color, frequency, type]);

  return <canvas ref={canvasRef} height={height} width={width} />;
};

const MemoizedOscilloscope = React.memo(Oscilloscope);

export default MemoizedOscilloscope;
