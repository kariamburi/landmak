'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ShieldCheck, X } from 'lucide-react';

export const MapaPricingModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="text-sm text-green-700 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        View Verification Pricing
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white dark:bg-gray-900 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Mapa Land Verification Pricing
              </h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li>
                ✅ <strong>Basic (KES 300):</strong> Parcel check + conflict scan
              </li>
              <li>
                📝 <strong>Standard (KES 700):</strong> Dispute history + ownership validation
              </li>
              <li>
                🔍 <strong>Premium (KES 1500+):</strong> Title + GIS + advisory summary
              </li>
            </ul>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded"
            >
              Okay, Got It
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
