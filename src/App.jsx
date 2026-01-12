import { BrowserRouter } from "react-router-dom";
import Routers from "./Routers/Routers";
import { SearchProvider } from "./context/SearchContext";

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Routers />
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;
