import { useEffect, useState } from "react";

/**
 * Custom hook for managing the AudioContext and filter nodes.
 * @param {number} numOscillators - The number of oscillators to connect in series.
 * @returns {Object} - An object containing the audioContext and filters.
 */
const useAudioContext = (numOscillators: number) => {
  const [audioContext, setAudioContext] = useState<AudioContext | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<BiquadFilterNode[]>([]);

  useEffect(() => {
    /**
     * Initializes the AudioContext and sets up the filter nodes.
     * @returns {Promise<boolean>} - A promise that resolves when the initialization is complete.
     */
    const initAudioContext = () => {
      return new Promise((resolve) => {
        const context = new AudioContext();

        // Create filter nodes
        const filterNodes = Array.from({ length: numOscillators }, () =>
          context.createBiquadFilter()
        );
        setFilters(filterNodes);

        const destinationNode = filterNodes[numOscillators - 1];
        destinationNode.connect(context.destination);

        // Connect filters in series
        for (let i = 0; i < numOscillators - 1; i++) {
          filterNodes[i].connect(filterNodes[i + 1]);
        }
        setAudioContext(context);
        // Resolve the promise if successful
        setAudioContext(context);
        resolve(true);
      }).catch((error) => {
        console.error("Failed to initialize AudioContext:", error);
      });
    };

    // Initialize the AudioContext
    initAudioContext();

    // Clean up the AudioContext on unmount
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [numOscillators]);

  return { audioContext, filters };
};

export default useAudioContext;
