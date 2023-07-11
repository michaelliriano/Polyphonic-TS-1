import { useMemo } from "react";
import { CustomOsc } from "../types";

/**
 * Custom hook for generating the initial oscillator configuration.
 * @returns {Object} - An object containing the initial oscillator configuration.
 */
export default function useInitialOscillator() {
  const initialOsc: CustomOsc[] = useMemo(
    () => [
      {
        sort: 1,
        type: "sine",
        enabled: true,
        detune: 0,
        sustain: 0,
        bend: 0,
        resonance: 1000,
        volume: .1,
        release: 0,
        octave: 0,
      },
      {
        sort: 2,
        type: "sawtooth",
        enabled: true,
        detune: 0,
        sustain: 0,
        bend: 0,
        resonance: 1000,
        volume: .1,
        release: 0,
        octave: 0,
      },
      {
        sort: 3,
        type: "square",
        enabled: true,
        detune: 0,
        sustain: 0,
        bend: 0,
        resonance: 1000,
        volume: .1,
        release: 0,
        octave: 0,
      },
      {
        sort: 4,
        type: "triangle",
        enabled: true,
        detune: 0,
        sustain: 0,
        bend: 0,
        resonance: 1000,
        volume: .1,
        release: 0,
        octave: 0,
      },
    ],
    []
  );

  return {
    initialOsc,
  };
}
