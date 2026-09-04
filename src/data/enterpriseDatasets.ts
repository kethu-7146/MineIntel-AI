import { ActionRecommendation } from '../utils/statisticalEngine';

export interface OperationalRecord {
  id: string;
  year: number;
  quarter: string;
  subsidiary: 'SECL' | 'ECL' | 'CCL' | 'BCCL' | 'NCL' | 'MCL' | 'WCL';
  mine: string;
  target_mt: number;
  actual_mt: number;
  variance_mt: number;
  achievement_pct: number;
  ob_target_mcum: number;
  ob_actual_mcum: number;
  stripping_ratio: number;
  hemm_availability_pct: number;
  diesel_l_per_t: number;
  cost_per_t_inr: number;
  safety_incident_free_days: number;
}

export interface QualityAssayRecord {
  id: string;
  subsidiary: string;
  block: string;
  seam: string;
  depth_m: number;
  thickness_m: number;
  ash_pct: number;
  moisture_pct: number;
  volatile_matter_pct: number;
  gcv_kcal_kg: number;
  grade: string;
  clean_coal_yield_pct: number;
  sulfur_pct: number;
  core_recovery_pct: number;
  beneficiation_required: boolean;
}

export interface EnvironmentalRecord {
  id: string;
  subsidiary: string;
  site: string;
  period: string;
  pm10_ug_m3: number;
  pm25_ug_m3: number;
  noise_day_db: number;
  effluent_ph: number;
  effluent_bod_mg_l: number;
  afforestation_target_ha: number;
  afforestation_actual_ha: number;
  compliance_status: 'Fully Compliant' | 'Warning' | 'Exceeded Threshold';
}

// Master Operational Dataset (Time series across subsidiaries)
export const ENTERPRISE_OPERATIONAL_DATA: OperationalRecord[] = [
  // SECL Dipka & Gevra
  { id: 'OP-001', year: 2021, quarter: 'Q1', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.75, actual_mt: 2.82, variance_mt: 0.07, achievement_pct: 102.5, ob_target_mcum: 8.6, ob_actual_mcum: 8.7, stripping_ratio: 3.09, hemm_availability_pct: 88.4, diesel_l_per_t: 1.82, cost_per_t_inr: 845, safety_incident_free_days: 145 },
  { id: 'OP-002', year: 2021, quarter: 'Q2', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.80, actual_mt: 2.76, variance_mt: -0.04, achievement_pct: 98.6, ob_target_mcum: 8.8, ob_actual_mcum: 8.5, stripping_ratio: 3.08, hemm_availability_pct: 85.1, diesel_l_per_t: 1.94, cost_per_t_inr: 870, safety_incident_free_days: 235 },
  { id: 'OP-003', year: 2021, quarter: 'Q3', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.65, actual_mt: 2.68, variance_mt: 0.03, achievement_pct: 101.1, ob_target_mcum: 8.2, ob_actual_mcum: 8.4, stripping_ratio: 3.13, hemm_availability_pct: 84.8, diesel_l_per_t: 1.98, cost_per_t_inr: 882, safety_incident_free_days: 325 },
  { id: 'OP-004', year: 2021, quarter: 'Q4', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.80, actual_mt: 2.89, variance_mt: 0.09, achievement_pct: 103.2, ob_target_mcum: 8.9, ob_actual_mcum: 9.2, stripping_ratio: 3.18, hemm_availability_pct: 89.2, diesel_l_per_t: 1.78, cost_per_t_inr: 830, safety_incident_free_days: 415 },
  { id: 'OP-005', year: 2022, quarter: 'Q1', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.85, actual_mt: 2.92, variance_mt: 0.07, achievement_pct: 102.5, ob_target_mcum: 9.0, ob_actual_mcum: 9.1, stripping_ratio: 3.12, hemm_availability_pct: 87.6, diesel_l_per_t: 1.84, cost_per_t_inr: 855, safety_incident_free_days: 505 },
  { id: 'OP-006', year: 2022, quarter: 'Q2', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.90, actual_mt: 2.95, variance_mt: 0.05, achievement_pct: 101.7, ob_target_mcum: 9.1, ob_actual_mcum: 9.3, stripping_ratio: 3.15, hemm_availability_pct: 86.8, diesel_l_per_t: 1.88, cost_per_t_inr: 862, safety_incident_free_days: 595 },
  { id: 'OP-007', year: 2022, quarter: 'Q3', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.75, actual_mt: 2.81, variance_mt: 0.06, achievement_pct: 102.2, ob_target_mcum: 8.7, ob_actual_mcum: 8.9, stripping_ratio: 3.17, hemm_availability_pct: 85.9, diesel_l_per_t: 1.92, cost_per_t_inr: 875, safety_incident_free_days: 685 },
  { id: 'OP-008', year: 2022, quarter: 'Q4', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.00, actual_mt: 3.12, variance_mt: 0.12, achievement_pct: 104.0, ob_target_mcum: 9.2, ob_actual_mcum: 9.6, stripping_ratio: 3.08, hemm_availability_pct: 89.8, diesel_l_per_t: 1.74, cost_per_t_inr: 820, safety_incident_free_days: 775 },
  { id: 'OP-009', year: 2023, quarter: 'Q1', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.00, actual_mt: 3.08, variance_mt: 0.08, achievement_pct: 102.7, ob_target_mcum: 9.4, ob_actual_mcum: 9.5, stripping_ratio: 3.08, hemm_availability_pct: 88.5, diesel_l_per_t: 1.80, cost_per_t_inr: 840, safety_incident_free_days: 865 },
  { id: 'OP-010', year: 2023, quarter: 'Q2', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.05, actual_mt: 3.14, variance_mt: 0.09, achievement_pct: 103.0, ob_target_mcum: 9.5, ob_actual_mcum: 9.7, stripping_ratio: 3.09, hemm_availability_pct: 87.2, diesel_l_per_t: 1.85, cost_per_t_inr: 850, safety_incident_free_days: 955 },
  { id: 'OP-011', year: 2023, quarter: 'Q3', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 2.85, actual_mt: 2.94, variance_mt: 0.09, achievement_pct: 103.2, ob_target_mcum: 9.0, ob_actual_mcum: 9.2, stripping_ratio: 3.13, hemm_availability_pct: 86.4, diesel_l_per_t: 1.89, cost_per_t_inr: 865, safety_incident_free_days: 1045 },
  { id: 'OP-012', year: 2023, quarter: 'Q4', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.10, actual_mt: 3.24, variance_mt: 0.14, achievement_pct: 104.5, ob_target_mcum: 10.1, ob_actual_mcum: 10.2, stripping_ratio: 3.15, hemm_availability_pct: 90.1, diesel_l_per_t: 1.72, cost_per_t_inr: 815, safety_incident_free_days: 1135 },
  { id: 'OP-013', year: 2024, quarter: 'Q1', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.20, actual_mt: 3.32, variance_mt: 0.12, achievement_pct: 103.8, ob_target_mcum: 10.0, ob_actual_mcum: 10.1, stripping_ratio: 3.04, hemm_availability_pct: 89.4, diesel_l_per_t: 1.76, cost_per_t_inr: 825, safety_incident_free_days: 1225 },
  { id: 'OP-014', year: 2024, quarter: 'Q2', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.25, actual_mt: 3.30, variance_mt: 0.05, achievement_pct: 101.5, ob_target_mcum: 10.1, ob_actual_mcum: 10.3, stripping_ratio: 3.12, hemm_availability_pct: 87.8, diesel_l_per_t: 1.83, cost_per_t_inr: 845, safety_incident_free_days: 1315 },
  { id: 'OP-015', year: 2024, quarter: 'Q3', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.10, actual_mt: 3.18, variance_mt: 0.08, achievement_pct: 102.6, ob_target_mcum: 9.6, ob_actual_mcum: 9.9, stripping_ratio: 3.11, hemm_availability_pct: 86.9, diesel_l_per_t: 1.87, cost_per_t_inr: 858, safety_incident_free_days: 1405 },
  { id: 'OP-016', year: 2024, quarter: 'Q4', subsidiary: 'SECL', mine: 'Dipka Mega OCP', target_mt: 3.45, actual_mt: 3.40, variance_mt: -0.05, achievement_pct: 98.6, ob_target_mcum: 10.3, ob_actual_mcum: 10.5, stripping_ratio: 3.09, hemm_availability_pct: 86.4, diesel_l_per_t: 1.81, cost_per_t_inr: 838, safety_incident_free_days: 1495 },

  // ECL Rajmahal & Sonepur Bazari
  { id: 'OP-017', year: 2021, quarter: 'Q1', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.20, actual_mt: 2.85, variance_mt: -0.35, achievement_pct: 89.1, ob_target_mcum: 6.4, ob_actual_mcum: 5.8, stripping_ratio: 2.04, hemm_availability_pct: 74.5, diesel_l_per_t: 2.25, cost_per_t_inr: 960, safety_incident_free_days: 98 },
  { id: 'OP-018', year: 2021, quarter: 'Q2', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.10, actual_mt: 2.72, variance_mt: -0.38, achievement_pct: 87.7, ob_target_mcum: 6.2, ob_actual_mcum: 5.5, stripping_ratio: 2.02, hemm_availability_pct: 72.8, diesel_l_per_t: 2.38, cost_per_t_inr: 985, safety_incident_free_days: 188 },
  { id: 'OP-019', year: 2021, quarter: 'Q3', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 2.90, actual_mt: 2.60, variance_mt: -0.30, achievement_pct: 89.7, ob_target_mcum: 5.8, ob_actual_mcum: 5.1, stripping_ratio: 1.96, hemm_availability_pct: 71.2, diesel_l_per_t: 2.45, cost_per_t_inr: 1010, safety_incident_free_days: 278 },
  { id: 'OP-020', year: 2021, quarter: 'Q4', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.30, actual_mt: 3.05, variance_mt: -0.25, achievement_pct: 92.4, ob_target_mcum: 6.6, ob_actual_mcum: 6.2, stripping_ratio: 2.03, hemm_availability_pct: 78.4, diesel_l_per_t: 2.18, cost_per_t_inr: 940, safety_incident_free_days: 368 },
  { id: 'OP-021', year: 2022, quarter: 'Q1', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.25, actual_mt: 3.02, variance_mt: -0.23, achievement_pct: 92.9, ob_target_mcum: 6.5, ob_actual_mcum: 6.1, stripping_ratio: 2.02, hemm_availability_pct: 79.1, diesel_l_per_t: 2.14, cost_per_t_inr: 932, safety_incident_free_days: 458 },
  { id: 'OP-022', year: 2022, quarter: 'Q2', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.20, actual_mt: 2.98, variance_mt: -0.22, achievement_pct: 93.1, ob_target_mcum: 6.4, ob_actual_mcum: 6.0, stripping_ratio: 2.01, hemm_availability_pct: 77.6, diesel_l_per_t: 2.20, cost_per_t_inr: 945, safety_incident_free_days: 548 },
  { id: 'OP-023', year: 2022, quarter: 'Q3', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.00, actual_mt: 2.82, variance_mt: -0.18, achievement_pct: 94.0, ob_target_mcum: 6.0, ob_actual_mcum: 5.7, stripping_ratio: 2.02, hemm_availability_pct: 76.5, diesel_l_per_t: 2.26, cost_per_t_inr: 955, safety_incident_free_days: 638 },
  { id: 'OP-024', year: 2022, quarter: 'Q4', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.40, actual_mt: 3.28, variance_mt: -0.12, achievement_pct: 96.5, ob_target_mcum: 6.8, ob_actual_mcum: 6.7, stripping_ratio: 2.04, hemm_availability_pct: 82.1, diesel_l_per_t: 2.05, cost_per_t_inr: 915, safety_incident_free_days: 728 },
  { id: 'OP-025', year: 2023, quarter: 'Q1', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.35, actual_mt: 3.25, variance_mt: -0.10, achievement_pct: 97.0, ob_target_mcum: 6.7, ob_actual_mcum: 6.6, stripping_ratio: 2.03, hemm_availability_pct: 83.2, diesel_l_per_t: 2.02, cost_per_t_inr: 908, safety_incident_free_days: 818 },
  { id: 'OP-026', year: 2023, quarter: 'Q2', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.30, actual_mt: 3.20, variance_mt: -0.10, achievement_pct: 97.0, ob_target_mcum: 6.6, ob_actual_mcum: 6.5, stripping_ratio: 2.03, hemm_availability_pct: 81.8, diesel_l_per_t: 2.08, cost_per_t_inr: 920, safety_incident_free_days: 908 },
  { id: 'OP-027', year: 2023, quarter: 'Q3', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.10, actual_mt: 3.01, variance_mt: -0.09, achievement_pct: 97.1, ob_target_mcum: 6.2, ob_actual_mcum: 6.1, stripping_ratio: 2.03, hemm_availability_pct: 80.5, diesel_l_per_t: 2.15, cost_per_t_inr: 935, safety_incident_free_days: 998 },
  { id: 'OP-028', year: 2023, quarter: 'Q4', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.50, actual_mt: 3.48, variance_mt: -0.02, achievement_pct: 99.4, ob_target_mcum: 7.0, ob_actual_mcum: 7.1, stripping_ratio: 2.04, hemm_availability_pct: 85.2, diesel_l_per_t: 1.95, cost_per_t_inr: 890, safety_incident_free_days: 1088 },
  { id: 'OP-029', year: 2024, quarter: 'Q1', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.55, actual_mt: 3.52, variance_mt: -0.03, achievement_pct: 99.2, ob_target_mcum: 7.1, ob_actual_mcum: 7.1, stripping_ratio: 2.02, hemm_availability_pct: 84.6, diesel_l_per_t: 1.98, cost_per_t_inr: 895, safety_incident_free_days: 1178 },
  { id: 'OP-030', year: 2024, quarter: 'Q2', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.50, actual_mt: 3.42, variance_mt: -0.08, achievement_pct: 97.7, ob_target_mcum: 7.0, ob_actual_mcum: 6.9, stripping_ratio: 2.02, hemm_availability_pct: 82.4, diesel_l_per_t: 2.04, cost_per_t_inr: 912, safety_incident_free_days: 1268 },
  { id: 'OP-031', year: 2024, quarter: 'Q3', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.25, actual_mt: 3.19, variance_mt: -0.06, achievement_pct: 98.2, ob_target_mcum: 6.5, ob_actual_mcum: 6.4, stripping_ratio: 2.01, hemm_availability_pct: 81.3, diesel_l_per_t: 2.10, cost_per_t_inr: 928, safety_incident_free_days: 1358 },
  { id: 'OP-032', year: 2024, quarter: 'Q4', subsidiary: 'ECL', mine: 'Rajmahal OCP', target_mt: 3.65, actual_mt: 3.68, variance_mt: 0.03, achievement_pct: 100.8, ob_target_mcum: 7.3, ob_actual_mcum: 7.4, stripping_ratio: 2.01, hemm_availability_pct: 86.8, diesel_l_per_t: 1.90, cost_per_t_inr: 875, safety_incident_free_days: 1448 },

  // NCL Singrauli (Jayant & Nigahi)
  { id: 'OP-033', year: 2023, quarter: 'Q1', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 4.80, actual_mt: 5.04, variance_mt: 0.24, achievement_pct: 105.0, ob_target_mcum: 18.5, ob_actual_mcum: 19.1, stripping_ratio: 3.79, hemm_availability_pct: 91.2, diesel_l_per_t: 1.62, cost_per_t_inr: 780, safety_incident_free_days: 820 },
  { id: 'OP-034', year: 2023, quarter: 'Q2', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 4.90, actual_mt: 5.12, variance_mt: 0.22, achievement_pct: 104.5, ob_target_mcum: 18.8, ob_actual_mcum: 19.4, stripping_ratio: 3.79, hemm_availability_pct: 90.5, diesel_l_per_t: 1.65, cost_per_t_inr: 792, safety_incident_free_days: 910 },
  { id: 'OP-035', year: 2023, quarter: 'Q3', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 4.60, actual_mt: 4.78, variance_mt: 0.18, achievement_pct: 103.9, ob_target_mcum: 17.6, ob_actual_mcum: 18.2, stripping_ratio: 3.81, hemm_availability_pct: 89.8, diesel_l_per_t: 1.70, cost_per_t_inr: 805, safety_incident_free_days: 1000 },
  { id: 'OP-036', year: 2023, quarter: 'Q4', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 5.10, actual_mt: 5.42, variance_mt: 0.32, achievement_pct: 106.3, ob_target_mcum: 19.5, ob_actual_mcum: 20.3, stripping_ratio: 3.75, hemm_availability_pct: 93.4, diesel_l_per_t: 1.55, cost_per_t_inr: 755, safety_incident_free_days: 1090 },
  { id: 'OP-037', year: 2024, quarter: 'Q1', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 5.20, actual_mt: 5.51, variance_mt: 0.31, achievement_pct: 106.0, ob_target_mcum: 19.8, ob_actual_mcum: 20.6, stripping_ratio: 3.74, hemm_availability_pct: 92.8, diesel_l_per_t: 1.58, cost_per_t_inr: 765, safety_incident_free_days: 1180 },
  { id: 'OP-038', year: 2024, quarter: 'Q2', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 5.25, actual_mt: 5.48, variance_mt: 0.23, achievement_pct: 104.4, ob_target_mcum: 20.0, ob_actual_mcum: 20.8, stripping_ratio: 3.80, hemm_availability_pct: 91.5, diesel_l_per_t: 1.63, cost_per_t_inr: 778, safety_incident_free_days: 1270 },
  { id: 'OP-039', year: 2024, quarter: 'Q3', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 4.95, actual_mt: 5.18, variance_mt: 0.23, achievement_pct: 104.6, ob_target_mcum: 18.9, ob_actual_mcum: 19.7, stripping_ratio: 3.80, hemm_availability_pct: 90.2, diesel_l_per_t: 1.68, cost_per_t_inr: 790, safety_incident_free_days: 1360 },
  { id: 'OP-040', year: 2024, quarter: 'Q4', subsidiary: 'NCL', mine: 'Jayant OCP', target_mt: 5.50, actual_mt: 5.82, variance_mt: 0.32, achievement_pct: 105.8, ob_target_mcum: 21.0, ob_actual_mcum: 22.0, stripping_ratio: 3.78, hemm_availability_pct: 93.8, diesel_l_per_t: 1.52, cost_per_t_inr: 742, safety_incident_free_days: 1450 },

  // CCL North Karanpura / Amrapali
  { id: 'OP-041', year: 2023, quarter: 'Q1', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 3.60, actual_mt: 3.78, variance_mt: 0.18, achievement_pct: 105.0, ob_target_mcum: 5.4, ob_actual_mcum: 5.6, stripping_ratio: 1.48, hemm_availability_pct: 87.5, diesel_l_per_t: 1.42, cost_per_t_inr: 690, safety_incident_free_days: 640 },
  { id: 'OP-042', year: 2023, quarter: 'Q2', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 3.65, actual_mt: 3.74, variance_mt: 0.09, achievement_pct: 102.5, ob_target_mcum: 5.5, ob_actual_mcum: 5.5, stripping_ratio: 1.47, hemm_availability_pct: 86.2, diesel_l_per_t: 1.46, cost_per_t_inr: 705, safety_incident_free_days: 730 },
  { id: 'OP-043', year: 2023, quarter: 'Q3', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 3.40, actual_mt: 3.32, variance_mt: -0.08, achievement_pct: 97.6, ob_target_mcum: 5.1, ob_actual_mcum: 4.8, stripping_ratio: 1.45, hemm_availability_pct: 81.4, diesel_l_per_t: 1.58, cost_per_t_inr: 735, safety_incident_free_days: 820 },
  { id: 'OP-044', year: 2023, quarter: 'Q4', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 3.80, actual_mt: 3.96, variance_mt: 0.16, achievement_pct: 104.2, ob_target_mcum: 5.7, ob_actual_mcum: 5.9, stripping_ratio: 1.49, hemm_availability_pct: 88.6, diesel_l_per_t: 1.38, cost_per_t_inr: 680, safety_incident_free_days: 910 },
  { id: 'OP-045', year: 2024, quarter: 'Q1', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 3.90, actual_mt: 4.12, variance_mt: 0.22, achievement_pct: 105.6, ob_target_mcum: 5.8, ob_actual_mcum: 6.1, stripping_ratio: 1.48, hemm_availability_pct: 89.2, diesel_l_per_t: 1.36, cost_per_t_inr: 672, safety_incident_free_days: 1000 },
  { id: 'OP-046', year: 2024, quarter: 'Q2', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 3.95, actual_mt: 4.05, variance_mt: 0.10, achievement_pct: 102.5, ob_target_mcum: 5.9, ob_actual_mcum: 6.0, stripping_ratio: 1.48, hemm_availability_pct: 87.4, diesel_l_per_t: 1.41, cost_per_t_inr: 692, safety_incident_free_days: 1090 },
  { id: 'OP-047', year: 2024, quarter: 'Q3', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 3.70, actual_mt: 3.65, variance_mt: -0.05, achievement_pct: 98.6, ob_target_mcum: 5.5, ob_actual_mcum: 5.3, stripping_ratio: 1.45, hemm_availability_pct: 83.1, diesel_l_per_t: 1.51, cost_per_t_inr: 720, safety_incident_free_days: 1180 },
  { id: 'OP-048', year: 2024, quarter: 'Q4', subsidiary: 'CCL', mine: 'Amrapali OCP', target_mt: 4.10, actual_mt: 4.31, variance_mt: 0.21, achievement_pct: 105.1, ob_target_mcum: 6.1, ob_actual_mcum: 6.4, stripping_ratio: 1.48, hemm_availability_pct: 90.5, diesel_l_per_t: 1.32, cost_per_t_inr: 660, safety_incident_free_days: 1270 },

  // BCCL Jharia Coking Coal (High stripping & complexity)
  { id: 'OP-049', year: 2023, quarter: 'Q1', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.45, actual_mt: 1.32, variance_mt: -0.13, achievement_pct: 91.0, ob_target_mcum: 7.8, ob_actual_mcum: 7.1, stripping_ratio: 5.38, hemm_availability_pct: 76.2, diesel_l_per_t: 3.10, cost_per_t_inr: 1450, safety_incident_free_days: 210 },
  { id: 'OP-050', year: 2023, quarter: 'Q2', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.40, actual_mt: 1.28, variance_mt: -0.12, achievement_pct: 91.4, ob_target_mcum: 7.6, ob_actual_mcum: 6.8, stripping_ratio: 5.31, hemm_availability_pct: 74.8, diesel_l_per_t: 3.25, cost_per_t_inr: 1485, safety_incident_free_days: 300 },
  { id: 'OP-051', year: 2023, quarter: 'Q3', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.25, actual_mt: 1.15, variance_mt: -0.10, achievement_pct: 92.0, ob_target_mcum: 6.8, ob_actual_mcum: 6.1, stripping_ratio: 5.30, hemm_availability_pct: 72.5, diesel_l_per_t: 3.42, cost_per_t_inr: 1540, safety_incident_free_days: 390 },
  { id: 'OP-052', year: 2023, quarter: 'Q4', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.50, actual_mt: 1.42, variance_mt: -0.08, achievement_pct: 94.7, ob_target_mcum: 8.1, ob_actual_mcum: 7.7, stripping_ratio: 5.42, hemm_availability_pct: 79.4, diesel_l_per_t: 3.02, cost_per_t_inr: 1410, safety_incident_free_days: 480 },
  { id: 'OP-053', year: 2024, quarter: 'Q1', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.50, actual_mt: 1.44, variance_mt: -0.06, achievement_pct: 96.0, ob_target_mcum: 8.1, ob_actual_mcum: 7.8, stripping_ratio: 5.42, hemm_availability_pct: 80.5, diesel_l_per_t: 2.98, cost_per_t_inr: 1395, safety_incident_free_days: 570 },
  { id: 'OP-054', year: 2024, quarter: 'Q2', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.48, actual_mt: 1.41, variance_mt: -0.07, achievement_pct: 95.3, ob_target_mcum: 8.0, ob_actual_mcum: 7.6, stripping_ratio: 5.39, hemm_availability_pct: 78.9, diesel_l_per_t: 3.08, cost_per_t_inr: 1425, safety_incident_free_days: 660 },
  { id: 'OP-055', year: 2024, quarter: 'Q3', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.35, actual_mt: 1.30, variance_mt: -0.05, achievement_pct: 96.3, ob_target_mcum: 7.3, ob_actual_mcum: 7.0, stripping_ratio: 5.38, hemm_availability_pct: 77.2, diesel_l_per_t: 3.18, cost_per_t_inr: 1460, safety_incident_free_days: 750 },
  { id: 'OP-056', year: 2024, quarter: 'Q4', subsidiary: 'BCCL', mine: 'Kusunda OCP', target_mt: 1.60, actual_mt: 1.58, variance_mt: -0.02, achievement_pct: 98.8, ob_target_mcum: 8.6, ob_actual_mcum: 8.5, stripping_ratio: 5.38, hemm_availability_pct: 82.8, diesel_l_per_t: 2.90, cost_per_t_inr: 1365, safety_incident_free_days: 840 },
];

// Quality Proximate Assay Dataset (Exploration, Boreholes & Beneficiation)
export const ENTERPRISE_QUALITY_ASSAYS: QualityAssayRecord[] = [
  { id: 'QA-01', subsidiary: 'CMPDI/SECL', block: 'Singrauli Block IV', seam: 'Seam IV Top', depth_m: 84.5, thickness_m: 6.82, ash_pct: 32.4, moisture_pct: 6.2, volatile_matter_pct: 29.1, gcv_kcal_kg: 5420, grade: 'G9', clean_coal_yield_pct: 68.5, sulfur_pct: 0.38, core_recovery_pct: 95.4, beneficiation_required: false },
  { id: 'QA-02', subsidiary: 'CMPDI/SECL', block: 'Singrauli Block IV', seam: 'Seam IV Bottom', depth_m: 102.1, thickness_m: 4.25, ash_pct: 34.8, moisture_pct: 6.8, volatile_matter_pct: 28.4, gcv_kcal_kg: 5110, grade: 'G10', clean_coal_yield_pct: 64.2, sulfur_pct: 0.42, core_recovery_pct: 94.8, beneficiation_required: false },
  { id: 'QA-03', subsidiary: 'CMPDI/SECL', block: 'Singrauli Block IV', seam: 'Seam III', depth_m: 135.4, thickness_m: 3.10, ash_pct: 36.5, moisture_pct: 7.1, volatile_matter_pct: 27.8, gcv_kcal_kg: 4850, grade: 'G11', clean_coal_yield_pct: 61.0, sulfur_pct: 0.45, core_recovery_pct: 93.2, beneficiation_required: true },
  { id: 'QA-04', subsidiary: 'CMPDI/SECL', block: 'Singrauli Block IV', seam: 'Seam II', depth_m: 178.2, thickness_m: 2.40, ash_pct: 37.8, moisture_pct: 7.4, volatile_matter_pct: 26.9, gcv_kcal_kg: 4620, grade: 'G12', clean_coal_yield_pct: 58.4, sulfur_pct: 0.48, core_recovery_pct: 92.1, beneficiation_required: true },
  { id: 'QA-05', subsidiary: 'CMPDI/SECL', block: 'Singrauli Block IV', seam: 'Seam I (Deep)', depth_m: 214.0, thickness_m: 5.15, ash_pct: 38.5, moisture_pct: 7.8, volatile_matter_pct: 26.1, gcv_kcal_kg: 4450, grade: 'G13', clean_coal_yield_pct: 55.2, sulfur_pct: 0.52, core_recovery_pct: 91.5, beneficiation_required: true },
  { id: 'QA-06', subsidiary: 'ECL', block: 'Rajmahal North', seam: 'Seam II (Main)', depth_m: 95.0, thickness_m: 8.40, ash_pct: 39.2, moisture_pct: 8.5, volatile_matter_pct: 25.4, gcv_kcal_kg: 4280, grade: 'G13', clean_coal_yield_pct: 54.0, sulfur_pct: 0.35, core_recovery_pct: 92.8, beneficiation_required: true },
  { id: 'QA-07', subsidiary: 'ECL', block: 'Rajmahal North', seam: 'Seam III', depth_m: 118.5, thickness_m: 5.60, ash_pct: 36.8, moisture_pct: 8.2, volatile_matter_pct: 26.2, gcv_kcal_kg: 4650, grade: 'G12', clean_coal_yield_pct: 59.5, sulfur_pct: 0.38, core_recovery_pct: 93.6, beneficiation_required: true },
  { id: 'QA-08', subsidiary: 'ECL', block: 'Sonepur Bazari', seam: 'R-IV Seam', depth_m: 72.0, thickness_m: 9.10, ash_pct: 31.5, moisture_pct: 5.9, volatile_matter_pct: 30.2, gcv_kcal_kg: 5580, grade: 'G8', clean_coal_yield_pct: 72.0, sulfur_pct: 0.44, core_recovery_pct: 96.2, beneficiation_required: false },
  { id: 'QA-09', subsidiary: 'ECL', block: 'Sonepur Bazari', seam: 'R-V Seam', depth_m: 45.2, thickness_m: 7.50, ash_pct: 29.8, moisture_pct: 5.5, volatile_matter_pct: 31.4, gcv_kcal_kg: 5820, grade: 'G7', clean_coal_yield_pct: 76.5, sulfur_pct: 0.41, core_recovery_pct: 97.5, beneficiation_required: false },
  { id: 'QA-10', subsidiary: 'NCL', block: 'Jayant Deep Block', seam: 'Purewa Top', depth_m: 65.4, thickness_m: 11.20, ash_pct: 30.4, moisture_pct: 6.0, volatile_matter_pct: 30.8, gcv_kcal_kg: 5690, grade: 'G8', clean_coal_yield_pct: 74.2, sulfur_pct: 0.36, core_recovery_pct: 97.0, beneficiation_required: false },
  { id: 'QA-11', subsidiary: 'NCL', block: 'Jayant Deep Block', seam: 'Purewa Bottom', depth_m: 92.6, thickness_m: 12.80, ash_pct: 32.1, moisture_pct: 6.4, volatile_matter_pct: 29.9, gcv_kcal_kg: 5460, grade: 'G9', clean_coal_yield_pct: 70.8, sulfur_pct: 0.39, core_recovery_pct: 96.4, beneficiation_required: false },
  { id: 'QA-12', subsidiary: 'NCL', block: 'Nigahi Extension', seam: 'Turra Seam', depth_m: 125.0, thickness_m: 14.50, ash_pct: 27.5, moisture_pct: 5.2, volatile_matter_pct: 32.5, gcv_kcal_kg: 6150, grade: 'G6', clean_coal_yield_pct: 81.2, sulfur_pct: 0.32, core_recovery_pct: 98.2, beneficiation_required: false },
  { id: 'QA-13', subsidiary: 'CCL', block: 'North Karanpura', seam: 'Seam II Top', depth_m: 54.0, thickness_m: 16.20, ash_pct: 38.8, moisture_pct: 8.9, volatile_matter_pct: 24.8, gcv_kcal_kg: 4320, grade: 'G13', clean_coal_yield_pct: 56.0, sulfur_pct: 0.49, core_recovery_pct: 94.0, beneficiation_required: true },
  { id: 'QA-14', subsidiary: 'CCL', block: 'North Karanpura', seam: 'Seam I Bottom', depth_m: 88.0, thickness_m: 18.50, ash_pct: 41.2, moisture_pct: 9.2, volatile_matter_pct: 23.5, gcv_kcal_kg: 3980, grade: 'G14', clean_coal_yield_pct: 50.4, sulfur_pct: 0.54, core_recovery_pct: 92.5, beneficiation_required: true },
  { id: 'QA-15', subsidiary: 'BCCL', block: 'Jharia Coalfield', seam: 'Seam XI/XII (Coking)', depth_m: 180.0, thickness_m: 4.80, ash_pct: 22.4, moisture_pct: 2.1, volatile_matter_pct: 24.5, gcv_kcal_kg: 6850, grade: 'Steel-II Coking', clean_coal_yield_pct: 48.5, sulfur_pct: 0.68, core_recovery_pct: 96.8, beneficiation_required: true },
  { id: 'QA-16', subsidiary: 'BCCL', block: 'Jharia Coalfield', seam: 'Seam IX/X (Coking)', depth_m: 220.0, thickness_m: 5.40, ash_pct: 24.8, moisture_pct: 2.3, volatile_matter_pct: 23.8, gcv_kcal_kg: 6620, grade: 'Washery-I', clean_coal_yield_pct: 44.2, sulfur_pct: 0.72, core_recovery_pct: 95.9, beneficiation_required: true },
];

// Environmental & ESG Compliance Monitoring
export const ENTERPRISE_ESG_DATA: EnvironmentalRecord[] = [
  { id: 'ESG-01', subsidiary: 'SECL', site: 'Dipka OCP Core Zone', period: '2024-Q1', pm10_ug_m3: 78.4, pm25_ug_m3: 42.1, noise_day_db: 68.2, effluent_ph: 7.4, effluent_bod_mg_l: 18.2, afforestation_target_ha: 135, afforestation_actual_ha: 142.5, compliance_status: 'Fully Compliant' },
  { id: 'ESG-02', subsidiary: 'SECL', site: 'Dipka OCP Core Zone', period: '2024-Q2', pm10_ug_m3: 84.6, pm25_ug_m3: 46.8, noise_day_db: 70.1, effluent_ph: 7.2, effluent_bod_mg_l: 21.0, afforestation_target_ha: 140, afforestation_actual_ha: 145.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-03', subsidiary: 'SECL', site: 'Dipka OCP Core Zone', period: '2024-Q3', pm10_ug_m3: 65.2, pm25_ug_m3: 34.5, noise_day_db: 66.8, effluent_ph: 7.5, effluent_bod_mg_l: 16.4, afforestation_target_ha: 150, afforestation_actual_ha: 158.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-04', subsidiary: 'SECL', site: 'Dipka OCP Core Zone', period: '2024-Q4', pm10_ug_m3: 88.9, pm25_ug_m3: 48.2, noise_day_db: 71.4, effluent_ph: 7.3, effluent_bod_mg_l: 22.5, afforestation_target_ha: 160, afforestation_actual_ha: 164.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-05', subsidiary: 'ECL', site: 'Rajmahal Mining Lease', period: '2024-Q1', pm10_ug_m3: 92.5, pm25_ug_m3: 54.2, noise_day_db: 72.8, effluent_ph: 6.9, effluent_bod_mg_l: 24.8, afforestation_target_ha: 90, afforestation_actual_ha: 85.0, compliance_status: 'Warning' },
  { id: 'ESG-06', subsidiary: 'ECL', site: 'Rajmahal Mining Lease', period: '2024-Q2', pm10_ug_m3: 96.8, pm25_ug_m3: 57.6, noise_day_db: 73.5, effluent_ph: 6.8, effluent_bod_mg_l: 26.2, afforestation_target_ha: 95, afforestation_actual_ha: 92.0, compliance_status: 'Warning' },
  { id: 'ESG-07', subsidiary: 'ECL', site: 'Rajmahal Mining Lease', period: '2024-Q3', pm10_ug_m3: 72.4, pm25_ug_m3: 38.0, noise_day_db: 67.2, effluent_ph: 7.1, effluent_bod_mg_l: 19.5, afforestation_target_ha: 100, afforestation_actual_ha: 102.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-08', subsidiary: 'ECL', site: 'Rajmahal Mining Lease', period: '2024-Q4', pm10_ug_m3: 104.2, pm25_ug_m3: 63.8, noise_day_db: 76.1, effluent_ph: 6.7, effluent_bod_mg_l: 29.4, afforestation_target_ha: 110, afforestation_actual_ha: 104.0, compliance_status: 'Exceeded Threshold' },
  { id: 'ESG-09', subsidiary: 'NCL', site: 'Jayant OCP Complex', period: '2024-Q1', pm10_ug_m3: 82.1, pm25_ug_m3: 44.5, noise_day_db: 69.4, effluent_ph: 7.6, effluent_bod_mg_l: 17.5, afforestation_target_ha: 180, afforestation_actual_ha: 195.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-10', subsidiary: 'NCL', site: 'Jayant OCP Complex', period: '2024-Q2', pm10_ug_m3: 86.4, pm25_ug_m3: 47.2, noise_day_db: 70.8, effluent_ph: 7.4, effluent_bod_mg_l: 18.9, afforestation_target_ha: 190, afforestation_actual_ha: 204.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-11', subsidiary: 'NCL', site: 'Jayant OCP Complex', period: '2024-Q3', pm10_ug_m3: 68.5, pm25_ug_m3: 36.2, noise_day_db: 66.5, effluent_ph: 7.7, effluent_bod_mg_l: 15.2, afforestation_target_ha: 200, afforestation_actual_ha: 216.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-12', subsidiary: 'NCL', site: 'Jayant OCP Complex', period: '2024-Q4', pm10_ug_m3: 89.8, pm25_ug_m3: 49.0, noise_day_db: 71.9, effluent_ph: 7.5, effluent_bod_mg_l: 20.1, afforestation_target_ha: 210, afforestation_actual_ha: 228.0, compliance_status: 'Fully Compliant' },
  { id: 'ESG-13', subsidiary: 'BCCL', site: 'Jharia Coalfield Core', period: '2024-Q1', pm10_ug_m3: 112.4, pm25_ug_m3: 68.5, noise_day_db: 77.4, effluent_ph: 6.4, effluent_bod_mg_l: 34.2, afforestation_target_ha: 60, afforestation_actual_ha: 52.0, compliance_status: 'Exceeded Threshold' },
  { id: 'ESG-14', subsidiary: 'BCCL', site: 'Jharia Coalfield Core', period: '2024-Q2', pm10_ug_m3: 118.0, pm25_ug_m3: 72.1, noise_day_db: 78.6, effluent_ph: 6.3, effluent_bod_mg_l: 36.5, afforestation_target_ha: 65, afforestation_actual_ha: 56.0, compliance_status: 'Exceeded Threshold' },
  { id: 'ESG-15', subsidiary: 'BCCL', site: 'Jharia Coalfield Core', period: '2024-Q3', pm10_ug_m3: 89.2, pm25_ug_m3: 52.4, noise_day_db: 71.2, effluent_ph: 6.8, effluent_bod_mg_l: 28.0, afforestation_target_ha: 70, afforestation_actual_ha: 68.0, compliance_status: 'Warning' },
  { id: 'ESG-16', subsidiary: 'BCCL', site: 'Jharia Coalfield Core', period: '2024-Q4', pm10_ug_m3: 124.6, pm25_ug_m3: 76.8, noise_day_db: 79.8, effluent_ph: 6.2, effluent_bod_mg_l: 38.8, afforestation_target_ha: 75, afforestation_actual_ha: 62.0, compliance_status: 'Exceeded Threshold' },
];

// Strategic Operational & Executive Actionable Recommendations Matrix
export const STRATEGIC_ACTION_MATRIX: ActionRecommendation[] = [
  {
    id: 'ACT-001',
    title: 'Seam I & North Karanpura Washery Cyclone Re-Calibration',
    category: 'Quality Control',
    priority: 'Critical (P0)',
    timeframe: '0-30 Days (Immediate)',
    rootCause: 'Assay data reveals Seam I ash reaching 38.5%–41.2% in deep benches, causing ₹128/tonne thermal grade penalty rejections at NTPC linkages.',
    actionRequired: 'Re-calibrate dense media cyclone cut-point density from 1.55 g/cc to 1.48 g/cc. Route run-of-mine through dual-stage destoners prior to thermal dispatch.',
    projectedImpact: 'Reduces dispatch ash from 38.5% to 32.4% (GCV boost +680 kcal/kg). Increases Grade G9 clean coal yield to 62.0%.',
    estimatedRoi: '+₹42.8 Crores annually in avoided grade slippage penalties',
    responsibleOwner: 'General Manager (Coal Washeries & Quality Control)',
    riskOfInaction: 'Risk of linkage contract termination and grade downgrade penalties from statutory buyers.',
    status: 'Open',
  },
  {
    id: 'ACT-002',
    title: 'Electric Shovel & Dragline Reliability Overhaul (ECL & BCCL)',
    category: 'Equipment Maintenance',
    priority: 'High (P1)',
    timeframe: '1-3 Months (Mid-term)',
    rootCause: 'HEMM availability in ECL (72%–84%) and BCCL (72%–80%) lags NCL benchmark (91%–93%) by 12.5 percentage points due to hydraulic hose and swing motor wear.',
    actionRequired: 'Deploy IoT predictive vibration sensors on 42m³ electric shovels and transition from reactive repair to 250-hour scheduled preventive maintenance cycle.',
    projectedImpact: 'Improves HEMM availability from 77.4% to 88.0%, unlocking an additional +1.20 Million Tonnes of annual overburden extraction.',
    estimatedRoi: '+₹68.5 Crores EBITDA contribution via increased production throughput',
    responsibleOwner: 'Chief General Manager (Excavation & HEMM)',
    riskOfInaction: 'Chronic under-recovery of planned overburden leads to severe coal seam choke-off by Q3.',
    status: 'In Progress',
  },
  {
    id: 'ACT-003',
    title: 'Haul Road Gradient & Dispatch Fleet Telematics Optimization',
    category: 'Cost Optimization',
    priority: 'High (P1)',
    timeframe: '1-3 Months (Mid-term)',
    rootCause: 'Diesel consumption variance shows 2.45 L/tonne in ECL vs 1.55 L/tonne in NCL (a 58% fuel cost penalty), driven by 1:12 steep haul ramp grades.',
    actionRequired: 'Re-grade main haul roads to DGMS recommended 1 in 16 slope. Install automated GPS fleet speed governors and idle shutdown timers on 240T dumpers.',
    projectedImpact: 'Reduces fleet fuel consumption by 0.38 L/tonne (an 18.2% reduction in fleet diesel burn across 14.5 MT annual coal movement).',
    estimatedRoi: 'Direct fuel cost savings of ₹39.4 Crores per annum',
    responsibleOwner: 'Chief of Mining Operations & Fleet Logistics',
    riskOfInaction: 'Escalating carbon emissions and persistent ₹90+/tonne unit extraction cost premium.',
    status: 'Open',
  },
  {
    id: 'ACT-004',
    title: 'Dust Suppression & Parivesh Ambient Air Remediation at Jharia & Rajmahal',
    category: 'Statutory & ESG',
    priority: 'Critical (P0)',
    timeframe: '0-30 Days (Immediate)',
    rootCause: 'PM10 readings in BCCL Jharia (124.6 µg/m³) and ECL Q4 (104.2 µg/m³) exceeded MoEFCC 100 µg/m³ statutory ceiling, risking SPCB notices.',
    actionRequired: 'Deploy 6 truck-mounted mist fog cannons along haul corridors, increase water sprinkling frequency from twice to 6 times daily, and seal carbonaceous stockpiles.',
    projectedImpact: 'Lowers core zone PM10 by 28–35 µg/m³, bringing all stations below 85 µg/m³ within 21 days.',
    estimatedRoi: 'Avoidance of statutory production closure notices and ESG compliance certification retention',
    responsibleOwner: 'General Manager (Environment & Sustainable Development)',
    riskOfInaction: 'Suspension of environmental clearance and mandatory mine closure orders by State Pollution Control Boards.',
    status: 'Open',
  },
  {
    id: 'ACT-005',
    title: 'In-Pit Crushing & Conveying (IPCC) Transition for High Stripping Ratios',
    category: 'Operational',
    priority: 'Medium (P2)',
    timeframe: '3-12 Months (Strategic)',
    rootCause: 'BCCL Kusunda stripping ratio remains high at 5.38–5.42 m³/tonne with diesel truck haulage distances exceeding 4.2 km.',
    actionRequired: 'Commission semi-mobile in-pit crushing with continuous overland conveyor routing to external waste dump.',
    projectedImpact: 'Lowers overburden handling cost from ₹185/m³ to ₹112/m³, reducing unit coal extraction cost by ₹280/tonne.',
    estimatedRoi: 'Payback within 3.2 years with ₹115 Crores annual operating cost savings',
    responsibleOwner: 'Director (Technical / Planning)',
    riskOfInaction: 'High cost of production renders deep seam extraction commercially unviable.',
    status: 'Open',
  },
];
