export type AppView =
  | 'home'
  | 'explore'
  | 'park-detail'
  | 'passport'
  | 'missions'
  | 'collection'
  | 'profile';

export type StampMotif =
  | 'rapids'
  | 'khmer-cliff'
  | 'elephant-forest'
  | 'waterfall'
  | 'siam-tulip'
  | 'stream-canyon'
  | 'reservoir-peak'
  | 'rock-pillar'
  | 'sunrise-cliff'
  | 'maple-plateau'
  | 'twin-summit'
  | 'layered-falls'
  | 'mushroom-rock'
  | 'bat-cave'
  | 'ancient-cave'
  | 'iron-ridge'
  | 'emerald-ridge'
  | 'thermometer-pine'
  | 'naga-cave'
  | 'stone-pillar-field'
  | 'dinosaur'
  | 'lotus-pond'
  | 'mist-border'
  | 'buddha-footprint'
  | 'talipot-palm'
  | 'border-savanna';

export type IsanSubRegion = 'อีสานเหนือ' | 'อีสานกลาง' | 'อีสานใต้' | 'ชายแดนตะวันตก-เขาใหญ่';

export interface NationalPark {
  id: string;
  code: string;
  number: number;
  name: string;
  englishName: string;
  provinces: string[];
  primaryProvince: string;
  subRegion: IsanSubRegion;
  coverImage: string;
  history: string;
  highlights: string[];
  bestSeason: string;
  elevation: string;
  areaSqKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPos: {
    x: number;
    y: number;
  };
  stampMotif: StampMotif;
  stampInkColor: string;
  stampTitle: string;
  stampTagline: string;
  qrCodeValue: string;
  rangerPin: string;
}

export type VerificationMethod = 'qr-scan' | 'ranger-pin';

export interface StampRecord {
  parkId: string;
  visitDate: string; // YYYY-MM-DD
  stampedAt: string; // ISO timestamp
  verificationMethod: VerificationMethod;
  verificationCode: string;
  note: string;
  photoDataUrl?: string;
}

export interface TravelerProfile {
  displayName: string;
  homeProvince: string;
  bio: string;
  avatarUrl: string;
}

export interface SheetsSyncConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  sheetTabName: string;
  lastSyncedAt: string | null;
}
