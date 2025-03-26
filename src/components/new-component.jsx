"use client";
import React from "react";

export default function Index() {
  return (function MainComponent({ loading, cryptoData, socialData }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Track Cryptocurrencies in Real-Time
        </h1>
        <p className="text-[#94a3b8] text-xl">
          Get live updates and market insights with our premium membership
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : (
          cryptoData.map((crypto) => (
            <div
              key={crypto.symbol}
              className="bg-[#161920] p-6 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <i
                    className={`fa-brands fa-${crypto.symbol.toLowerCase()} text-2xl mr-3`}
                  ></i>
                  <div>
                    <h3 className="font-bold">{crypto.name}</h3>
                    <span className="text-sm text-[#94a3b8]">
                      {crypto.symbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold mb-2">${crypto.price}</div>
              <div
                className={`text-sm ${
                  Number(crypto.change) >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Number(crypto.change) >= 0 ? "+" : ""}
                {crypto.change}%
              </div>
            </div>
          ))
        )}
      </div>

      <div className="overflow-x-auto mt-12">
        <table className="w-full bg-[#161920] rounded-xl">
          <thead>
            <tr className="border-b border-[#2f3542]">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">24h Change</th>
              <th className="p-4 text-left">7d Change</th>
              <th className="p-4 text-left">Market Cap</th>
              <th className="p-4 text-left">Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : (
              cryptoData.map((crypto, index) => (
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
                  <td className="p-4">${crypto.price}</td>
                  <td
                    className={`p-4 ${
                      Number(crypto.change) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {Number(crypto.change) >= 0 ? "+" : ""}
                    {crypto.change}%
                  </td>
                  <td
                    className={`p-4 ${
                      Number(crypto.sevenDayChange) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {Number(crypto.sevenDayChange) >= 0 ? "+" : ""}
                    {crypto.sevenDayChange}%
                  </td>
                  <td className="p-4">${crypto.marketCap}B</td>
                  <td className="p-4">${crypto.volume}M</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Social Reach Rankings</h2>
        <table className="w-full bg-[#161920] rounded-xl">
          <thead>
            <tr className="border-b border-[#2f3542]">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Twitter Followers</th>
              <th className="p-4 text-left">Reddit Subscribers</th>
              <th className="p-4 text-left">Telegram Members</th>
              <th className="p-4 text-left">Total Social Score</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : (
              socialData.map((crypto, index) => (
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
                      {crypto.twitterFollowers.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <i className="fab fa-reddit text-[#FF4500] mr-2"></i>
                      {crypto.redditSubscribers.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <i className="fab fa-telegram text-[#0088cc] mr-2"></i>
                      {crypto.telegramMembers.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">{crypto.socialScore.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-16 bg-[#161920] rounded-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Premium Membership Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6">
              <i className="fas fa-chart-line text-3xl text-[#2563eb] mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Real-Time Analytics</h3>
              <p className="text-[#94a3b8]">
                Access detailed market analysis and trends
              </p>
            </div>
            <div className="p-6">
              <i className="fas fa-bell text-3xl text-[#2563eb] mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Price Alerts</h3>
              <p className="text-[#94a3b8]">
                Get notified when prices hit your targets
              </p>
            </div>
            <div className="p-6">
              <i className="fas fa-user-shield text-3xl text-[#2563eb] mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Portfolio Tracking</h3>
              <p className="text-[#94a3b8]">
                Monitor your investments in one place
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
})

function StoryComponent() {
  const loading = false;
  const cryptoData = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: "50000",
      change: "2.5",
      sevenDayChange: "5.0",
      marketCap: "900",
      volume: "30",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "4000",
      change: "-1.2",
      sevenDayChange: "3.0",
      marketCap: "400",
      volume: "20",
    },
  ];
  const socialData = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      twitterFollowers: 1000000,
      redditSubscribers: 500000,
      telegramMembers: 200000,
      socialScore: 1700000,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      twitterFollowers: 800000,
      redditSubscribers: 400000,
      telegramMembers: 150000,
      socialScore: 1350000,
    },
  ];

  return (
    <div>
      <MainComponent
        loading={loading}
        cryptoData={cryptoData}
        socialData={socialData}
      />
    </div>
  );
};
}