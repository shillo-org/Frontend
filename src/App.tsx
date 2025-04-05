import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
