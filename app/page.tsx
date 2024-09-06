'use client';
import { useState } from 'react';

export default function Home() {
  const [joke, setJoke] = useState("Why don't scientists trust atoms? Because they make up everything!");
  const [tone, setTone] = useState("Witty");
  const [isLoading, setIsLoading] = useState(false);

  const generateJoke = async () => {
    setIsLoading(true);
    try {
      console.log('Sending request to generate joke...');
      const response = await fetch('/api/generate-joke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tone }),
      });
      
      console.log('Received response. Status:', response.status);
      
      const responseText = await response.text();
      console.log('Full response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse response as JSON:', error);
        throw new Error('Received non-JSON response from server');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${data.error || 'Unknown error'}`);
      }
      
      setJoke(data.joke);
    } catch (error) {
      console.error('Error generating joke:', error);
      setJoke(`Sorry, I couldn't generate a joke at the moment. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-100 p-6">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Joke Generator</h1>
          <p className="text-sm text-gray-600 text-center">Powered by OpenAI</p>
        </div>
        <div className="p-6">
          <div className="bg-blue-100 rounded-lg p-4 mb-6 min-h-[100px] flex items-center justify-center">
            <p className="text-xl text-gray-800 italic">{isLoading ? "Generating joke..." : `"${joke}"`}</p>
          </div>
          <div className="mb-6">
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              Select Tone:
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Witty">Witty</option>
              <option value="Sarcastic">Sarcastic</option>
              <option value="Silly">Silly</option>
              <option value="Dark">Dark</option>
              <option value="Goofy">Goofy</option>
            </select>
          </div>
          <button
            onClick={generateJoke}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate New Joke'}
          </button>
        </div>
      </div>
    </main>
  );
}