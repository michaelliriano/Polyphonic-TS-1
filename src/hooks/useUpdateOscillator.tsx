import { useCallback, useEffect } from "react";
import { CustomOsc } from "../types";

export default function useUpdateOscillator(
  audioContext: AudioContext,
  filters: BiquadFilterNode[],
  oscillators: OscillatorNode[],
  currentFrequency: number | null,
  customOsc: CustomOsc[]
) {

  const updateOscillators = useCallback(() => {
    const targetFrequency = currentFrequency || 0;

    oscillators.forEach((oscillator, i) => {
      const oscillatorType = oscillator.type;

      // Check if oscillator type and index match
      if (customOsc[i]?.type === oscillatorType && customOsc[i]?.enabled) {
        const customOscillator = customOsc[i];

        const detune = customOscillator.detune;
        const resonance = customOscillator.resonance;
        const volume = customOscillator.volume;
        const bendDuration = customOscillator.bend || 0;

        const initialFrequency = oscillator.frequency.value;
        const bendStartFrequency = Math.min(targetFrequency, initialFrequency);
        const bendEndFrequency = Math.max(targetFrequency, initialFrequency);

        const currentTime = audioContext.currentTime;

        // const analyser = audioContext.createAnalyser();
        // analyser.smoothingTimeConstant = 1;
        // analyser.fftSize = 2048;

        oscillator.frequency.cancelScheduledValues(currentTime);
        oscillator.detune.cancelScheduledValues(currentTime);
        filters[i].frequency.cancelScheduledValues(currentTime);

        oscillator.frequency.setValueAtTime(initialFrequency, currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          bendStartFrequency,
          currentTime + bendDuration
        );
        oscillator.frequency.linearRampToValueAtTime(
          bendEndFrequency,
          currentTime + bendDuration * 2
        );
        oscillator.frequency.linearRampToValueAtTime(
          targetFrequency,
          currentTime + bendDuration * 3
        );

        oscillator.detune.setValueAtTime(detune, currentTime);
        filters[i].frequency.setValueAtTime(resonance, currentTime);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, currentTime);

        oscillator.disconnect();
        oscillator.connect(gainNode);
        gainNode.connect(filters[i]);
        // gainNode.connect(analyser); 
        filters[i].connect(audioContext.destination);

        // setAnalyserNodes((prevAnalyserNodes) => [
        //   ...prevAnalyserNodes,
        //   analyser,
        // ]);
      } else {
        oscillator.disconnect(); // Disconnect oscillator if not enabled or type doesn't match
      }
    });
  }, [audioContext, currentFrequency, customOsc, filters, oscillators]);

  useEffect(() => {
    updateOscillators();
  }, [updateOscillators, customOsc, currentFrequency]);

  useEffect(() => {
    // Update oscillator types in real-time
    oscillators.forEach((oscillator) => {
      const oscillatorType = oscillator.type;
      const customOscillator = customOsc.find(
        (osc) => osc.type === oscillatorType
      );

      if (customOscillator) {
        oscillator.type = oscillatorType; // Set the oscillator type directly
      }
    });
  }, [customOsc, oscillators]);

  return { updateOscillators };
}
