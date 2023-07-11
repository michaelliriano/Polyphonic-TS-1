import PolyphonicTS1 from "./components/PolyphonicTS1/PolyphonicTS1";
import { ColorProvider } from "./context/ColorContext";

function App() {
  return (
    <ColorProvider>
      <PolyphonicTS1 />
    </ColorProvider>
  );
}

export default App;
