import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { prisma } from './prisma';

export interface CardGenerationResult {
  pdfBuffer: Buffer;
  qrCodeDataUrl: string;
}

/**
 * Generates a premium standalone credit-card sized PDF (Front & Back) and the QR code.
 */
export async function generateMemberCard(memberId: string): Promise<CardGenerationResult> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      district: true,
      assembly: true,
    },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  if (!member.membershipId) {
    throw new Error('Member has no membership ID assigned yet');
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify/${member.membershipId}`;

  // 1. Generate QR Code (Data URL)
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    margin: 1,
    width: 200,
    color: {
      dark: '#0F172A', // Deep slate/navy
      light: '#FFFFFF',
    },
  });

  // 2. Generate PDF Card
  // Dimensions for double-CR80 card (486 pt x 306 pt)
  const width = 486;
  const height = 306;

  const doc = new PDFDocument({
    size: [width, height],
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  // --- PAGE 1: FRONT OF THE CARD ---
  // Background
  doc.rect(0, 0, width, height).fill('#0F172A'); // Premium dark background

  // Gold borders & design accents
  doc.rect(10, 10, width - 20, height - 20).stroke('#D97706'); // Gold border
  doc.rect(10, 10, width - 20, 45).fill('#1E293B'); // Header panel

  // Header Text
  doc.fillColor('#F59E0B').fontSize(16).font('Helvetica-Bold');
  doc.text('TAMILAGA VETRI KAZHAGAM', 20, 20, { align: 'center', width: width - 40 });
  doc.fillColor('#94A3B8').fontSize(9).font('Helvetica');
  doc.text('UTTAR PRADESH DIGITAL MEMBERSHIP CARD', 20, 40, { align: 'center', width: width - 40 });

  // Photo Frame (placeholder silhouette or loaded image)
  const photoX = 30;
  const photoY = 75;
  const photoWidth = 100;
  const photoHeight = 120;

  doc.rect(photoX, photoY, photoWidth, photoHeight).fill('#1E293B');
  doc.rect(photoX, photoY, photoWidth, photoHeight).stroke('#D97706');

  // Draw Photo Fallback Silhouette
  doc.fillColor('#475569');
  doc.circle(photoX + photoWidth / 2, photoY + 45, 20).fill(); // Head
  doc.rect(photoX + 20, photoY + 75, photoWidth - 40, 40).fill(); // Body

  // Member Information Labels & Values
  const infoX = 150;
  const infoY = 75;
  const lineSpacing = 20;

  const drawInfoRow = (label: string, value: string, index: number) => {
    const yPos = infoY + index * lineSpacing;
    doc.fillColor('#94A3B8').fontSize(9).font('Helvetica-Bold').text(label, infoX, yPos);
    doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica').text(value, infoX + 80, yPos);
  };

  drawInfoRow('MEMBER NAME', member.fullName.toUpperCase(), 0);
  drawInfoRow('MEMBER ID', member.membershipId, 1);
  drawInfoRow('DISTRICT', member.district.name.toUpperCase(), 2);
  drawInfoRow('CONSTITUENCY', member.assembly.name.toUpperCase(), 3);
  drawInfoRow('JOIN DATE', member.joiningDate.toLocaleDateString('en-IN'), 4);
  drawInfoRow('CARD STATUS', 'ACTIVE', 5);

  // QR Code on Front Card (Bottom Right)
  const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
  doc.image(qrBuffer, width - 110, height - 110, { width: 80, height: 80 });

  // Footer Branding Accent
  doc.rect(10, height - 25, width - 20, 15).fill('#D97706'); // Gold footer accent bar
  doc.fillColor('#0F172A').fontSize(8).font('Helvetica-Bold');
  doc.text('TVK UTTAR PRADESH DIGITAL ORGANISATION', 20, height - 21, { align: 'center', width: width - 40 });

  // --- PAGE 2: BACK OF THE CARD ---
  doc.addPage();

  // Background
  doc.rect(0, 0, width, height).fill('#0F172A');
  doc.rect(10, 10, width - 20, height - 20).stroke('#D97706'); // Gold border

  // Header Back
  doc.rect(10, 10, width - 20, 45).fill('#1E293B');
  doc.fillColor('#F59E0B').fontSize(16).font('Helvetica-Bold');
  doc.text('MEMBERSHIP TERMS & VERIFICATION', 20, 22, { align: 'center', width: width - 40 });

  // Terms and Instructions
  doc.fillColor('#E2E8F0').fontSize(8.5).font('Helvetica');
  const termsX = 30;
  const termsY = 75;
  const termsSpacing = 15;

  const drawTermRow = (text: string, index: number) => {
    doc.text(`• ${text}`, termsX, termsY + index * termsSpacing, { width: width - 60 });
  };

  drawTermRow('This card is an official TVK Uttar Pradesh digital membership card.', 0);
  drawTermRow('Membership credentials can be updated only through authenticated channels.', 1);
  drawTermRow('Scan the QR code on the front to verify this card\'s active status live.', 2);
  drawTermRow('Keep your membership information secure. Do not share your login OTP.', 3);
  drawTermRow('For help or support, contact the TVK UP Digital Helpdesk.', 4);

  // Warning Disclaimer (Crucial political rule)
  doc.rect(20, height - 80, width - 40, 45).fill('#1E293B');
  doc.rect(20, height - 80, width - 40, 45).stroke('#EF4444'); // Red alert border
  doc.fillColor('#EF4444').fontSize(7.5).font('Helvetica-Bold');
  doc.text('IMPORTANT DISCLAIMER:', 30, height - 73, { width: width - 60 });
  doc.fillColor('#F1F5F9').fontSize(7.5).font('Helvetica');
  doc.text('This card is a party membership card and is not a government identity document. It is intended solely for internal organisational purposes.', 30, height - 63, { width: width - 60 });

  // Finish PDF Generation
  doc.end();

  // Wait for doc to end and resolve buffer
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on('error', (err) => {
      reject(err);
    });
  });

  return {
    pdfBuffer,
    qrCodeDataUrl,
  };
}
