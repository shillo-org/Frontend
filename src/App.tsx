import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastProvider } from "./hooks/toast";
import Navbar from "./components/Navbar";
import WalletProvider from "./utils/WalletProvider";
import { Provider as JotaiProvider } from "jotai";
import ListTokenPage from "./pages/ListTokenPage";
import { useState } from "react";
import { TokenData } from "./types";
import ExplorePage from "./pages/ExplorePage";

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
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  const updateTokenData = (data: TokenData) => {
    setTokenData(data);
  };
  return (
    <main>
      <JotaiProvider>
        <WalletProvider>
          <ToastProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />

                <Route
                  path="/list-token"
                  element={
                    <ListTokenPage
                      updateTokenData={updateTokenData}
                      tokenData={null}
                    />
                  }
                />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </WalletProvider>
      </JotaiProvider>
    </main>
  );
}

export default App;
