export interface DocumentItem {
  id: string;
  original_filename: string;
  stored_filename: string;
  file_type: string;
  status: 'uploaded' | 'processed' | 'processing';
  uploaded_at: string;
  size_kb: number;
  total_pages: number;
  tables_count: number;
  ocr_applied: boolean;
  category: 'Geological Report' | 'Production Sheet' | 'Borehole Assay' | 'Environmental Compliance' | 'Field Photo Capture' | 'Mining Document' | 'Assay Spreadsheet' | 'Field Notes Log' | 'Production Spreadsheet';
  subsidiary: string; // e.g. "CMPDI RI-II", "ECL", "SECL", "CCL"
}

export interface PageItem {
  id: number | string;
  document_id: string;
  page_number: number;
  text: string;
  ocr_used?: boolean;
  confidence?: number;
  scanned_snippet?: string;
  key_metrics?: string[];
  has_tables?: boolean;
  has_figures?: boolean;
  ocr_confidence?: number;
}

export interface TableItem {
  id?: string;
  document_id: string;
  page_number: number;
  table_index?: number;
  title: string;
  headers: string[];
  rows: (string | number)[][];
  confidence?: number;
}

export interface ExtractedFigure {
  id: number;
  document_id: string;
  page_number: number;
  metric: string;
  value: number;
  unit: string;
  year?: number;
  confidence: number;
  source_snippet: string;
}

export interface ValidationIssue {
  id: number;
  document_id: string;
  page_number: number;
  comparing_document_id?: string;
  comparing_page_number?: number;
  issue_type: 'discrepancy' | 'out_of_range' | 'missing_unit' | 'unverified_figure';
  metric: string;
  description: string;
  severity: 'warning' | 'error' | 'resolved';
  value_a?: string | number;
  value_b?: string | number;
  geologist_verified?: boolean;
}

export interface GroundedSource {
  document_id: string;
  document_name: string;
  page_number: number;
  score: number;
  snippet: string;
  verified_value?: string;
}

export interface QueryRecord {
  id: string;
  question: string;
  answer: string;
  sources: GroundedSource[];
  timestamp: string;
  retrieval_method: 'TF-IDF + Cosine Similarity' | 'Hybrid Dense/Sparse';
  confidence_rating: 'High (100% Grounded)' | 'Medium (Needs Verification)';
  calculation_shown?: string;
}

export interface MiningTopic {
  name: string;
  score: number;
  keywords: string[];
  color: string;
}

export interface ProductionDataPoint {
  year: number;
  target_mt: number;
  actual_mt: number;
  overburden_mcu_m: number;
  stripping_ratio: number;
  subsidiary: string;
}

export interface JudgeQAItem {
  id: string;
  question: string;
  category: string;
  difficulty: 'Hard' | 'Very Hard' | 'Critical Stress Test';
  whyJudgesAsk: string;
  winningAnswer: string;
  demoAction: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  subsidiary: string;
  department: string;
  clearanceLevel: string;
  badge: string;
  lastLogin: string;
  permissions: string[];
}

export interface GeneratedReport {
  id: string;
  documentId: string;
  documentName: string;
  sourceType: 'picture' | 'document' | 'sample';
  imagePreviewUrl?: string;
  timestamp: string;
  title: string;
  regionalInstitute: string;
  preparedBy: string;
  resourceTotal: string;
  summary: string;
  keyFindings: Array<{ label: string; value: string; unit?: string; status?: 'normal' | 'positive' | 'warning'; note?: string }>;
  extractedTables: Array<{ title: string; headers: string[]; rows: (string | number)[][] }>;
  conclusion: string;
  conclusionReason: string;
  conclusionPoints: Array<{ title: string; explanation: string; evidence: string; confidence: number }>;
  recommendations: string[];
  discrepancies: ValidationIssue[];
  sources: Array<{ docId: string; page: number; desc: string }>;
  unfcCategory: string;
  confidenceScore: number;
}

export interface WordCloudItem {
  text: string;
  value: number; // relative size/weight
  category: 'geology' | 'mining' | 'quality' | 'regulatory' | 'general';
  occurrences: number;
  sampleContext: string;
}

export interface IdentifiedTopic {
  id: string;
  name: string;
  category: string;
  relevance: number; // percentage (e.g. 96%)
  keywordCount: number;
  keywords: string[];
  summary: string;
  sentimentRisk: 'Compliant & Verified' | 'High Feasibility' | 'Minor Variance' | 'Action Recommended';
  documentCoverage: number; // percentage (e.g. 34%)
  excerpts: Array<{ page: number; text: string }>;
  color: string;
}

