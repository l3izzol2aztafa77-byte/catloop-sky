
import { Star, Mission, Knowledge, AstroEvent, Constellation } from '../types';

export const STARS_DATA: Star[] = [
  { id: 'sirius', nameEn: 'Sirius', nameTh: 'ดาวโจร', ra: 101.28, dec: -16.71, mag: -1.46, type: 'star', color: '#ffffff' },
  { id: 'jupiter', nameEn: 'Jupiter', nameTh: 'ดาวพฤหัสบดี', ra: 65.5, dec: 22.1, mag: -2.5, type: 'planet', color: '#ffccaa' },
  { id: 'mars', nameEn: 'Mars', nameTh: 'ดาวอังคาร', ra: 155.0, dec: 10.0, mag: 0.1, type: 'planet', color: '#ff6666' },
  { id: 'saturn', nameEn: 'Saturn', nameTh: 'ดาวเสาร์', ra: 330.0, dec: -12.0, mag: 0.7, type: 'planet', color: '#ffeeb3' },
  { id: 'vega', nameEn: 'Vega', nameTh: 'ดาวเวกา', ra: 279.23, dec: 38.78, mag: 0.03, type: 'star', color: '#eef2ff' },
  { id: 'moon', nameEn: 'Moon', nameTh: 'ดวงจันทร์', ra: 180.0, dec: -10.0, mag: -12.0, type: 'moon', color: '#f0f0f0' },
  { id: 'canopus', nameEn: 'Canopus', nameTh: 'ดาวคาโนปัส', ra: 95.98, dec: -52.69, mag: -0.74, type: 'star', color: '#fff9e6' },
  { id: 'arcturus', nameEn: 'Arcturus', nameTh: 'ดาวดวงแก้ว', ra: 213.91, dec: 19.18, mag: -0.05, type: 'star', color: '#ffcc99' },
  { id: 'rigel', nameEn: 'Rigel', nameTh: 'ดาวไรเจล', ra: 78.63, dec: -8.20, mag: 0.12, type: 'star', color: '#b3d9ff' },
  { id: 'betelgeuse', nameEn: 'Betelgeuse', nameTh: 'ดาวบีเทลจุส', ra: 88.79, dec: 7.40, mag: 0.42, type: 'star', color: '#ff6666' },
  { id: 'bellatrix', nameEn: 'Bellatrix', nameTh: 'ดาวเบลลาทริกซ์', ra: 81.28, dec: 6.35, mag: 1.64, type: 'star', color: '#ffffff' },
  { id: 'alnilam', nameEn: 'Alnilam', nameTh: 'ดาวอัลนีลัม', ra: 84.05, dec: -1.20, mag: 1.69, type: 'star', color: '#ffffff' },
  { id: 'alnitak', nameEn: 'Alnitak', nameTh: 'ดาวอัลนีตัก', ra: 84.69, dec: -1.94, mag: 1.74, type: 'star', color: '#ffffff' },
  { id: 'mintaka', nameEn: 'Mintaka', nameTh: 'ดาวมินทากะ', ra: 83.00, dec: -0.30, mag: 2.25, type: 'star', color: '#ffffff' },
];

export const CONSTELLATIONS_DATA: Constellation[] = [
  {
    id: 'orion',
    nameEn: 'Orion',
    nameTh: 'กลุ่มดาวนายพราน',
    lines: [
      { fromId: 'betelgeuse', toId: 'bellatrix' },
      { fromId: 'bellatrix', toId: 'mintaka' },
      { fromId: 'mintaka', toId: 'alnilam' },
      { fromId: 'alnilam', toId: 'alnitak' },
      { fromId: 'alnitak', toId: 'rigel' },
      { fromId: 'rigel', toId: 'alnitak' }, // simple loop for visualization
      { fromId: 'betelgeuse', toId: 'alnitak' },
    ]
  }
];

export const MISSIONS_DATA: Mission[] = [
  {
    id: 'm1',
    titleEn: 'Solar Sentinel',
    titleTh: 'ค้นหาดาวพฤหัสบดี',
    descriptionTh: 'สังเกตการณ์ยักษ์ใหญ่แห่งระบบสุริยะด้วยสายตาของคุณเอง',
    descriptionEn: 'Observe the gas giant of our solar system with your own eyes.',
    type: 'FIND',
    targetObjectId: 'jupiter',
    difficulty: 1,
    estimatedMinutes: 5,
    completionCriteria: { secondsCentered: 3 },
    rewards: { xp: 120, badgeId: 'b1', unlockKnowledgeIds: ['k1'] }
  },
  {
    id: 'm2',
    titleEn: 'Lunar Gaze',
    titleTh: 'บันทึกดวงจันทร์',
    descriptionTh: 'ถ่ายภาพดวงจันทร์ในคืนที่ท้องฟ้าแจ่มใสที่สุด',
    descriptionEn: 'Capture the moon on the clearest night.',
    type: 'CAPTURE',
    targetObjectId: 'moon',
    difficulty: 2,
    estimatedMinutes: 3,
    completionCriteria: { requiresPhoto: true },
    rewards: { xp: 150, badgeId: 'b2', unlockKnowledgeIds: ['k2'] }
  },
  {
    id: 'm3',
    titleEn: 'Hunter of Orion',
    titleTh: 'ตามล่า Orion',
    descriptionTh: 'ค้นหากลุ่มดาวนายพรานที่สว่างไสวบนฟากฟ้า',
    descriptionEn: 'Locate the bright Orion constellation in the deep sky.',
    type: 'FIND',
    targetObjectId: 'betelgeuse',
    difficulty: 2,
    estimatedMinutes: 8,
    completionCriteria: { secondsCentered: 5 },
    rewards: { xp: 200, badgeId: 'b3', unlockKnowledgeIds: ['k3'] }
  }
];

export const KNOWLEDGE_DATA: Knowledge[] = [
  {
    id: 'k1',
    titleTh: 'ทำไมดาวจึงกะพริบ?',
    titleEn: 'Why Stars Twinkle?',
    bodyTh: 'ดาวกะพริบเพราะแสงของมันเดินทางผ่านชั้นบรรยากาศของโลกที่มีความหนาแน่นต่างกันและเคลื่อนไหวอยู่ตลอดเวลา...',
    bodyEn: 'Stars twinkle because their light travels through Earth\'s moving, turbulent atmosphere...',
    category: 'basics',
    tags: ['twinkling', 'physics'],
    relatedObjectsIds: [],
    estimatedReadTime: 1,
    isLocked: false,
  },
  {
    id: 'k2',
    titleTh: 'ยักษ์ใหญ่สีแดง',
    titleEn: 'Red Giants',
    bodyTh: 'Betelgeuse เป็นดาวฤกษ์ยักษ์แดงที่กำลังใกล้ถึงจุดจบของชีวิต มันมีขนาดใหญ่จนหากวางไว้กลางระบบสุริยะ มันจะกลืนกินดาวอังคารเข้าไป...',
    bodyEn: 'Betelgeuse is a red supergiant nearing the end of its life. If placed at the sun\'s center, it would engulf Mars...',
    category: 'stars',
    tags: ['stellar', 'evolution'],
    relatedObjectsIds: ['betelgeuse'],
    estimatedReadTime: 2,
    isLocked: true,
  }
];

export const EVENTS_DATA: AstroEvent[] = [
  {
    id: 'e1',
    titleTh: 'ฝนดาวตกเพอร์เซอิดส์',
    titleEn: 'Perseids Meteor Shower',
    date: '2025-08-12',
    type: 'meteor',
    descriptionTh: 'ช่วงเวลาที่สะเก็ดดาวหนาแน่นที่สุดในรอบปี',
    descriptionEn: 'The most dense meteor influx of the year.',
    tipTh: 'มองไปทางทิศตะวันออกเฉียงเหนือ หลังเที่ยงคืน',
    tipEn: 'Look Northeast after midnight.'
  }
];
