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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const key in form) {
      if (!form[key as keyof FraudFormData]) {
        setError("Please fill all fields");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/predict`, {
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
    } catch {
      setError("Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Fraud Detection
                </h1>
                <p className="text-sm text-gray-600">
                  Analyze transaction risk
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Customer Age
                  </label>
                  <input
                    type="number"
                    name="customer_age"
                    placeholder="Age"
                    value={form.customer_age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Hour */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Hour (0-23)
                  </label>
                  <input
                    type="number"
                    name="hour"
                    placeholder="0"
                    min={0}
                    max={23}
                    value={form.hour}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Transaction Type */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Transaction Type
                  </label>
                  <select
                    name="transaction_type"
                    value={form.transaction_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="purchase">Purchase</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>

                {/* Merchant */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Merchant Category
                  </label>
                  <select
                    name="merchant_category"
                    value={form.merchant_category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select category</option>
                    <option value="grocery">Grocery</option>
                    <option value="telecom">Telecom</option>
                    <option value="travel">Travel</option>
                    <option value="unknown">Other</option>
                  </select>
                </div>

                {/* Card */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Card Type
                  </label>
                  <select
                    name="card_type"
                    value={form.card_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select card</option>
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select country</option>
                    <option value="somalia">Somalia</option>
                    <option value="kenya">Kenya</option>
                    <option value="ethiopia">Ethiopia</option>
                    <option value="djibouti">Djibouti</option>
                  </select>
                </div>

                {/* Device */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Device
                  </label>
                  <select
                    name="device"
                    value={form.device}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select device</option>
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Analyzing...
                  </div>
                ) : (
                  "Check for Fraud"
                )}
              </button>
            </form>

            {/* Results Section - Shows at bottom of form */}
            {result && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Analysis Result
                  </h3>

                  <div
                    className={`px-4 py-3 rounded-lg ${getRiskColor(
                      result.risk_level
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Risk Level:</span>
                      <span className="font-bold capitalize">
                        {result.risk_level}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {(result.fraud_probability * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Fraud Probability
                      </div>
                    </div>
                  </div>

                  {/* Risk Indicator Bar */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Risk Indicator</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          result.risk_level?.toLowerCase() === "low"
                            ? "bg-green-500"
                            : result.risk_level?.toLowerCase() === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${result.fraud_probability * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          This system uses AI to analyze transaction patterns and detect
          potential fraud.
        </div>
      </div>
    </div>
  );
}
