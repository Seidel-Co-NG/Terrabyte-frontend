import React from 'react';
import { networksList } from './utils';

type Props = {
  selectedNetwork?: string | null;
  onNetworkSelected: (network: string) => void;
};

export default function NetworkSelector({ selectedNetwork, onNetworkSelected }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Select Network</span>
      </div>
      <div className="flex gap-3">
        {networksList.map((network) => {
          const isSelected = selectedNetwork === network.name;
          return (
            <button
              key={network.name}
              onClick={() => onNetworkSelected(network.name)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg shadow-sm transition-colors ${
                isSelected ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white'
              }`}
            >
              <img src={network.logo} alt={network.name} className="w-8 h-8" />
              <span className="text-xs font-bold">{network.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
