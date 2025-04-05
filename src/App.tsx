import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastProvider } from "./hooks/toast";
import Navbar from "./components/Navbar";
import WalletProvider from "./utils/WalletProvider";
import { Provider as JotaiProvider } from "jotai";

export {};

interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>;
}

declare global {
  interface Window {
    // Use intersection type to extend existing definition
    ethereum?: any & EthereumProvider;
  }
}

function App() {
  return (
    <main>
      <JotaiProvider>
        <WalletProvider>
          <ToastProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </WalletProvider>
      </JotaiProvider>
    </main>
  );
}

export default App;
