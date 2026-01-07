import { BrowserRouter } from "react-router-dom";
import Routers from "./Routers/Routers";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <ProtectedRoute>
  <BrowserRouter>
      <Routers />
    </BrowserRouter>

    </ProtectedRoute>
  
  );
}

export default App;
