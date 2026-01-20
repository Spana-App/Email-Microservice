import * as fs from 'fs';
import * as path from 'path';

// Get SPANA logo as base64 data URI
export function getSpanaLogoBase64(): string {
  try {
    const logoPath = path.join(__dirname, '../assets/Attached_image.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    return `data:image/png;base64,${logoBase64}`;
  } catch (error) {
    console.error('[Logo] Failed to load logo:', error);
    // Return empty string if logo can't be loaded
    return '';
  }
}

// Logo HTML snippet for email headers
export function getSpanaLogoHTML(): string {
  const logoDataUri = getSpanaLogoBase64();
  if (!logoDataUri) return '';
  
  return `
    <div style="text-align: left; margin-bottom: 10px; padding: 0;">
      <img src="${logoDataUri}" alt="SPANA Logo" style="max-width: 80px; height: auto; display: block; margin: 0;" />
    </div>
  `;
}
