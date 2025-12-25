"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

type FraudFormData = {
  amount: string;
  customer_age: string;
  hour: string;
  transaction_type: string;
  merchant_category: string;
  card_type: string;
  country: string;
  device: string;
};

export default function FraudForm() {
  const [form, setForm] = useState<FraudFormData>({
    amount: "",
    customer_age: "",
    hour: "",
    transaction_type: "",
    merchant_category: "",
    card_type: "",
    country: "",
    device: "",
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Quick validation
    for (const key in form) {
      if (!form[key as keyof FraudFormData]) {
        setError("Please fill all fields");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          customer_age: Number(form.customer_age),
          hour: Number(form.hour),
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Fraud Detection</h2>
            <p className="text-sm text-gray-600">Analyze transaction risk</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Customer Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="customer_age"
                value={form.customer_age}
                onChange={handleChange}
                placeholder="18-100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Hour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hour (0-23)
              </label>
              <input
                type="number"
                name="hour"
                value={form.hour}
                onChange={handleChange}
                placeholder="0-23"
                min="0"
                max="23"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="transaction_type"
                value={form.transaction_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select type</option>
                <option value="online">Online</option>
                <option value="pos">POS</option>
              </select>
            </div>

            {/* Merchant Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merchant
              </label>
              <select
                name="merchant_category"
                value={form.merchant_category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select category</option>
                <option value="food">Food</option>
                <option value="electronics">Electronics</option>
                <option value="travel">Travel</option>
                <option value="grocery">Grocery</option>
              </select>
            </div>

            {/* Card Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Type
              </label>
              <select
                name="card_type"
                value={form.card_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select card</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select country</option>
                <option value="uk">UK</option>
                <option value="usa">USA</option>
                <option value="uae">UAE</option>
                <option value="canada">Canada</option>
              </select>
            </div>

            {/* Device */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device
              </label>
              <select
                name="device"
                value={form.device}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select device</option>
                <option value="web">Web</option>
                <option value="pos">POS</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Check for Fraud"
            )}
          </button>
        </form>

        {/* Results - Show only when available */}
        {result && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Analysis Result
            </h3>

            <div className="space-y-4">
              {/* Risk Level */}
              <div
                className={`px-4 py-3 rounded-lg ${getRiskColor(
                  result.risk_level
                )}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Risk Level:</span>
                  <span className="font-bold capitalize">
                    {result.risk_level}
                  </span>
                </div>
              </div>

              {/* Probability */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">
                    Fraud Probability:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {(result.fraud_probability * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
                    style={{ width: `${result.fraud_probability * 100}%` }}
                  />
                </div>
              </div>

              {/* New Analysis Button */}
              <button
                onClick={() => {
                  setResult(null);
                  setForm({
                    amount: "",
                    customer_age: "",
                    hour: "",
                    transaction_type: "",
                    merchant_category: "",
                    card_type: "",
                    country: "",
                    device: "",
                  });
                }}
                className="w-full py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Analyze Another Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
