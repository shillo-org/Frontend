// TransactionModal.tsx
import React, { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount } from "wagmi";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
  title: string;
  type: "buy" | "sell";
  currentPrice: string;
  tokenSymbol: string;
  tokenBalance?: string;
  ethBalance?: string;
  getSellReturn?: (amount: number) => Promise<bigint>;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  type,
  currentPrice,
  tokenSymbol,
  tokenBalance = "0",
  ethBalance = "0",
  getSellReturn,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedReturn, setEstimatedReturn] = useState<string>("0");
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError(null);
      setEstimatedReturn("0");
    }
  }, [isOpen]);

  // Calculate estimated return when selling tokens
  useEffect(() => {
    const updateEstimatedReturn = async () => {
      if (
        type === "sell" &&
        getSellReturn &&
        amount &&
        parseFloat(amount) > 0
      ) {
        try {
          const returnValue = await getSellReturn(parseFloat(amount));
          setEstimatedReturn(formatEther(returnValue));
        } catch (error) {
          console.error("Error calculating return:", error);
        }
      }
    };

    updateEstimatedReturn();
  }, [amount, type, getSellReturn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    // Check balances
    if (type === "buy") {
      if (parseFloat(amount) > parseFloat(ethBalance)) {
        setError("Insufficient ETH balance");
        return;
      }
    } else {
      if (parseFloat(amount) > parseFloat(tokenBalance)) {
        setError("Insufficient token balance");
        return;
      }
    }

    setError(null);
    setIsLoading(true);

    try {
      await onConfirm(parseFloat(amount));
      onClose();
    } catch (err) {
      setError((err as Error).message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>

        <div className="mb-4 space-y-2">
          <p className="text-gray-300">
            Current Price: {currentPrice} ETH per {tokenSymbol}
          </p>

          {type === "buy" ? (
            <p className="text-gray-300">Your ETH Balance: {ethBalance} ETH</p>
          ) : (
            <p className="text-gray-300">
              Your {tokenSymbol} Balance: {tokenBalance} {tokenSymbol}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              {type === "buy" ? "Amount in ETH" : `Amount in ${tokenSymbol}`}:
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder={`Enter ${
                type === "buy" ? "ETH" : tokenSymbol
              } amount`}
              disabled={isLoading}
            />
          </div>

          {/* Display estimated tokens when buying */}
          {type === "buy" && amount && parseFloat(amount) > 0 && (
            <div className="mb-4 p-2 bg-gray-700 rounded-md">
              <p className="text-gray-300">
                Estimated tokens: ~
                {parseFloat(amount) / parseFloat(currentPrice || "1")}{" "}
                {tokenSymbol}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                (Actual amount may vary due to slippage and gas fees)
              </p>
            </div>
          )}

          {/* Display estimated return when selling */}
          {type === "sell" && amount && parseFloat(amount) > 0 && (
            <div className="mb-4 p-2 bg-gray-700 rounded-md">
              <p className="text-gray-300">
                Estimated return: ~{estimatedReturn} ETH
              </p>
              <p className="text-xs text-gray-400 mt-1">
                (Actual return may vary due to slippage and gas fees)
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-2 bg-red-900 border border-red-700 rounded-md text-white">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                type === "buy"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white font-bold`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : type === "buy" ? "Buy" : "Sell"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
