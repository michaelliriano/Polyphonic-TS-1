import { useState } from "react";

export default function useOscillatorTypes() {
  const [types] = useState<OscillatorType[]>([
    "sawtooth",
    "square",
    "triangle",
    "sine",
  ]);
  return { types };
}
