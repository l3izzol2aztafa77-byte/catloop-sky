
export interface Star {
  id: string;
  nameEn: string;
  nameTh: string;
  ra: number;
  dec: number;
  mag: number;
  type: 'star' | 'planet' | 'moon' | 'constellation';
  color?: string;
  image?: string;
}

export interface ConstellationLine {
  fromId: string;
  toId: string;
}

export interface Constellation {
  id: string;
  nameEn: string;
  nameTh: string;
  lines: ConstellationLine[];
}

export interface AltAz {
  alt: number;
  az: number;
}

export interface Mission {
  id: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  type: 'FIND' | 'TRACK' | 'CAPTURE' | 'LEARN';
  targetObjectId?: string;
  difficulty: number;
  estimatedMinutes: number;
  completionCriteria: {
    secondsCentered?: number;
    revisitAfterMinutes?: number;
    requiresPhoto?: boolean;
    quizId?: string;
  };
  rewards: {
    xp: number;
    badgeId?: string;
    unlockKnowledgeIds: string[];
  };
}

export interface Knowledge {
  id: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  category: 'basics' | 'navigation' | 'stars' | 'planets' | 'equipment' | 'safety';
  tags: string[];
  relatedObjectsIds: string[];
  estimatedReadTime: number;
  isLocked: boolean;
}

export interface AstroEvent {
  id: string;
  titleTh: string;
  titleEn: string;
  date: string;
  type: 'meteor' | 'eclipse' | 'conjunction' | 'moon';
  descriptionTh: string;
  descriptionEn: string;
  tipTh: string;
  tipEn: string;
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  completedMissionIds: string[];
  unlockedKnowledgeIds: string[];
  badges: string[];
  photos: string[];
}

export type ViewState = 'onboarding' | 'home' | 'ar' | 'map' | 'missions' | 'library' | 'profile' | 'mission_detail' | 'knowledge_detail' | 'events' | 'photo_helper';

export interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
