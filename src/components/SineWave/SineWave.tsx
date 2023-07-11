import React, { useEffect, useRef } from "react";

export interface SineWaveProps {
  frequency: number;
  type: "sine" | "triangle" | "square" | "sawtooth";
  filter: FilterParams;
}

interface FilterParams {
  frequency: number;
  type: BiquadFilterType;
}

const SineWave: React.FC<SineWaveProps> = ({
  frequency,
  type,
  filter: filterProps,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    return () => {
      void audioContextRef.current?.close();
    };
  }, []);

  const playSineWave = () => {
    const oscillator = audioContextRef.current!.createOscillator();
    const filter = audioContextRef.current!.createBiquadFilter(); // Create a filter node
    oscillator.type = type;
    oscillator.frequency.value = frequency;

    filter.type = filterProps.type; // Set filter type to low-pass
    filter.frequency.value = filterProps.frequency; // Set the cutoff frequency

    oscillator.connect(filter); // Connect oscillator to the filter
    filter.connect(audioContextRef.current!.destination); // Connect filter to the audio output

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 5000);
  };

  return (
    <div>
      <button onClick={playSineWave}>Play {type} Wave</button>
    </div>
  );
};

export default SineWave;
