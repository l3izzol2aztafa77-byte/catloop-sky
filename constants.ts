
import { Star, Mission } from './types';

export const BRIGHT_STARS: Star[] = [
  { id: 'sirius', nameEn: 'Sirius', nameTh: 'ดาวโจร', ra: 101.28, dec: -16.71, mag: -1.46, type: 'star', color: '#ffffff' },
  { id: 'canopus', nameEn: 'Canopus', nameTh: 'ดาวคาโนปัส', ra: 95.98, dec: -52.69, mag: -0.74, type: 'star', color: '#fff9e6' },
  { id: 'vega', nameEn: 'Vega', nameTh: 'ดาวเวกา', ra: 279.23, dec: 38.78, mag: 0.03, type: 'star', color: '#eef2ff' },
  { id: 'arcturus', nameEn: 'Arcturus', nameTh: 'ดาวดวงแก้ว', ra: 213.91, dec: 19.18, mag: -0.05, type: 'star', color: '#ffcc99' },
  { id: 'rigel', nameEn: 'Rigel', nameTh: 'ดาวไรเจล', ra: 78.63, dec: -8.20, mag: 0.12, type: 'star', color: '#b3d9ff' },
  { id: 'procyon', nameEn: 'Procyon', nameTh: 'ดาวโปรซิออน', ra: 114.82, dec: 5.22, mag: 0.34, type: 'star', color: '#fffdf0' },
  { id: 'betelgeuse', nameEn: 'Betelgeuse', nameTh: 'ดาวบีเทลจุส', ra: 88.79, dec: 7.40, mag: 0.42, type: 'star', color: '#ff6666' },
  { id: 'jupiter', nameEn: 'Jupiter', nameTh: 'ดาวพฤหัสบดี', ra: 45.0, dec: 15.0, mag: -2.5, type: 'planet', color: '#ffccaa' },
  { id: 'mars', nameEn: 'Mars', nameTh: 'ดาวอังคาร', ra: 120.0, dec: 22.0, mag: -0.5, type: 'planet', color: '#ff8888' },
  { id: 'saturn', nameEn: 'Saturn', nameTh: 'ดาวเสาร์', ra: 330.0, dec: -12.0, mag: 0.7, type: 'planet', color: '#ffeeb3' },
  { id: 'venus', nameEn: 'Venus', nameTh: 'ดาวศุกร์', ra: 280.0, dec: -20.0, mag: -4.4, type: 'planet', color: '#ffffff' },
];

// Updated MISSIONS to match the Mission type definition in types.ts
export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    titleTh: 'ตามหาซิริอุส',
    titleEn: 'Find Sirius',
    descriptionTh: 'ค้นหาดาวที่สว่างที่สุดในท้องฟ้าค่ำคืน',
    descriptionEn: 'Locate the brightest star in the night sky.',
    type: 'FIND',
    targetObjectId: 'sirius',
    difficulty: 1,
    estimatedMinutes: 2,
    completionCriteria: {
      secondsCentered: 3
    },
    rewards: {
      xp: 100,
      badgeId: 'cosmic-explorer',
      unlockKnowledgeIds: []
    }
  },
  {
    id: 'm2',
    titleTh: 'ดาวเคราะห์ยักษ์',
    titleEn: 'The Gas Giant',
    descriptionTh: 'ค้นหาดาวพฤหัสบดี ดาวเคราะห์ที่ใหญ่ที่สุด',
    descriptionEn: 'Find Jupiter, the largest planet.',
    type: 'FIND',
    targetObjectId: 'jupiter',
    difficulty: 1,
    estimatedMinutes: 2,
    completionCriteria: {
      secondsCentered: 3
    },
    rewards: {
      xp: 100,
      badgeId: 'planet-hunter',
      unlockKnowledgeIds: []
    }
  }
];

export const COLORS = {
  primary: '#00f3ff',
  secondary: '#bc13fe',
  background: '#05070a',
  surface: '#0f172a',
  accent: '#ff007f'
};
