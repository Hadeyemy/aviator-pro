import { useState } from "react";

export default function App() {
  const [history, setHistory] = useState("");
  const [bankroll, setBankroll] = useState(100);
  const [predictions, setPredictions] = useState([]);
  const [strategy, setStrategy] = useState(null);

  const handlePredict = async () => {
    const res = await fetch("https://aviator-backend-ai.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, bankroll }),
    });

    const data = await res.json();
    setPredictions(data.predictions || []);
    setStrategy(data.strategy || null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">🎯 Aviator Pro</h1>

        {/* Input Fields */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Crash History (comma-separated)</label>
            <textarea
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="1.05, 2.3, 1.8, 1.01, 5.0, ..."
              rows={3}
              className="w-full rounded-lg p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Starting Bankroll ($)</label>
            <input
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(parseFloat(e.target.value))}
              className="w-full rounded-lg p-2 text-black"
            />
          </div>

          <button
            onClick={handlePredict}
            className="w-full py-2 px-4 rounded-xl bg-green-500 hover:bg-green-600 transition"
          >
            Predict Next 10 Rounds
          </button>
        </div>

        {/* Prediction Results */}
        {predictions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">🔮 Predictions</h2>
            <div className="grid grid-cols-5 gap-3 bg-gray-800 p-4 rounded-xl">
              {predictions.map((p, i) => (
                <div key={i} className="bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-lg font-semibold">{p}x</p>
                  <p className="text-sm text-gray-300">Round {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategy Breakdown */}
        {strategy && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-2">🟢 Low-Risk Bet</h3>
              <p>Multiplier: <strong>{strategy.low_risk.bet}x</strong></p>
              <p>Stake: <strong>${strategy.low_risk.stake}</strong></p>
            </div>

            <div className="bg-red-600 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-2">🔴 High-Risk Bet</h3>
              <p>Multiplier: <strong>{strategy.high_risk.bet}x</strong></p>
              <p>Stake: <strong>${strategy.high_risk.stake}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
