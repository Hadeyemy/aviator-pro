import { useState } from 'react';

const App = () => {
  const [predictions, setPredictions] = useState([]);
  const [inputData, setInputData] = useState('');
  const [bankroll, setBankroll] = useState(100);
  const [strategy, setStrategy] = useState(null);

  const handlePredict = async () => {
    const res = await fetch('https://aviator-backend.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: inputData })
    });
    const data = await res.json();
    setPredictions(data.predictions || []);
    setStrategy(data.strategy || null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Aviator Pro Prediction Tool</h1>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
        <textarea
          rows="4"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Enter past crash values like: 2.3, 1.1, 5.0..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          value={bankroll}
          onChange={(e) => setBankroll(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter your bankroll"
        />
        <button
          onClick={handlePredict}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Predict Next 10 Rounds
        </button>

        {predictions.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Predicted Odds:</h2>
            <ul className="grid grid-cols-2 gap-2">
              {predictions.map((p, idx) => (
                <li key={idx} className="bg-gray-200 rounded p-2 text-center">{p}</li>
              ))}
            </ul>
          </div>
        )}

        {strategy && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2 text-green-600">Suggested Strategy</h2>
            <p><strong>Low Risk Bet:</strong> {strategy.low_risk.bet}x (Stake: ${strategy.low_risk.stake})</p>
            <p><strong>High Risk Bet:</strong> {strategy.high_risk.bet}x (Stake: ${strategy.high_risk.stake})</p>
            <p className="text-sm text-gray-500 mt-2">Goal: Reach 120% bankroll in 10 rounds.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;