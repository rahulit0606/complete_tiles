import React from 'react';
import { Smartphone, QrCode, Download, ExternalLink } from 'lucide-react';

export const MobileAppInfo: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <Smartphone className="w-8 h-8 text-purple-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-purple-800 mb-2">Mobile App Coming Soon!</h3>
          <p className="text-purple-700 mb-4">
            Scan QR codes on tiles in physical showrooms to instantly view them in 3D on your mobile device.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <QrCode className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">Scan QR Codes</p>
                <p className="text-sm text-gray-600">On physical tiles</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">3D Visualization</p>
                <p className="text-sm text-gray-600">On your phone</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Download className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">Save Favorites</p>
                <p className="text-sm text-gray-600">Sync across devices</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              disabled
              className="flex items-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download for iOS (Coming Soon)
            </button>
            <button 
              disabled
              className="flex items-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download for Android (Coming Soon)
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>For now:</strong> You can scan QR codes with any QR code reader app, and it will open the web version 
              with the selected tile automatically loaded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};