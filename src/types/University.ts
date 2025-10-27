export interface UniversityUnit {
  unitId: string;
  unitName: string;
  minTotalGPA: number;
  minSSC_GPA?: number;
  minHSC_GPA?: number;
  groupAllowed: string[];
  notes: string;
  lastVerified: string;
  examDate: string;
  lastApplyDate: string;
  allowedYears?: {
    ssc: number[];
    hsc: number[];
  };
}
export interface University {
  id: string;
  name: string;
  type: 'public' | 'private';
  website: string;
  admission_page: string;
  units: UniversityUnit[];
  lastUpdated: string;
  editable: boolean;
  isActive: boolean;
  createdAt: Date;
  allowedYears?: {
    ssc: number[];
    hsc: number[];
  };
}
export interface StudentData {
  sscYear: string;
  hscYear: string;
  sscGPA: number;
  hscGPA: number;
  group: string;
}