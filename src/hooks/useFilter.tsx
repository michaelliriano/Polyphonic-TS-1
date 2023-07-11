import { useState, useEffect } from "react";

/**
 * Custom hook for managing the audio filter.
 * @param {AudioContext|null} audioContext - The audio context instance.
 * @returns {Object} - An object containing the filter node and setter function.
 */
export function useFilter(audioContext: AudioContext | null) {
  const [filter, setFilter] = useState<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (audioContext) {
      // Create a new BiquadFilterNode
      const filterNode = audioContext.createBiquadFilter();
      setFilter(filterNode);
      
      // Connect the filter node to the audio context's destination
      filterNode.connect(audioContext.destination);
    }
  }, [audioContext]);

  return { filter, setFilter };
}

export default useFilter;
