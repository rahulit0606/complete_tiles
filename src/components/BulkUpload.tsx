import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { uploadBulkTiles } from '../lib/supabase';
import { useAppStore } from '../stores/appStore';

export const BulkUpload: React.FC = () => {
  const { currentShowroom } = useAppStore();
  const [csvData, setCsvData] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: number; errors: string[] } | null>(null);

  // Common tile sizes
  const commonTileSizes = [
    '30x30 cm', '30x60 cm', '40x40 cm', '40x60 cm', '60x60 cm', '60x120 cm',
    '80x80 cm', '10x30 cm', '15x90 cm', '20x120 cm', '25x40 cm', '7.5x15 cm',
    '6x25 cm', '20x20 cm', '100x100 cm', '45x45 cm', '50x50 cm', '75x75 cm'
  ];

  const sampleCSV = `name,category,size,price,inStock,imageUrl,textureUrl
Marble White Elite,both,60x60 cm,2500,true,https://example.com/image1.jpg,https://example.com/texture1.jpg
Dark Wood Pattern,floor,20x120 cm,1800,true,https://example.com/image2.jpg,https://example.com/texture2.jpg
Modern Gray Stone,both,30x60 cm,2200,false,https://example.com/image3.jpg,https://example.com/texture3.jpg
Ceramic Subway White,wall,10x30 cm,1200,true,https://example.com/image4.jpg,https://example.com/texture4.jpg
Polished Concrete,floor,80x80 cm,2800,true,https://example.com/image5.jpg,https://example.com/texture5.jpg`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_tiles.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCsvData = (csv: string) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const tiles = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const tile: any = {
        id: `bulk_${Date.now()}_${i}`,
        showroomId: currentShowroom?.id
      };

      headers.forEach((header, index) => {
        const value = values[index];
        switch (header) {
          case 'price':
            tile[header] = parseFloat(value) || 0;
            break;
          case 'inStock':
            tile[header] = value.toLowerCase() === 'true';
            break;
          default:
            tile[header] = value;
        }
      });

      tiles.push(tile);
    }

    return tiles;
  };

  const handleBulkUpload = async () => {
    if (!csvData.trim() || !currentShowroom) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const tiles = parseCsvData(csvData);
      const result = await uploadBulkTiles(tiles);
      
      setUploadResult({
        success: result.length,
        errors: []
      });
      
      setCsvData('');
      
      // Refresh the page to show new tiles
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      setUploadResult({
        success: 0,
        errors: [error.message || 'Upload failed']
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">CSV Format Instructions</h3>
            <p className="text-blue-700 text-sm mb-3">
              Upload multiple tiles at once using CSV format. Required columns: name, category, size, price, inStock, imageUrl, textureUrl
            </p>
            <div className="mb-3">
              <p className="text-blue-700 text-sm font-medium mb-2">Common Tile Sizes:</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {commonTileSizes.map((size) => (
                  <span key={size} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-blue-700 text-sm font-medium mb-1">Category Options:</p>
              <div className="flex gap-2 text-xs">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">floor</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">wall</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">both</span>
              </div>
            </div>
            <button
              onClick={downloadSampleCSV}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Sample CSV
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CSV Data
        </label>
        <div className="mb-2 text-sm text-gray-600">
          <p className="mb-1"><strong>Format:</strong> name,category,size,price,inStock,imageUrl,textureUrl</p>
          <p><strong>Example:</strong> Marble Elite,both,60x60 cm,2500,true,https://...,https://...</p>
        </div>
        <textarea
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder="Paste your CSV data here or type it manually..."
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleBulkUpload}
          disabled={!csvData.trim() || isUploading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload Tiles'}
        </button>
      </div>

      {uploadResult && (
        <div className={`p-4 rounded-lg ${
          uploadResult.errors.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-start gap-3">
            {uploadResult.errors.length > 0 ? (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            <div>
              <h3 className={`font-semibold mb-2 ${
                uploadResult.errors.length > 0 ? 'text-red-800' : 'text-green-800'
              }`}>
                Upload Result
              </h3>
              <p className={`text-sm ${
                uploadResult.errors.length > 0 ? 'text-red-700' : 'text-green-700'
              }`}>
                Successfully uploaded: {uploadResult.success} tiles
              </p>
              {uploadResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-700 text-sm font-medium">Errors:</p>
                  <ul className="list-disc list-inside text-red-600 text-sm mt-1">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};