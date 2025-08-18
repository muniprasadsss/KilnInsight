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
    // Initialize some default sensor readings
    const defaultSensors = [
      { sensorId: "temp_preheater_1", sensorName: "Preheater Temperature", location: "preheater", unit: "°C" },
      { sensorId: "speed_kiln_1", sensorName: "Kiln Speed", location: "rotary_kiln", unit: "rpm" },
      { sensorId: "o2_percent_1", sensorName: "O2 Percentage", location: "rotary_kiln", unit: "%" },
      { sensorId: "nox_ppm_1", sensorName: "NOx Level", location: "rotary_kiln", unit: "ppm" },
      { sensorId: "fuel_flow_1", sensorName: "Fuel Flow", location: "rotary_kiln", unit: "kg/h" },
      { sensorId: "feed_rate_1", sensorName: "Feed Rate", location: "preheater", unit: "tph" },
    ];

    defaultSensors.forEach(sensor => {
      const reading: SensorReading = {
        id: randomUUID(),
        ...sensor,
        value: this.generateRealisticValue(sensor.sensorId),
        quality: "good",
        timestamp: new Date(),
      };
      this.sensorReadings.set(reading.id, reading);
    });

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
