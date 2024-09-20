import React, { useContext, useState, useEffect } from "react";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import Hero from "../Hero";
import { CoinsContext } from "../../context/CoinsContext";

export default function CoinsTable() {
  const {
    coinData = [],
    loading,
    error,
    watchlist,
    toggleCoinInWatchlist,
    currency,
    page,
    setPage,
  } = useContext(CoinsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (error) {
      setFetchError("Fetching Error");
    } else {
      setFetchError(null);
    }
  }, [error]);

  function getPriceDisplay(price, currency) {
    switch (currency) {
      case "USD":
        return `$${price}`;
      case "EUR":
        return `€${price}`;
      case "RUB":
        return `₽${price}`;
      default:
        return price;
    }
  }

  const totalPages = 10;

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) return [...Array(totalPages).keys()].map((n) => n + 1);
    if (page <= 3) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const filteredCoins = coinData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black py-10 min-h-screen">
      <Hero />
      <div className="max-w-[1280px] mx-auto p-4">
        {fetchError ? (
          <div className="text-center mt-10 text-xl text-red-500 font-bold">
            {fetchError}
          </div>
        ) : (
          <>
            {loading ? (
              <div className="text-center mt-10 text-xl text-white">Loading...</div>
            ) : (
              <>
                <h2 className="text-white font-montserrat text-[34px] font-normal flex justify-center">
                  Cryptocurrency Prices by Market Cap
                </h2>
                <input
                  type="text"
                  placeholder="Search For a Crypto Currency..."
                  className="input w-full border-slate-500 mb-5 rounded-[5px] bg-black text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <table className="w-full bg-[#16171A] text-white text-left rounded-lg overflow-hidden shadow-lg">
                  <thead>
                    <tr className="bg-[#87CEEB] font-montserrat font-bold text-black text-sm font-semibold">
                      <th className="py-4 px-6">Coin</th>
                      <th className="py-4 px-6 text-right">Price</th>
                      <th className="py-4 px-6 text-right">24h Change</th>
                      <th className="py-4 px-6 text-right">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoins.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-white">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredCoins.map((coin) => (
                        <tr
                          key={coin.id}
                          className="border-b border-gray-700 h-[80px] hover:bg-gray-800 transition duration-300"
                        >
                          <td className="py-4 px-6 flex items-center space-x-4">
                            <Link
                              to={`/coins/${coin.id}`}
                              className="flex items-center"
                            >
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-[50px] mr-4"
                              />
                              <div>
                                <div className="text-base font-semibold">
                                  {coin.symbol.toUpperCase()}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {coin.name}
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-6 text-right text-base font-medium">
                            {getPriceDisplay(coin.current_price, currency)}
                          </td>
                          <td className="py-4 px-6 text-right text-base font-medium">
                            <IoMdEye
                              className={`inline-block mr-[16px] rounded-full cursor-pointer ${
                                watchlist.includes(coin.id)
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                              size={24}
                              onClick={() => toggleCoinInWatchlist(coin.id)}
                            />
                            <span
                              className={`ml-2 inline-block w-[50px] text-right ${
                                coin.price_change_percentage_24h > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              } pr-6`}
                            >
                              {coin.price_change_percentage_24h.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right text-base font-medium">
                            ${coin.market_cap.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="flex justify-center items-center mt-6 text-white">
                  <nav
                    aria-label="Pagination"
                    className="inline-flex items-center space-x-2"
                  >
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`px-3 py-1 ${
                        page === 1
                          ? "cursor-not-allowed text-gray-600"
                          : "hover:text-[#87CEEB]"
                      } transition-all`}
                    >
                      &lt;
                    </button>

                    {getPageNumbers().map((num, idx) =>
                      num === "..." ? (
                        <span key={idx} className="px-2">
                          ...
                        </span>
                      ) : (
                        <button
                          key={num}
                          onClick={() => setPage(num)}
                          className={`px-3 py-1 rounded-full transition-all ${
                            page === num
                              ? "bg-[#87CEEB] text-black"
                              : "hover:bg-gray-700 hover:text-white"
                          } ${page === num ? "" : "text-gray-400"}`}
                        >
                          {num}
                        </button>
                      )
                    )}

                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`px-3 py-1 ${
                        page === totalPages
                          ? "cursor-not-allowed text-gray-600"
                          : "hover:text-[#87CEEB]"
                      } transition-all`}
                    >
                      &gt;
                    </button>
                  </nav>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
