import React, { useState, useEffect } from 'react';
import { QrCode, Download, RefreshCw, Eye, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { Tile } from '../types';
import { useAppStore } from '../stores/appStore';
import { generateTileQRCode, downloadQRCodesAsZip, generateBulkQRCodes } from '../utils/qrCodeUtils';
import { updateTileQRCode, getSellerTilesWithQR, getSellerProfile } from '../lib/supabase';

interface QRCodeManagerProps {
  tiles: Tile[];
  sellerId?: string;
}

export const QRCodeManager: React.FC<QRCodeManagerProps> = ({ tiles, sellerId }) => {
  const { currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<{ [tileId: string]: string }>({});
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    loadSellerProfile();
    loadExistingQRCodes();
  }, [currentUser, tiles]);

  const loadSellerProfile = async () => {
    if (!currentUser) return;
    try {
      const profile = await getSellerProfile(currentUser.user_id);
      setSellerProfile(profile);
    } catch (error) {
      console.error('Error loading seller profile:', error);
    }
  };

  const loadExistingQRCodes = () => {
    const existingQRCodes: { [tileId: string]: string } = {};
    tiles.forEach(tile => {
      if (tile.qrCode) {
        existingQRCodes[tile.id] = tile.qrCode;
      }
    });
    setQrCodes(existingQRCodes);
  };

  const generateSingleQRCode = async (tile: Tile) => {
    setGeneratingQR(tile.id);
    try {
      const qrCode = await generateTileQRCode(tile);
      await updateTileQRCode(tile.id, qrCode);
      setQrCodes(prev => ({ ...prev, [tile.id]: qrCode }));
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setGeneratingQR(null);
    }
  };

  const generateAllQRCodes = async () => {
    setLoading(true);
    setDownloadProgress(0);
    
    try {
      const tilesWithoutQR = tiles.filter(tile => !qrCodes[tile.id]);
      
      for (let i = 0; i < tilesWithoutQR.length; i++) {
        const tile = tilesWithoutQR[i];
        try {
          const qrCode = await generateTileQRCode(tile);
          await updateTileQRCode(tile.id, qrCode);
          setQrCodes(prev => ({ ...prev, [tile.id]: qrCode }));
          setDownloadProgress(((i + 1) / tilesWithoutQR.length) * 100);
        } catch (error) {
          console.error(`Error generating QR code for tile ${tile.id}:`, error);
        }
      }
      
      alert('QR codes generated successfully!');
    } catch (error) {
      console.error('Error generating QR codes:', error);
      alert('Some QR codes failed to generate. Please try again.');
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  const downloadAllQRCodes = async () => {
    setLoading(true);
    try {
      const businessName = sellerProfile?.business_name || 'TileShowroom';
      
      // Ensure all tiles have QR codes
      const tilesWithQR = tiles.map(tile => ({
        ...tile,
        qrCode: qrCodes[tile.id]
      })).filter(tile => tile.qrCode);

      if (tilesWithQR.length === 0) {
        alert('No QR codes available. Please generate QR codes first.');
        return;
      }

      await downloadQRCodesAsZip(tilesWithQR, businessName);
    } catch (error) {
      console.error('Error downloading QR codes:', error);
      alert('Failed to download QR codes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tilesWithQR = tiles.filter(tile => qrCodes[tile.id]);
  const tilesWithoutQR = tiles.filter(tile => !qrCodes[tile.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <QrCode className="w-8 h-8 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-800 mb-2">QR Code Management</h3>
            <p className="text-blue-700 mb-4">
              Generate and download QR codes for your tiles. Customers can scan these codes with their mobile devices 
              to view tiles in 3D visualization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">Total Tiles: {tiles.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800">With QR Codes: {tilesWithQR.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800">Missing QR Codes: {tilesWithoutQR.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={generateAllQRCodes}
          disabled={loading || tilesWithoutQR.length === 0}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : `Generate Missing QR Codes (${tilesWithoutQR.length})`}
        </button>

        <button
          onClick={downloadAllQRCodes}
          disabled={loading || tilesWithQR.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Download QR Codes Package ({tilesWithQR.length})
        </button>
      </div>

      {/* Progress Bar */}
      {loading && downloadProgress > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Generating QR Codes...</span>
            <span className="text-sm text-gray-500">{Math.round(downloadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Tiles Grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Tile QR Codes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => {
            const hasQR = qrCodes[tile.id];
            const isGenerating = generatingQR === tile.id;
            
            return (
              <div key={tile.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={tile.imageUrl}
                    alt={tile.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-800 truncate">{tile.name}</h5>
                    <p className="text-sm text-gray-600">{tile.size}</p>
                    <p className="text-sm text-gray-500">{tile.category}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasQR ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">QR Ready</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-700">No QR Code</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {hasQR && (
                      <button
                        onClick={() => {
                          const img = new Image();
                          img.src = qrCodes[tile.id];
                          const newWindow = window.open();
                          newWindow?.document.write(`
                            <html>
                              <head><title>QR Code - ${tile.name}</title></head>
                              <body style="margin:0;padding:20px;text-align:center;">
                                <h2>${tile.name}</h2>
                                <p>Size: ${tile.size} | Category: ${tile.category}</p>
                                <img src="${qrCodes[tile.id]}" style="max-width:300px;" />
                                <p><small>Scan with mobile device to view in 3D</small></p>
                              </body>
                            </html>
                          `);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Preview QR Code"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => generateSingleQRCode(tile)}
                      disabled={isGenerating}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                      title={hasQR ? "Regenerate QR Code" : "Generate QR Code"}
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">How to Use QR Codes</h4>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">1</span>
            <p>Generate QR codes for all your tiles using the buttons above.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">2</span>
            <p>Download the QR codes package which includes individual PNG files and a CSV list.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">3</span>
            <p>Print each QR code (recommended minimum size: 2x2 inches) and attach to the corresponding tile.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">4</span>
            <p>Customers can scan the QR codes with their mobile devices to view tiles in 3D visualization.</p>
          </div>
        </div>
      </div>
    </div>
  );
};