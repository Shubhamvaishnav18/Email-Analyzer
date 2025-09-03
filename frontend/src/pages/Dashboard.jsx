import React, { useState, useEffect } from 'react';
import { emailAPI } from '../services/api';
import ReceivingChain from '../components/ReceivingChain';
import ESPDisplay from '../components/ESPDisplay';
import { FiMail, FiRefreshCw, FiAlertCircle, FiCopy, FiCheck } from 'react-icons/fi';
import { Save, PlugZap, Unplug, Download, Mail, Lock , Server, FileText  } from "lucide-react";
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [emailConfig, setEmailConfig] = useState({
    address: '',
    password: '',
    host: 'imap.gmail.com',
    subjectFilter: ''
  });
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Load saved email config from localStorage if available
  useEffect(() => {
    const savedConfig = localStorage.getItem('emailConfig');
    if (savedConfig) {
      setEmailConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailConfig(prev => ({ ...prev, [name]: value }));
  };

  //save config in local storage
  const saveConfig = () => {
    localStorage.setItem('emailConfig', JSON.stringify(emailConfig));
    toast.success("Configuration saved!");
  };

  //function to connect email with IMAP
  const connectIMAP = async () => {
    setConnectLoading(true);
    setError('');
    try {
      const { address, password, host } = emailConfig;
      await emailAPI.connectIMAP({ user: address, password, host });
      setConnected(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Connection failed');
      setConnected(false);
    } finally {
      setConnectLoading(false);
    }
  };

  //function to disconnect email with IMAP
  const disconnectIMAP = async () => {
    setDisconnectLoading(true);
    try {
      await emailAPI.disconnectIMAP();
      setConnected(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Disconnection failed');
    } finally {
      setDisconnectLoading(false);
    }
  };

  //function to analyze email
  const analyzeEmails = async () => {
    setAnalyzeLoading(true);
    setError('');
    try {
      const { subjectFilter } = emailConfig;
      const response = await emailAPI.analyzeEmails({ subjectFilter });
      setAnalysisResults(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedEmail(response.data.data[0]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  //function to fetch complete data form MongoDB database
  const fetchResults = async () => {
    setFetchLoading(true);
    try {
      const response = await emailAPI.getAnalysisResults();
      setAnalysisResults(response.data.data?.docs || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch results');
    } finally {
      setFetchLoading(false);
    }
  };

  //function to copy complete raw headers
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  //function to formate raw headers
  const formatRawHeaders = (rawHeaders) => {
    try {
      const headers = JSON.parse(rawHeaders);
      return Object.entries(headers)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
    } catch (e) {
      return rawHeaders;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Analysis Dashboard</h1>
          <p className="text-gray-600">Analyze and visualize email delivery paths</p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Configuration Panel */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Mail size={16} className="text-gray-500" />Email Address</label>
                <input
                  type="email"
                  name="address"
                  value={emailConfig.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Lock size={16} className="text-gray-500" />Password/App Password</label>
                <input
                  type="password"
                  name="password"
                  value={emailConfig.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Server size={16} className="text-gray-500" />IMAP Host</label>
                <input
                  type="text"
                  name="host"
                  value={emailConfig.host}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="imap.gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FileText size={16} className="text-gray-500" />Subject Filter (Optional)</label>
                <input
                  type="text"
                  name="subjectFilter"
                  value={emailConfig.subjectFilter}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Filter by subject"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={saveConfig}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center justify-center cursor-pointer"
                >
                  <Save size={18} className="mr-2" />
                  <span>Save Config</span>
                </button>

                {connected ? (
                  <button
                    onClick={disconnectIMAP}
                    disabled={disconnectLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center cursor-pointer"
                  >
                    {disconnectLoading  ? (
                      <FiRefreshCw className="animate-spin mr-2" />
                    ) : (
                      <Unplug size={18} className="mr-2" />
                    )}
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={connectIMAP}
                    disabled={connectLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center cursor-pointer"
                  >
                    {connectLoading  ? (
                      <FiRefreshCw className="animate-spin mr-2" />
                    ) : (
                      <PlugZap size={18} className="mr-2" />
                    )}
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Analysis</h2>

            <div className="mb-4">
              <p className="text-gray-600">
                <span className="font-medium">Current email:</span> {emailConfig.address}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Subject filter:</span> {emailConfig.subjectFilter || 'None'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Status:</span>
                <span className={connected ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={analyzeEmails}
                disabled={!connected || analyzeLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center cursor-pointer"
              >
                {analyzeLoading  ? <FiRefreshCw className="animate-spin mr-2" /> : <FiMail className="mr-2" />}
                Analyze Emails
              </button>

              <button
                onClick={fetchResults}
                disabled={fetchLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center cursor-pointer"
              >
                {fetchLoading  ? <FiRefreshCw className="animate-spin mr-2" /> : <Download size={18} className="mr-2" />}
                Fetch Results
              </button>
            </div>

            {analysisResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Results</h3>
                <div className="border rounded-md divide-y">
                  {analysisResults.map((email, index) => (
                    <div
                      key={email._id || index}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedEmail?._id === email._id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <p className="font-medium">{email.subject}</p>
                      <p className="text-sm text-gray-600">From: {email.from} | To: {email.to}</p>
                      <p className="text-xs text-gray-500">{new Date(email.date).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Display */}
        {selectedEmail && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReceivingChain receivingChain={selectedEmail.receivingChain} />
              <ESPDisplay espType={selectedEmail.espType} />
            </div>

            {/* Raw Headers Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Raw Headers</h3>
                <button
                  onClick={() => copyToClipboard(formatRawHeaders(selectedEmail.rawHeaders))}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <FiCheck className="mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {formatRawHeaders(selectedEmail.rawHeaders)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;