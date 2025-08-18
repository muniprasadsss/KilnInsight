import {
  type SensorReading,
  type InsertSensorReading,
  type Anomaly,
  type InsertAnomaly,
  type Alert,
  type InsertAlert,
  type ProcessParameter,
  type InsertProcessParameter,
  type FailureMode,
  type InsertFailureMode,
  type EquipmentStatus,
  type InsertEquipmentStatus,
  type ProductionData,
  type InsertProductionData,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { csvDataLoader, type CementKilnData } from "./csv-loader";

export interface IStorage {
  // Sensor readings
  getSensorReadings(limit?: number): Promise<SensorReading[]>;
  getLatestSensorReadings(): Promise<SensorReading[]>;
  createSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  
  // Anomalies
  getAnomalies(status?: string): Promise<Anomaly[]>;
  getActiveAnomalies(): Promise<Anomaly[]>;
  getAnomalyById(id: string): Promise<Anomaly | undefined>;
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  updateAnomaly(id: string, updates: Partial<Anomaly>): Promise<Anomaly | undefined>;
  
  // Alerts
  getAlerts(acknowledged?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert | undefined>;
  
  // Process parameters
  getProcessParameters(): Promise<ProcessParameter[]>;
  createProcessParameter(parameter: InsertProcessParameter): Promise<ProcessParameter>;
  
  // Failure modes
  getFailureModes(): Promise<FailureMode[]>;
  createFailureMode(failureMode: InsertFailureMode): Promise<FailureMode>;
  
  // Equipment status
  getEquipmentStatus(): Promise<EquipmentStatus[]>;
  updateEquipmentStatus(equipmentId: string, status: Partial<EquipmentStatus>): Promise<EquipmentStatus | undefined>;
  
  // Production data
  getProductionData(limit?: number): Promise<ProductionData[]>;
  createProductionData(data: InsertProductionData): Promise<ProductionData>;
}

export class MemStorage implements IStorage {
  private sensorReadings: Map<string, SensorReading> = new Map();
  private anomalies: Map<string, Anomaly> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private processParameters: Map<string, ProcessParameter> = new Map();
  private failureModes: Map<string, FailureMode> = new Map();
  private equipmentStatus: Map<string, EquipmentStatus> = new Map();
  private productionData: Map<string, ProductionData> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Load real sensor data from CSV files
    this.loadCementKilnData();

    // Add some simulated real-time updates
    setInterval(() => {
      this.addLatestReadings();
    }, 10000); // Update every 10 seconds

    // Initialize failure modes based on the diagram
    const defaultFailureModes: InsertFailureMode[] = [
      {
        name: "Cyclone Blockage",
        location: "preheater",
        description: "Partial or complete blockage of preheater cyclone",
        symptoms: ["Increased pressure drop", "Reduced efficiency", "Temperature variations"],
        causes: ["Material buildup", "Foreign objects", "Wear and tear"],
        impacts: ["Production loss", "Energy efficiency reduction", "Equipment damage"],
        preventiveMeasures: ["Regular cleaning", "Material quality control", "Monitoring systems"]
      },
      {
        name: "Burner Trip",
        location: "rotary_kiln",
        description: "Automatic shutdown of main burner",
        symptoms: ["Fuel flow interruption", "Temperature drop", "Flame failure"],
        causes: ["Fuel quality issues", "Combustion air problems", "Equipment failure"],
        impacts: ["Production stop", "Cool-down time", "Energy loss"],
        preventiveMeasures: ["Fuel quality monitoring", "Burner maintenance", "Backup systems"]
      },
      {
        name: "ESP Overheat",
        location: "cooler",
        description: "Electrostatic precipitator temperature exceeding limits",
        symptoms: ["High inlet temperature", "Reduced efficiency", "Equipment stress"],
        causes: ["High gas temperature", "Cooling system failure", "Overload conditions"],
        impacts: ["Equipment damage", "Emission compliance issues", "Maintenance costs"],
        preventiveMeasures: ["Temperature monitoring", "Cooling system maintenance", "Load management"]
      }
    ];

    defaultFailureModes.forEach(fm => {
      const failureMode: FailureMode = {
        id: randomUUID(),
        name: fm.name,
        description: fm.description,
        location: fm.location,
        symptoms: fm.symptoms || [],
        causes: fm.causes || [],
        impacts: fm.impacts || [],
        preventiveMeasures: fm.preventiveMeasures || [],
      };
      this.failureModes.set(failureMode.id, failureMode);
    });
  }

  private loadCementKilnData() {
    // Load the latest readings from CSV data
    const latestReadings = csvDataLoader.getLatestReadings(100);
    
    latestReadings.forEach((record: CementKilnData, index: number) => {
      this.createSensorReadingsFromRecord(record, index);
    });

    // Load anomaly data
    const anomalyData = csvDataLoader.getAnomalyData();
    anomalyData.forEach(record => {
      if (record.episode_id) {
        this.createAnomalyFromRecord(record);
      }
    });

    // Load episodes as failure modes
    const episodes = csvDataLoader.getEpisodes();
    episodes.forEach(episode => {
      this.createFailureModeFromEpisode(episode);
    });
  }

  private createSensorReadingsFromRecord(record: CementKilnData, index: number) {
    const sensorMappings = [
      { key: 'preheater_temp_C', sensorId: 'temp_preheater_1', sensorName: 'Preheater Temperature', location: 'preheater', unit: '°C' },
      { key: 'kiln_zone_1_temp_C', sensorId: 'temp_kiln_zone_1', sensorName: 'Kiln Zone 1 Temperature', location: 'rotary_kiln', unit: '°C' },
      { key: 'kiln_zone_2_temp_C', sensorId: 'temp_kiln_zone_2', sensorName: 'Kiln Zone 2 Temperature', location: 'rotary_kiln', unit: '°C' },
      { key: 'kiln_zone_3_temp_C', sensorId: 'temp_kiln_zone_3', sensorName: 'Kiln Zone 3 Temperature', location: 'rotary_kiln', unit: '°C' },
      { key: 'kiln_zone_4_temp_C', sensorId: 'temp_kiln_zone_4', sensorName: 'Kiln Zone 4 Temperature', location: 'rotary_kiln', unit: '°C' },
      { key: 'kiln_zone_5_temp_C', sensorId: 'temp_kiln_zone_5', sensorName: 'Kiln Zone 5 Temperature', location: 'rotary_kiln', unit: '°C' },
      { key: 'clinker_temp_C', sensorId: 'temp_clinker', sensorName: 'Clinker Temperature', location: 'cooler', unit: '°C' },
      { key: 'kiln_speed_rpm', sensorId: 'speed_kiln_1', sensorName: 'Kiln Speed', location: 'rotary_kiln', unit: 'rpm' },
      { key: 'feed_rate_tph', sensorId: 'feed_rate_1', sensorName: 'Feed Rate', location: 'preheater', unit: 'tph' },
      { key: 'production_tph', sensorId: 'production_rate', sensorName: 'Production Rate', location: 'cooler', unit: 'tph' },
      { key: 'fuel_flow_kgph', sensorId: 'fuel_flow_1', sensorName: 'Fuel Flow', location: 'rotary_kiln', unit: 'kg/h' },
      { key: 'specific_energy_kcal_per_kg', sensorId: 'specific_energy', sensorName: 'Specific Energy Consumption', location: 'rotary_kiln', unit: 'kcal/kg' },
      { key: 'O2_pct', sensorId: 'o2_percent_1', sensorName: 'O2 Percentage', location: 'rotary_kiln', unit: '%' },
      { key: 'CO_ppm', sensorId: 'co_ppm_1', sensorName: 'CO Level', location: 'rotary_kiln', unit: 'ppm' },
      { key: 'NOx_ppm', sensorId: 'nox_ppm_1', sensorName: 'NOx Level', location: 'rotary_kiln', unit: 'ppm' },
      { key: 'kiln_pressure_mbar', sensorId: 'pressure_kiln', sensorName: 'Kiln Pressure', location: 'rotary_kiln', unit: 'mbar' },
      { key: 'primary_fan_speed_rpm', sensorId: 'fan_primary_speed', sensorName: 'Primary Fan Speed', location: 'preheater', unit: 'rpm' },
      { key: 'secondary_fan_speed_rpm', sensorId: 'fan_secondary_speed', sensorName: 'Secondary Fan Speed', location: 'preheater', unit: 'rpm' },
      { key: 'ESP_inlet_temp_C', sensorId: 'temp_esp_inlet', sensorName: 'ESP Inlet Temperature', location: 'cooler', unit: '°C' },
      { key: 'kiln_torque_kNm', sensorId: 'torque_kiln', sensorName: 'Kiln Torque', location: 'rotary_kiln', unit: 'kNm' },
      { key: 'draft_fan_vfd_speed_pct', sensorId: 'fan_draft_speed', sensorName: 'Draft Fan Speed', location: 'cooler', unit: '%' }
    ];

    sensorMappings.forEach(mapping => {
      const value = record[mapping.key as keyof CementKilnData] as number;
      if (typeof value === 'number') {
        const reading: SensorReading = {
          id: randomUUID(),
          sensorId: mapping.sensorId,
          sensorName: mapping.sensorName,
          location: mapping.location,
          unit: mapping.unit,
          value: value,
          quality: record.alarm_flag ? 'warning' : 'good',
          timestamp: record.timestamp,
        };
        this.sensorReadings.set(reading.id, reading);
      }
    });
  }

  private createAnomalyFromRecord(record: CementKilnData) {
    const anomaly: Anomaly = {
      id: randomUUID(),
      type: record.event || 'process_deviation',
      description: `Anomaly detected at ${record.timestamp.toISOString()}`,
      location: this.inferLocationFromEvent(record.event),
      episodeId: record.episode_id || randomUUID(),
      severity: record.alarm_flag ? 'high' : 'medium',
      status: 'active',
      impactedSensors: [],
      rootCause: null,
      recommendation: null,
      startTime: record.timestamp,
      endTime: null,
    };
    this.anomalies.set(anomaly.id, anomaly);
  }

  private createFailureModeFromEpisode(episode: any) {
    const failureMode: FailureMode = {
      id: randomUUID(),
      name: this.formatEpisodeName(episode.label),
      description: episode.notes,
      location: this.inferLocationFromLabel(episode.label),
      symptoms: this.getSymptomsByLabel(episode.label),
      causes: this.getCausesByLabel(episode.label),
      impacts: this.getImpactsByLabel(episode.label),
      preventiveMeasures: this.getPreventiveMeasuresByLabel(episode.label),
    };
    this.failureModes.set(failureMode.id, failureMode);
  }

  private addLatestReadings() {
    const latestData = csvDataLoader.getLatestReadings(1)[0];
    if (latestData) {
      // Add slight variations to simulate real-time data
      const modifiedRecord = { ...latestData };
      modifiedRecord.timestamp = new Date();
      
      // Add realistic variations
      modifiedRecord.preheater_temp_C *= (0.98 + Math.random() * 0.04);
      modifiedRecord.kiln_speed_rpm *= (0.99 + Math.random() * 0.02);
      modifiedRecord.O2_pct *= (0.95 + Math.random() * 0.1);
      modifiedRecord.fuel_flow_kgph *= (0.98 + Math.random() * 0.04);
      
      this.createSensorReadingsFromRecord(modifiedRecord, Date.now());
    }
  }

  private inferLocationFromEvent(event?: string): string {
    if (!event) return 'rotary_kiln';
    if (event.includes('burner')) return 'rotary_kiln';
    if (event.includes('fan')) return 'preheater';
    if (event.includes('ESP')) return 'cooler';
    if (event.includes('cyclone')) return 'preheater';
    return 'rotary_kiln';
  }

  private inferLocationFromLabel(label: string): string {
    if (label.includes('burner')) return 'rotary_kiln';
    if (label.includes('fan')) return 'preheater';
    if (label.includes('ESP')) return 'cooler';
    if (label.includes('cyclone')) return 'preheater';
    if (label.includes('meal')) return 'preheater';
    return 'rotary_kiln';
  }

  private formatEpisodeName(label: string): string {
    return label.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private getSymptomsByLabel(label: string): unknown[] {
    const symptomsMap: Record<string, string[]> = {
      'burner_trip': ['Fuel flow interruption', 'Temperature drop', 'Flame failure'],
      'primary_fan_failure': ['Draft loss', 'Pressure spike', 'O2 drop', 'CO rise'],
      'coating_collapse': ['Temperature fluctuation', 'Clinker quality variation', 'Heat pattern change'],
      'raw_meal_interrupt': ['Feed rate drop', 'Production decrease', 'Temperature variation'],
      'sensor_drift_O2': ['O2 reading gradual increase', 'Combustion efficiency drop'],
      'sensor_stuck_NOx': ['NOx reading constant', 'No response to process changes'],
      'ESP_overheat': ['High inlet temperature', 'Reduced efficiency', 'Equipment stress'],
      'cyclone_blockage': ['Increased pressure drop', 'Reduced efficiency', 'Temperature variations']
    };
    return symptomsMap[label] || ['Process deviation detected'];
  }

  private getCausesByLabel(label: string): unknown[] {
    const causesMap: Record<string, string[]> = {
      'burner_trip': ['Fuel quality issues', 'Combustion air problems', 'Equipment failure'],
      'primary_fan_failure': ['Fan motor issue', 'VFD malfunction', 'Mechanical failure'],
      'coating_collapse': ['Thermal shock', 'Chemical attack', 'Mechanical stress'],
      'raw_meal_interrupt': ['Feeder malfunction', 'Material flow blockage', 'Control system issue'],
      'sensor_drift_O2': ['Sensor aging', 'Calibration drift', 'Environmental conditions'],
      'sensor_stuck_NOx': ['Sensor contamination', 'Electronic failure', 'Probe damage'],
      'ESP_overheat': ['High gas temperature', 'Cooling system failure', 'Overload conditions'],
      'cyclone_blockage': ['Material buildup', 'Foreign objects', 'Wear and tear']
    };
    return causesMap[label] || ['Unknown cause'];
  }

  private getImpactsByLabel(label: string): unknown[] {
    const impactsMap: Record<string, string[]> = {
      'burner_trip': ['Production stop', 'Cool-down time', 'Energy loss'],
      'primary_fan_failure': ['Combustion disruption', 'Emission issues', 'Energy efficiency loss'],
      'coating_collapse': ['Refractory damage', 'Product quality impact', 'Energy efficiency reduction'],
      'raw_meal_interrupt': ['Production loss', 'Quality variation', 'Energy waste'],
      'sensor_drift_O2': ['Poor combustion control', 'Energy inefficiency', 'Emission compliance risk'],
      'sensor_stuck_NOx': ['Emission monitoring failure', 'Regulatory compliance risk'],
      'ESP_overheat': ['Equipment damage', 'Emission compliance issues', 'Maintenance costs'],
      'cyclone_blockage': ['Production loss', 'Energy efficiency reduction', 'Equipment damage']
    };
    return impactsMap[label] || ['Process disruption'];
  }

  private getPreventiveMeasuresByLabel(label: string): unknown[] {
    const measuresMap: Record<string, string[]> = {
      'burner_trip': ['Fuel quality monitoring', 'Burner maintenance', 'Backup systems'],
      'primary_fan_failure': ['Preventive maintenance', 'Condition monitoring', 'Spare parts availability'],
      'coating_collapse': ['Temperature monitoring', 'Thermal imaging', 'Refractory inspection'],
      'raw_meal_interrupt': ['Feeder maintenance', 'Flow monitoring', 'Backup systems'],
      'sensor_drift_O2': ['Regular calibration', 'Sensor replacement schedule', 'Cross-validation'],
      'sensor_stuck_NOx': ['Regular cleaning', 'Probe inspection', 'Backup analyzers'],
      'ESP_overheat': ['Temperature monitoring', 'Cooling system maintenance', 'Load management'],
      'cyclone_blockage': ['Regular cleaning', 'Material quality control', 'Monitoring systems']
    };
    return measuresMap[label] || ['Regular monitoring and maintenance'];
  }

  private generateRealisticValue(sensorId: string): number {
    const baseValues: Record<string, number> = {
      "temp_preheater_1": 544.2,
      "speed_kiln_1": 2.01,
      "o2_percent_1": 3.98,
      "nox_ppm_1": 332,
      "fuel_flow_1": 6956,
      "feed_rate_1": 117.8,
    };
    
    const base = baseValues[sensorId] || 100;
    return Number((base * (0.95 + Math.random() * 0.1)).toFixed(2));
  }

  async getSensorReadings(limit = 100): Promise<SensorReading[]> {
    return Array.from(this.sensorReadings.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getLatestSensorReadings(): Promise<SensorReading[]> {
    const readings = new Map<string, SensorReading>();
    
    Array.from(this.sensorReadings.values()).forEach(reading => {
      const existing = readings.get(reading.sensorId);
      if (!existing || reading.timestamp > existing.timestamp) {
        readings.set(reading.sensorId, reading);
      }
    });
    
    return Array.from(readings.values());
  }

  async createSensorReading(insertReading: InsertSensorReading): Promise<SensorReading> {
    const reading: SensorReading = {
      id: randomUUID(),
      sensorId: insertReading.sensorId,
      sensorName: insertReading.sensorName,
      value: insertReading.value,
      unit: insertReading.unit,
      location: insertReading.location,
      quality: insertReading.quality || null,
      timestamp: new Date(),
    };
    this.sensorReadings.set(reading.id, reading);
    return reading;
  }

  async getAnomalies(status?: string): Promise<Anomaly[]> {
    let anomalies = Array.from(this.anomalies.values());
    if (status) {
      anomalies = anomalies.filter(a => a.status === status);
    }
    return anomalies.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async getActiveAnomalies(): Promise<Anomaly[]> {
    return this.getAnomalies("active");
  }

  async getAnomalyById(id: string): Promise<Anomaly | undefined> {
    return this.anomalies.get(id);
  }

  async createAnomaly(insertAnomaly: InsertAnomaly): Promise<Anomaly> {
    const anomaly: Anomaly = {
      id: randomUUID(),
      type: insertAnomaly.type,
      description: insertAnomaly.description,
      location: insertAnomaly.location,
      episodeId: insertAnomaly.episodeId,
      severity: insertAnomaly.severity,
      status: insertAnomaly.status || null,
      impactedSensors: insertAnomaly.impactedSensors || [],
      rootCause: insertAnomaly.rootCause || null,
      recommendation: insertAnomaly.recommendation || null,
      startTime: new Date(),
      endTime: null,
    };
    this.anomalies.set(anomaly.id, anomaly);
    return anomaly;
  }

  async updateAnomaly(id: string, updates: Partial<Anomaly>): Promise<Anomaly | undefined> {
    const anomaly = this.anomalies.get(id);
    if (!anomaly) return undefined;
    
    const updated = { ...anomaly, ...updates };
    this.anomalies.set(id, updated);
    return updated;
  }

  async getAlerts(acknowledged?: boolean): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values());
    if (acknowledged !== undefined) {
      alerts = alerts.filter(a => a.acknowledged === acknowledged);
    }
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const alert: Alert = {
      id: randomUUID(),
      title: insertAlert.title,
      message: insertAlert.message,
      severity: insertAlert.severity,
      anomalyId: insertAlert.anomalyId || null,
      timestamp: new Date(),
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null,
    };
    this.alerts.set(alert.id, alert);
    return alert;
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updated = {
      ...alert,
      acknowledged: true,
      acknowledgedBy,
      acknowledgedAt: new Date(),
    };
    this.alerts.set(id, updated);
    return updated;
  }

  async getProcessParameters(): Promise<ProcessParameter[]> {
    return Array.from(this.processParameters.values());
  }

  async createProcessParameter(insertParameter: InsertProcessParameter): Promise<ProcessParameter> {
    const parameter: ProcessParameter = {
      id: randomUUID(),
      parameterName: insertParameter.parameterName,
      currentValue: insertParameter.currentValue,
      unit: insertParameter.unit,
      targetValue: insertParameter.targetValue || null,
      minLimit: insertParameter.minLimit || null,
      maxLimit: insertParameter.maxLimit || null,
      timestamp: new Date(),
    };
    this.processParameters.set(parameter.id, parameter);
    return parameter;
  }

  async getFailureModes(): Promise<FailureMode[]> {
    return Array.from(this.failureModes.values());
  }

  async createFailureMode(insertFailureMode: InsertFailureMode): Promise<FailureMode> {
    const failureMode: FailureMode = {
      id: randomUUID(),
      name: insertFailureMode.name,
      description: insertFailureMode.description,
      location: insertFailureMode.location,
      symptoms: insertFailureMode.symptoms || [],
      causes: insertFailureMode.causes || [],
      impacts: insertFailureMode.impacts || [],
      preventiveMeasures: insertFailureMode.preventiveMeasures || [],
    };
    this.failureModes.set(failureMode.id, failureMode);
    return failureMode;
  }

  async getEquipmentStatus(): Promise<EquipmentStatus[]> {
    return Array.from(this.equipmentStatus.values());
  }

  async updateEquipmentStatus(equipmentId: string, statusUpdate: Partial<EquipmentStatus>): Promise<EquipmentStatus | undefined> {
    const existing = Array.from(this.equipmentStatus.values()).find(e => e.equipmentId === equipmentId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...statusUpdate, timestamp: new Date() };
    this.equipmentStatus.set(existing.id, updated);
    return updated;
  }

  async getProductionData(limit = 100): Promise<ProductionData[]> {
    return Array.from(this.productionData.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createProductionData(insertData: InsertProductionData): Promise<ProductionData> {
    const data: ProductionData = {
      id: randomUUID(),
      productionRate: insertData.productionRate,
      energyConsumption: insertData.energyConsumption,
      fuelConsumption: insertData.fuelConsumption,
      rawMaterialFeed: insertData.rawMaterialFeed,
      qualityIndex: insertData.qualityIndex || null,
      timestamp: new Date(),
    };
    this.productionData.set(data.id, data);
    return data;
  }
}

export const storage = new MemStorage();
