'use client';

import { useTranslations } from 'next-intl';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingSuccessModal({ isOpen, onClose }: BookingSuccessModalProps) {
  const t = useTranslations('booking.success');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 dark:bg-green-900 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
          {t('title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t('message')}
        </p>
        <button
          onClick={onClose}
          className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
}

