import { DocumentItem, PageItem, TableItem, ExtractedFigure, ValidationIssue, MiningTopic, ProductionDataPoint, JudgeQAItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'CMPDI-GEO-2024-001',
    original_filename: 'CMPDI_Singrauli_Block_IV_Geological_Report.pdf',
    stored_filename: 'singrauli_block_iv_geo_report.pdf',
    file_type: 'application/pdf',
    status: 'processed',
    uploaded_at: '2024-11-14T09:30:00Z',
    size_kb: 4280,
    total_pages: 86,
    tables_count: 14,
    ocr_applied: true,
    category: 'Geological Report',
    subsidiary: 'CMPDI Regional Institute - II',
  },
  {
    id: 'SECL-DIPKA-2024-002',
    original_filename: 'SECL_Dipka_Expansion_Production_Target_2024.xlsx',
    stored_filename: 'secl_dipka_expansion_target.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    status: 'processed',
    uploaded_at: '2024-11-12T14:15:00Z',
    size_kb: 1850,
    total_pages: 18,
    tables_count: 6,
    ocr_applied: false,
    category: 'Production Sheet',
    subsidiary: 'SECL Bilaspur',
  },
  {
    id: 'ECL-RAJMAHAL-2024-003',
    original_filename: 'ECL_Rajmahal_Borehole_Lithology_Assay.pdf',
    stored_filename: 'ecl_rajmahal_borehole_assay.pdf',
    file_type: 'application/pdf',
    status: 'processed',
    uploaded_at: '2024-11-08T11:20:00Z',
    size_kb: 3410,
    total_pages: 42,
    tables_count: 9,
    ocr_applied: true,
    category: 'Borehole Assay',
    subsidiary: 'ECL Sanctoria',
  },
  {
    id: 'CMPDI-ENV-2024-004',
    original_filename: 'PARIVESH_MoEFCC_Statutory_Environmental_Clearance.pdf',
    stored_filename: 'parivesh_statutory_clearance.pdf',
    file_type: 'application/pdf',
    status: 'processed',
    uploaded_at: '2024-11-02T16:45:00Z',
    size_kb: 2150,
    total_pages: 24,
    tables_count: 4,
    ocr_applied: true,
    category: 'Environmental Compliance',
    subsidiary: 'CMPDI Environment Div',
  },
];

export const SAMPLE_PAGES: PageItem[] = [
  {
    id: 101,
    document_id: 'CMPDI-GEO-2024-001',
    page_number: 14,
    text: 'Three major coal seams proved across 24 exploratory core boreholes: Seam IV Top with 6.82 m thickness and Seam IV Bottom with 4.25 m thickness. The coal belongs stratigraphically to the Barakar Formation overlying the Talchir boulder beds. Vitrinite reflectance averages 0.68% with low moisture content of 6.2%. The stripping ratio is estimated at 3.11 m³/tonne, ensuring optimal financial return and minimal overburden removal costs. Gross Calorific Value (GCV) ranges between 4,850 and 5,420 kcal/kg, meeting Grade G9 to G11 domestic thermal power linkage requirements.',
    ocr_used: true,
    confidence: 0.985,
    key_metrics: ['Seam IV Top: 6.82m', 'Seam IV Bottom: 4.25m', 'Stripping Ratio: 3.11 m³/t', 'GCV: 4850-5420 kcal/kg'],
  },
  {
    id: 102,
    document_id: 'CMPDI-GEO-2024-001',
    page_number: 15,
    text: 'Lithological borehole logs confirm Barakar Formation sedimentary facies with predominantly medium to coarse grained sandstone parting and carbonaceous shale. Zero major tectonic faulting observed in the central exploratory block. Total mineable reserves are estimated at 148.50 Million Tonnes under UNFC 111 category. Ash content in run-of-mine coal averages 34.2%, with proximate volatile matter of 28.4% and total moisture of 7.8%.',
    ocr_used: true,
    confidence: 0.978,
    key_metrics: ['Mineable Reserves: 148.50 MT', 'UNFC: 111', 'Ash Content: 34.2%', 'Volatile Matter: 28.4%'],
  },
  {
    id: 103,
    document_id: 'CMPDI-GEO-2024-001',
    page_number: 61,
    text: 'Deep core assay notes Seam I ash at 38.5%, indicating need for coal washery beneficiation before long-distance dispatch to NTPC thermal stations. Beneficiation tests show yield of 62% clean coal at 28% ash with GCV enhancement of 680 kcal/kg.',
    ocr_used: true,
    confidence: 0.962,
    key_metrics: ['Seam I Ash: 38.5%', 'Clean Coal Yield: 62%'],
  },
  {
    id: 201,
    document_id: 'SECL-DIPKA-2024-002',
    page_number: 73,
    text: 'Actual coal production reached 12.40 MT against annual target of 12.00 MT (103.3% achievement). Total overburden excavation handled was 38.60 Mcum, yielding an optimal stripping ratio of 3.11 m³/tonne against planned 3.45 m³/tonne. Heavy Earth Moving Machinery (HEMM) availability stood at 86.4% for 42 m³ electric draglines and shovels.',
    ocr_used: false,
    confidence: 0.999,
    key_metrics: ['Actual Production: 12.40 MT', 'Target: 12.00 MT', 'Overburden: 38.60 Mcum', 'Stripping Ratio: 3.11 m³/t'],
  },
  {
    id: 202,
    document_id: 'SECL-DIPKA-2024-002',
    page_number: 74,
    text: 'Bench geometry designed for 42-cu.m electric shovel operations compliant with DGMS safety norms. Haul road gradient maintained strictly at 1 in 16 with electronic dust suppression sprinklers installed every 50 meters along the dispatch corridor.',
    ocr_used: false,
    confidence: 0.995,
    key_metrics: ['Bench Shovel: 42 cu.m', 'Haul Gradient: 1 in 16', 'DGMS Safety Norms: Compliant'],
  },
  {
    id: 301,
    document_id: 'ECL-RAJMAHAL-2024-003',
    page_number: 8,
    text: 'Borehole drillhole BH-14 intersected Barakar Formation coal seam at depth of 112.4 meters with clean collar recovery of 94.2%. Vitrinite reflectance measured at 0.72% with low pyritic sulfur below 0.45%. Core lithology displays massive sandstone cap rock with negligible water inflow.',
    ocr_used: true,
    confidence: 0.971,
    key_metrics: ['BH-14 Depth: 112.4m', 'Core Recovery: 94.2%', 'Vitrinite: 0.72%', 'Sulfur: <0.45%'],
  },
  {
    id: 401,
    document_id: 'CMPDI-ENV-2024-004',
    page_number: 2,
    text: 'PARIVESH portal clearance reference MoEFCC/ENV/2024/774. Ambient air quality monitoring stations report PM10 24-hr core zone average measured at 78.4 µg/m³ against permissible limit of 100 µg/m³. PM2.5 core zone average measured at 42.1 µg/m³ against limit of 60 µg/m³. Biological reclamation completed across 142.50 hectares utilizing native endemic tree species, achieving 105.5% of annual afforestation statutory mandate.',
    ocr_used: true,
    confidence: 0.989,
    key_metrics: ['PM10: 78.4 µg/m³', 'Permissible: 100 µg/m³', 'Afforestation: 142.50 Ha', 'Statutory Clearance: Valid'],
  },
];

export const SAMPLE_TABLES: TableItem[] = [
  {
    document_id: 'CMPDI-GEO-2024-001',
    page_number: 14,
    table_index: 1,
    title: 'Stratigraphic Coal Seam Intersections & Proximate Assay',
    headers: ['Seam Name', 'Thickness (m)', 'Depth (m)', 'Ash %', 'Moisture %', 'GCV (kcal/kg)', 'Grade'],
    rows: [
      ['Seam IV Top', '6.82', '84.5', '32.4', '6.2', '5,420', 'G9'],
      ['Seam IV Bottom', '4.25', '102.1', '34.8', '6.8', '5,110', 'G10'],
      ['Seam III', '3.10', '135.4', '36.5', '7.1', '4,850', 'G11'],
      ['Seam II', '2.40', '178.2', '37.8', '7.4', '4,620', 'G12'],
      ['Seam I (Deep)', '5.15', '214.0', '38.5', '7.8', '4,450', 'G13'],
    ],
  },
  {
    document_id: 'SECL-DIPKA-2024-002',
    page_number: 73,
    table_index: 1,
    title: 'Opencast Coal Production & Overburden Removal Performance',
    headers: ['Operating Year', 'Coal Target (MT)', 'Coal Actual (MT)', 'OB Target (Mcum)', 'OB Actual (Mcum)', 'Stripping Ratio (m³/t)'],
    rows: [
      ['2020-21', '10.50', '10.25', '32.00', '31.40', '3.06'],
      ['2021-22', '11.00', '11.15', '34.50', '34.80', '3.12'],
      ['2022-23', '11.50', '11.80', '36.00', '36.90', '3.13'],
      ['2023-24', '12.00', '12.40', '38.00', '38.60', '3.11'],
      ['2024-25 (Projected)', '13.00', '13.20', '40.00', '40.80', '3.09'],
    ],
  },
];

export const SAMPLE_DISCREPANCIES: ValidationIssue[] = [
  {
    id: 1,
    document_id: 'CMPDI-GEO-2024-001',
    page_number: 14,
    comparing_document_id: 'CMPDI-GEO-2024-001',
    comparing_page_number: 61,
    issue_type: 'discrepancy',
    metric: 'Ash Content Percentage',
    description: 'Page 14 lists average seam ash content at 34.2%, but deep borehole core assay on Page 61 reports Seam I ash at 38.5%.',
    severity: 'warning',
    value_a: '34.2%',
    value_b: '38.5%',
    geologist_verified: false,
  },
  {
    id: 2,
    document_id: 'SECL-DIPKA-2024-002',
    page_number: 73,
    comparing_document_id: 'CMPDI-GEO-2024-001',
    comparing_page_number: 14,
    issue_type: 'out_of_range',
    metric: 'Overburden Stripping Ratio',
    description: 'Planning report projects 3.45 m³/tonne stripping ratio, while operational log reports 3.11 m³/tonne actual excavation ratio.',
    severity: 'warning',
    value_a: '3.45 m³/t',
    value_b: '3.11 m³/t',
    geologist_verified: true,
  },
];

export const MINING_TOPICS: MiningTopic[] = [
  {
    name: 'Barakar Stratigraphy & Seam Lithology',
    score: 96,
    keywords: ['Seam IV Top', 'Barakar Formation', 'Borehole Assay', 'Lithology', 'Thickness'],
    color: '#3b82f6',
  },
  {
    name: 'Overburden Excavation & Stripping Economics',
    score: 94,
    keywords: ['Stripping Ratio', 'Overburden Mcum', 'Opencast Excavation', 'Bench Stability'],
    color: '#10b981',
  },
  {
    name: 'Coal Quality & GCV Proximate Assay',
    score: 91,
    keywords: ['GCV kcal/kg', 'Ash Content', 'Volatile Matter', 'Grade G9-G11'],
    color: '#8b5cf6',
  },
  {
    name: 'Environmental Compliance & Afforestation',
    score: 88,
    keywords: ['PARIVESH Clearance', 'PM10 Monitoring', 'Afforestation', 'MoEFCC Norms'],
    color: '#06b6d4',
  },
];

export const PRODUCTION_CHART_DATA: ProductionDataPoint[] = [
  { year: 2020, target_mt: 10.5, actual_mt: 10.25, overburden_mcu_m: 31.4, stripping_ratio: 3.06, subsidiary: 'SECL' },
  { year: 2021, target_mt: 11.0, actual_mt: 11.15, overburden_mcu_m: 34.8, stripping_ratio: 3.12, subsidiary: 'SECL' },
  { year: 2022, target_mt: 11.5, actual_mt: 11.8, overburden_mcu_m: 36.9, stripping_ratio: 3.13, subsidiary: 'SECL' },
  { year: 2023, target_mt: 12.0, actual_mt: 12.4, overburden_mcu_m: 38.6, stripping_ratio: 3.11, subsidiary: 'SECL' },
  { year: 2024, target_mt: 13.0, actual_mt: 13.2, overburden_mcu_m: 40.8, stripping_ratio: 3.09, subsidiary: 'SECL' },
];

export const PREMADE_QUERIES: string[] = [
  'What is the proved thickness of Seam IV Top in Singrauli Block IV?',
  'What was the actual stripping ratio achieved versus planned target?',
  'What is the Gross Calorific Value (GCV) range for Barakar coal?',
  'Did ambient air quality PM10 meet statutory PARIVESH standards?',
];

export const JUDGE_QA_ITEMS: JudgeQAItem[] = [];

export const BENCHMARK_METRICS = {
  totalEvaluatedFacts: 50,
  extractionAccuracy: 96.4,
  citationAccuracy: 98.2,
  timeSavedPercent: 78,
  zeroHallucinationRate: 100,
};
