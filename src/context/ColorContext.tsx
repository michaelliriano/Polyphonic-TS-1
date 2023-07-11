import React, { useState } from "react";

export const initialColor = "#E2C922";

export const ColorContext = React.createContext<{
  color: string;
  setColor?: React.Dispatch<React.SetStateAction<string>>;
}>({ color: initialColor });

export function hexToRgb(hex: string): string {
    // Remove the '#' character from the hex code if present
    const sanitizedHex = hex.startsWith('#') ? hex.substring(1) : hex;
  
    // Parse the hexadecimal values for red, green, and blue components
    const red = parseInt(sanitizedHex.substring(0, 2), 16);
    const green = parseInt(sanitizedHex.substring(2, 4), 16);
    const blue = parseInt(sanitizedHex.substring(4, 6), 16);
  
    // Return the RGB string format
    return `rgb(${red}, ${green}, ${blue})`;
  }
  

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [color, setColor] = useState(initialColor);

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
};
