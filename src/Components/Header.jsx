import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import { CoinsContext } from '../context/CoinsContext';
import Logo from '../assets/CRYPTOFOLIO.png';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { coinData, watchlist, toggleCoinInWatchlist } = useContext(CoinsContext);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const { setCurrency } = useContext(CoinsContext);
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div className='top-0 left-0 w-full bg-[#14161A] shadow-md z-50'>
      <div className='max-w-[1280px] h-[64px] flex justify-between items-center mx-auto p-2 px-4'>
        <Link to="/"> 
          <img src={Logo} alt="Logo" />
        </Link>
        <div className="flex gap-4">
          <select
            id="currency"
            name="currency"
            className="block p-2 border border-[#14161A] text-white bg-[#14161A] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleCurrencyChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUB">RUB</option>
          </select>
          <div className="text-center">
            <button
              onClick={toggleDrawer}
              className="font-roboto font-medium text-black bg-[#87CEEB] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded text-sm px-5 py-2.5 dark:bg-[#87CEEB] dark:hover:bg-blue-400 focus:outline-none dark:focus:ring-blue-800 p-0"
              type="button"
            >
              WATCH LIST
            </button>
            <div
              className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-[400px]'} bg-[#515151]`}
              style={{ width: '400px' }}
              aria-labelledby="drawer-right-label"
            >
              <button
                type="button"
                onClick={toggleDrawer}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close menu</span>
              </button>
              <div className="p-[10px]">
                <h3 className="text-xl font-semibold text-white mb-4 font-medium">WATCHLIST</h3>
                <div className="flex flex-wrap gap-[10px]">
                  {watchlist.map((id) => {
                    const coin = coinData.find((coin) => coin.id === id);
                    if (!coin) return null;
                    return (
                      <div key={coin.id} className="bg-[#14161A] py-[30px] px-[30px] rounded-[25px] flex flex-col items-center" style={{ width: '160px' }}>
                        <img src={coin.image} alt={coin.name} className="w-[100px] h-[100px] mb-2" />
                        <div className="text-white mt-[30px] text-[14px] font-roboto font-normal mb-2">${coin.market_cap.toLocaleString()}</div>
                        <button
                          onClick={() => toggleCoinInWatchlist(coin.id)}
                          className="text-white py-[4px] px-[17px] bg-[#FF0000] hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
