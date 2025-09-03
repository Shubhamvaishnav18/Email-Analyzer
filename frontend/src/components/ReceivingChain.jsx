import React from 'react';
import { FaServer } from 'react-icons/fa';

const ReceivingChain = ({ receivingChain = [] }) => {
  if (!receivingChain || receivingChain.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Receiving Chain</h3>
        <p className="text-gray-500">No receiving chain data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-xs sm:text-sm lg:text-base">
      <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base lg:text-lg">
        Receiving Chain
      </h3>
      <div className="space-y-4">
        {receivingChain.map((server, index) => (
          <div
            key={index}
            className="flex items-start text-[10px] sm:text-xs lg:text-sm"
          >
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaServer className="text-blue-600 text-sm sm:text-base lg:text-lg" />
              </div>
            </div>

            <div className="ml-3 sm:ml-4">
              <p className="break-words text-[11px] sm:text-sm lg:text-base font-medium text-gray-900">
                {server}
              </p>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                Hop {index + 1}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default ReceivingChain;