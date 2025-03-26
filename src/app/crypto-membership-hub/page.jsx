"use client";
import React, {useState, useEffect} from "react";
import NewComponent from "../../components/new-component"
function MainComponent({
  loading,
  cryptoData: initialCryptoData,
  socialData: initialSocialData,
}) {
  const [cryptoData, setCryptoData] = useState(initialCryptoData || []);
  const [hashtagData, setHashtagData] = useState(initialSocialData || []);
  const [tweets, setTweets] = useState([]);
  const [cryptoPage, setCryptoPage] = useState(1);
  const [socialPage, setSocialPage] = useState(1);
  const [tweetsPage, setTweetsPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(loading);
  const [debugInfo, setDebugInfo] = useState({
    apiCalls: { crypto: false, social: false, tweets: false },
    apiResponses: { crypto: null, social: null, tweets: null },
    errors: [],
  });
  const [cryptoSortConfig, setCryptoSortConfig] = useState({
    key: "market_cap",
    direction: "descending",
  });
  const [socialSortConfig, setSocialSortConfig] = useState({
    key: "twitter_followers",
    direction: "descending",
  });
  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-[#2563eb] rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= (totalPages || 1)}
        className="px-4 py-2 bg-[#2563eb] rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo((prev) => ({
        ...prev,
        apiCalls: { crypto: false, social: false, tweets: false },
        apiResponses: { crypto: null, social: null, tweets: null },
        errors: [],
      }));

      const fetchWithRetry = async (url, options, retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              ...options,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.success) {
              throw new Error(
                data.error || `Failed to fetch data from ${url}`
              );
            }

            return data;
          } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (i + 1))
            );
          }
        }
      };
      const [cryptoData, socialData, tweetsData] = await Promise.allSettled([
        fetchWithRetry("/api/get-cryptocurrencies/update", {
          body: JSON.stringify({
            page: cryptoPage,
            limit: 20,
          }),
        }).then((data) => {
          setDebugInfo((prev) => ({
            ...prev,
            apiCalls: { ...prev.apiCalls, crypto: true },
            apiResponses: { ...prev.apiResponses, crypto: data },
          }));
          return data;
        }),
        fetchWithRetry("/api/get-social-data", {
          body: JSON.stringify({}),
        }).then((data) => {
          setDebugInfo((prev) => ({
            ...prev,
            apiCalls: { ...prev.apiCalls, social: true },
            apiResponses: { ...prev.apiResponses, social: data },
          }));
          return data;
        }),
        fetchWithRetry("/api/get-recent-tweets", {
          body: JSON.stringify({}),
        }).then((data) => {
          setDebugInfo((prev) => ({
            ...prev,
            apiCalls: { ...prev.apiCalls, tweets: true },
            apiResponses: { ...prev.apiResponses, tweets: data },
          }));
          return data;
        }),
      ]);

      if (cryptoData.status === "fulfilled" && cryptoData.value.success) {
        setCryptoData(cryptoData.value.cryptocurrencies || []);
      } else if (cryptoData.status === "fulfilled") {
        throw new Error(
          cryptoData.value.error || "Failed to fetch cryptocurrency data"
        );
      }
      if (socialData.status === "fulfilled") {
        setHashtagData(socialData.value.socialMetrics || []);
      }
      if (tweetsData.status === "fulfilled") {
        setTweets(tweetsData.value.tweets || []);
      }

      const errors = [
        cryptoData.status === "rejected"
          ? cryptoData.reason?.message ||
            "Failed to fetch cryptocurrency data"
          : null,
        socialData.status === "rejected"
          ? socialData.reason?.message || "Failed to fetch social data"
          : null,
        tweetsData.status === "rejected"
          ? tweetsData.reason?.message || "Failed to fetch tweets"
          : null,
      ].filter(Boolean);

      if (errors.length > 0) {
        setDebugInfo((prev) => ({
          ...prev,
          errors,
        }));
        if (errors.length === 3) {
          throw new Error(
            "Failed to fetch data from all sources. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cryptoPage, socialPage, tweetsPage]);

  const getTopPerformers = () => {
    if (!Array.isArray(cryptoData)) return [];
    return [...cryptoData]
      .sort((a, b) => parseFloat(b.change || 0) - parseFloat(a.change || 0))
      .slice(0, 4);
  };

  const getSortedCryptoData = () => {
    if (!Array.isArray(cryptoData)) return [];
    return [...cryptoData].sort((a, b) => {
      if (cryptoSortConfig.key === "rank") {
        return cryptoSortConfig.direction === "ascending" ? 1 : -1;
      }

      if (
        cryptoSortConfig.key === "name" ||
        cryptoSortConfig.key === "symbol"
      ) {
        return cryptoSortConfig.direction === "ascending"
          ? a[cryptoSortConfig.key].localeCompare(b[cryptoSortConfig.key])
          : b[cryptoSortConfig.key].localeCompare(a[cryptoSortConfig.key]);
      }

      const aValue = parseFloat(a[cryptoSortConfig.key].replace(/[,$BM]/g, ""));
      const bValue = parseFloat(b[cryptoSortConfig.key].replace(/[,$BM]/g, ""));

      return cryptoSortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    });
  };
  const getSortedSocialData = () => {
    if (!Array.isArray(hashtagData)) return [];
    return [...hashtagData].sort((a, b) => {
      if (
        socialSortConfig.key === "name" ||
        socialSortConfig.key === "symbol"
      ) {
        return socialSortConfig.direction === "ascending"
          ? a[socialSortConfig.key].localeCompare(b[socialSortConfig.key])
          : b[socialSortConfig.key].localeCompare(a[socialSortConfig.key]);
      }

      const aValue = a[socialSortConfig.key];
      const bValue = b[socialSortConfig.key];

      return socialSortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-xl">Loading data...</p>
          <div className="mt-4 text-sm text-gray-400">
            This may take a few moments...
          </div>
        </div>
      ) : (
        <>
          <NewComponent
            loading={false}
            cryptoData={getSortedCryptoData()}
            socialData={getSortedSocialData()}
          />

          <div className="overflow-x-auto mt-12">
            <h2 className="text-2xl font-bold mb-6">
              Social Mentions Analysis
            </h2>
            <table className="w-full rounded-xl">
              <thead>
                <tr className="border-b border-[#2f3542]">
                  <th className="p-4 text-left">Rank</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Twitter Mentions</th>
                  <th className="p-4 text-left">TikTok Mentions</th>
                  <th className="p-4 text-left">Reddit Mentions</th>
                  <th className="p-4 text-left">Total Social Score</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  hashtagData.map((crypto, index) => (
                    <tr
                      key={crypto.symbol}
                      className="border-b border-[#2f3542] hover:bg-[#1e2128]"
                    >
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <i
                            className={`fa-brands fa-${crypto.symbol.toLowerCase()} text-xl mr-3`}
                          ></i>
                          <div>
                            <div className="font-bold">{crypto.name}</div>
                            <div className="text-sm text-[#94a3b8]">
                              {crypto.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <i className="fab fa-twitter text-[#1DA1F2] mr-2"></i>
                          {crypto.twitter_mentions?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <i className="fab fa-tiktok text-[#ff0050] mr-2"></i>
                          {crypto.tiktok_mentions?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <i className="fab fa-reddit text-[#FF4500] mr-2"></i>
                          {crypto.reddit_mentions?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="p-4">
                        {(
                          (crypto.twitter_mentions || 0) +
                          (crypto.tiktok_mentions || 0) +
                          (crypto.reddit_mentions || 0)
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={cryptoPage}
            totalPages={Math.ceil(cryptoData.length / 20)}
            onPageChange={setCryptoPage}
          />
{/* 
          <PaginationControls
            currentPage={socialPage}
            totalPages={Math.ceil(hashtagData.length / 20)}
            onPageChange={setSocialPage}
          />

          <PaginationControls
            currentPage={tweetsPage}
            totalPages={Math.ceil(tweets.length / 10)}
            onPageChange={setTweetsPage}
          /> */}

          <div className="mt-8 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">Debug Information:</h3>

            <div className="space-y-2">
              <h4 className="font-semibold">API Calls Made:</h4>
              <ul className="list-disc pl-5">
                <li>Crypto API: {debugInfo.apiCalls.crypto ? "✅" : "❌"}</li>
                <li>Social API: {debugInfo.apiCalls.social ? "✅" : "❌"}</li>
                <li>Tweets API: {debugInfo.apiCalls.tweets ? "✅" : "❌"}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Data Counts:</h4>
              <ul className="list-disc pl-5">
                <li>Cryptocurrencies: {cryptoData.length}</li>
                <li>Social Metrics: {hashtagData.length}</li>
                <li>Tweets: {tweets.length}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">API Responses:</h4>
              <div className="space-y-2">
                <details className="cursor-pointer">
                  <summary>Crypto API Response</summary>
                  <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto max-h-40">
                    {JSON.stringify(debugInfo.apiResponses.crypto, null, 2)}
                  </pre>
                </details>
                <details className="cursor-pointer">
                  <summary>Social API Response</summary>
                  <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto max-h-40">
                    {JSON.stringify(debugInfo.apiResponses.social, null, 2)}
                  </pre>
                </details>
                <details className="cursor-pointer">
                  <summary>Tweets API Response</summary>
                  <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto max-h-40">
                    {JSON.stringify(debugInfo.apiResponses.tweets, null, 2)}
                  </pre>
                </details>
              </div>
            </div>

            {debugInfo.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Errors:</h4>
                <ul className="list-disc pl-5">
                  {debugInfo.errors.map((err, idx) => (
                    <li key={idx} className="text-red-400">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default MainComponent;