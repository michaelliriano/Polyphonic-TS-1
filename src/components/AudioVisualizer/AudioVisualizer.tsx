import React, { useEffect, useRef } from 'react';

interface OscilloscopeProps {
  audioContext: AudioContext;
  oscillator: OscillatorNode;
}

const Oscilloscope: React.FC<OscilloscopeProps> = ({ audioContext, oscillator }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) return;

    const analyser = audioContext.createAnalyser();
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    oscillator.connect(analyser);
    analyser.connect(audioContext.destination);

    const drawOscilloscope = () => {
      requestAnimationFrame(drawOscilloscope);
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw oscilloscope visualization
      context.lineWidth = 2;
      context.strokeStyle = 'rgb(0, 255, 0)';
      context.beginPath();

      const sliceWidth = (100 * 1.0) / bufferLength; // Use 100 as the width
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

      context.lineTo(100, canvas.height / 2); // Use 100 as the x-coordinate
      context.stroke();
    };

    drawOscilloscope();
  }, [audioContext, oscillator]);

  return <canvas ref={canvasRef} width={100} height={100} />;
};

export default Oscilloscope;
