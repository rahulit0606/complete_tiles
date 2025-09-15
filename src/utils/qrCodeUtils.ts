import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Tile } from '../types';

// Generate QR code for a tile
export const generateTileQRCode = async (tile: Tile): Promise<string> => {
  try {
    // Create a deep link URL that will work for both web and mobile
    const baseUrl = window.location.origin;
    const qrData = {
      type: 'tile',
      tileId: tile.id,
      showroomId: tile.showroomId,
      webUrl: `${baseUrl}?tile=${tile.id}&showroom=${tile.showroomId}`,
      // Mobile app will use the tileId and showroomId to fetch tile data
      mobileData: {
        tileId: tile.id,
        showroomId: tile.showroomId,
        tileName: tile.name,
        category: tile.category,
        size: tile.size,
        price: tile.price
      }
    };

    // Generate QR code as base64 data URL
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Generate QR codes for multiple tiles
export const generateBulkQRCodes = async (tiles: Tile[]): Promise<{ [tileId: string]: string }> => {
  const qrCodes: { [tileId: string]: string } = {};
  
  for (const tile of tiles) {
    try {
      qrCodes[tile.id] = await generateTileQRCode(tile);
    } catch (error) {
      console.error(`Error generating QR code for tile ${tile.id}:`, error);
    }
  }
  
  return qrCodes;
};

// Download QR codes as a ZIP file
export const downloadQRCodesAsZip = async (tiles: Tile[], businessName: string = 'TileShowroom') => {
  try {
    const zip = new JSZip();
    const qrFolder = zip.folder('QR_Codes');
    
    // Generate a CSV file with tile information
    const csvContent = [
      'Tile ID,Tile Name,Category,Size,Price,QR Code File',
      ...tiles.map(tile => 
        `"${tile.id}","${tile.name}","${tile.category}","${tile.size}","${tile.price}","${tile.id}_qr.png"`
      )
    ].join('\n');
    
    zip.file('tile_qr_codes_list.csv', csvContent);
    
    // Add instructions file
    const instructions = `
QR Code Instructions for ${businessName}

This package contains QR codes for all your tiles. Each QR code contains:
- Tile ID and basic information
- Direct link to web visualization
- Mobile app compatibility data

How to use:
1. Print each QR code (recommended size: 2x2 inches minimum)
2. Attach the QR code to the corresponding tile in your showroom
3. Customers can scan with any QR code reader or your mobile app
4. The QR code will show the tile in 3D visualization

Files included:
- tile_qr_codes_list.csv: Complete list of tiles and their QR code files
- QR_Codes folder: Individual QR code images for each tile

For support, contact your platform administrator.
Generated on: ${new Date().toLocaleDateString()}
    `.trim();
    
    zip.file('README.txt', instructions);
    
    // Generate QR codes for each tile
    for (const tile of tiles) {
      try {
        const qrCodeDataUrl = await generateTileQRCode(tile);
        // Convert data URL to blob
        const base64Data = qrCodeDataUrl.split(',')[1];
        qrFolder?.file(`${tile.id}_qr.png`, base64Data, { base64: true });
      } catch (error) {
        console.error(`Error adding QR code for tile ${tile.id}:`, error);
      }
    }
    
    // Generate and download the ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const fileName = `${businessName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Codes_${new Date().toISOString().split('T')[0]}.zip`;
    saveAs(zipBlob, fileName);
    
    return true;
  } catch (error) {
    console.error('Error creating QR codes ZIP:', error);
    throw new Error('Failed to create QR codes package');
  }
};

// Parse QR code data (for mobile app or web app)
export const parseQRCodeData = (qrData: string) => {
  try {
    const data = JSON.parse(qrData);
    if (data.type === 'tile' && data.tileId && data.showroomId) {
      return data;
    }
    throw new Error('Invalid QR code format');
  } catch (error) {
    console.error('Error parsing QR code data:', error);
    return null;
  }
};

// Handle QR code scan (for web app)
export const handleQRCodeScan = (qrData: string) => {
  const parsedData = parseQRCodeData(qrData);
  if (parsedData) {
    // Redirect to tile view with the scanned tile
    const url = new URL(window.location.href);
    url.searchParams.set('tile', parsedData.tileId);
    url.searchParams.set('showroom', parsedData.showroomId);
    window.location.href = url.toString();
    return true;
  }
  return false;
};