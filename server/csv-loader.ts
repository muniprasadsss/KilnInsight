import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

export interface CementKilnData {
  timestamp: Date;
  preheater_temp_C: number;
  kiln_zone_1_temp_C: number;
  kiln_zone_2_temp_C: number;
  kiln_zone_3_temp_C: number;
  kiln_zone_4_temp_C: number;
  kiln_zone_5_temp_C: number;
  clinker_temp_C: number;
  kiln_speed_rpm: number;
  feed_rate_tph: number;
  production_tph: number;
  fuel_flow_kgph: number;
  specific_energy_kcal_per_kg: number;
  O2_pct: number;
  CO_ppm: number;
  NOx_ppm: number;
  kiln_pressure_mbar: number;
  primary_fan_speed_rpm: number;
  secondary_fan_speed_rpm: number;
  clinker_CaO_pct: number;
  clinker_SiO2_pct: number;
  burner_valve_position_pct: number;
  ESP_inlet_temp_C: number;
  draft_fan_vfd_speed_pct: number;
  kiln_torque_kNm: number;
  fuel_type: string;
  alarm_flag: number;
  is_anomaly: number;
  event?: string;
  episode_id?: string;
}

export interface Episode {
  episode_id: string;
  label: string;
  start_time: Date;
  end_time: Date;
  duration_min: number;
  notes: string;
}

class CSVDataLoader {
  private trainData: CementKilnData[] = [];
  private testData: CementKilnData[] = [];
  private episodes: Episode[] = [];
  
  constructor() {
    this.loadData();
  }
  
  private loadData() {
    try {
      // Load training data
      const trainPath = path.join(process.cwd(), 'attached_assets', 'cement_kiln_train_70_1755521187464.csv');
      const trainCsv = readFileSync(trainPath, 'utf-8');
      const trainRecords = parse(trainCsv, { 
        columns: true, 
        skip_empty_lines: true,
        cast: (value, { column }) => {
          if (column === 'timestamp') {
            return new Date(value as string);
          }
          if (['fuel_type', 'event', 'episode_id'].includes(column as string)) {
            return value === '' ? undefined : value;
          }
          return isNaN(Number(value)) ? value : Number(value);
        }
      });
      this.trainData = trainRecords as CementKilnData[];
      
      // Load test data
      const testPath = path.join(process.cwd(), 'attached_assets', 'cement_kiln_test_30_1755521187463.csv');
      const testCsv = readFileSync(testPath, 'utf-8');
      const testRecords = parse(testCsv, { 
        columns: true, 
        skip_empty_lines: true,
        cast: (value, { column }) => {
          if (column === 'timestamp') {
            return new Date(value as string);
          }
          if (['fuel_type', 'event', 'episode_id'].includes(column as string)) {
            return value === '' ? undefined : value;
          }
          return isNaN(Number(value)) ? value : Number(value);
        }
      });
      this.testData = testRecords as CementKilnData[];
      
      // Load episodes data
      const episodesPath = path.join(process.cwd(), 'attached_assets', 'cement_kiln_episodes_30days_1755521187462.csv');
      const episodesCsv = readFileSync(episodesPath, 'utf-8');
      const episodeRecords = parse(episodesCsv, { 
        columns: true, 
        skip_empty_lines: true,
        cast: (value, { column }) => {
          if (['start_time', 'end_time'].includes(column as string)) {
            return new Date(value as string);
          }
          if (column === 'duration_min') {
            return Number(value);
          }
          return value;
        }
      });
      this.episodes = episodeRecords as Episode[];
      
      console.log(`Loaded ${this.trainData.length} training records`);
      console.log(`Loaded ${this.testData.length} test records`);
      console.log(`Loaded ${this.episodes.length} episodes`);
      
    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  }
  
  getAllData(): CementKilnData[] {
    return [...this.trainData, ...this.testData].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  getTrainData(): CementKilnData[] {
    return this.trainData;
  }
  
  getTestData(): CementKilnData[] {
    return this.testData;
  }
  
  getEpisodes(): Episode[] {
    return this.episodes;
  }
  
  getLatestReadings(limit: number = 50): CementKilnData[] {
    const allData = this.getAllData();
    return allData.slice(-limit);
  }
  
  getReadingsInRange(startTime: Date, endTime: Date): CementKilnData[] {
    return this.getAllData().filter(record => 
      record.timestamp >= startTime && record.timestamp <= endTime
    );
  }
  
  getAnomalyData(): CementKilnData[] {
    return this.getAllData().filter(record => record.is_anomaly === 1);
  }
  
  getSensorValue(sensorName: keyof CementKilnData, timestamp?: Date): number | string | Date | undefined {
    const data = timestamp 
      ? this.getAllData().find(r => Math.abs(r.timestamp.getTime() - timestamp.getTime()) < 60000)
      : this.getAllData()[this.getAllData().length - 1];
    
    return data ? data[sensorName] : undefined;
  }
}

export const csvDataLoader = new CSVDataLoader();
export default CSVDataLoader;
export { CSVDataLoader as CsvLoader };