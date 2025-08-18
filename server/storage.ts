import {
  cementKilnData,
  episodes,
  sensorReadings,
  anomalies,
  alerts,
  equipmentStatus,
  processParameters,
  productionMetrics,
  type CementKilnData,
  type NewCementKilnData,
  type Episode,
  type NewEpisode,
  type SensorReading,
  type NewSensorReading,
  type Anomaly,
  type NewAnomaly,
  type Alert,
  type NewAlert,
  type EquipmentStatus,
  type NewEquipmentStatus,
  type ProcessParameter,
  type NewProcessParameter,
  type ProductionMetrics,
  type NewProductionMetrics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Cement Kiln Data operations
  insertCementKilnData(data: NewCementKilnData[]): Promise<CementKilnData[]>;
  getCementKilnData(limit?: number, offset?: number): Promise<CementKilnData[]>;
  getCementKilnDataByTimeRange(startTime: Date, endTime: Date): Promise<CementKilnData[]>;
  getAnomalousData(): Promise<CementKilnData[]>;
  
  // Episodes operations
  insertEpisodes(episodes: NewEpisode[]): Promise<Episode[]>;
  getEpisodes(): Promise<Episode[]>;
  getEpisodeById(episodeId: string): Promise<Episode | undefined>;
  
  // Sensor readings operations
  getSensorReadings(): Promise<SensorReading[]>;
  getLatestSensorReadings(): Promise<SensorReading[]>;
  insertSensorReading(reading: NewSensorReading): Promise<SensorReading>;
  updateSensorReading(id: string, reading: Partial<SensorReading>): Promise<SensorReading>;
  
  // Anomalies operations
  getAnomalies(): Promise<Anomaly[]>;
  getActiveAnomalies(): Promise<Anomaly[]>;
  insertAnomaly(anomaly: NewAnomaly): Promise<Anomaly>;
  updateAnomaly(id: string, anomaly: Partial<Anomaly>): Promise<Anomaly>;
  resolveAnomaly(id: string, rootCause?: string): Promise<Anomaly>;
  
  // Alerts operations
  getAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  insertAlert(alert: NewAlert): Promise<Alert>;
  updateAlert(id: string, alert: Partial<Alert>): Promise<Alert>;
  acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert>;
  
  // Equipment status operations
  getEquipmentStatus(): Promise<EquipmentStatus[]>;
  insertEquipmentStatus(status: NewEquipmentStatus): Promise<EquipmentStatus>;
  updateEquipmentStatus(id: string, status: Partial<EquipmentStatus>): Promise<EquipmentStatus>;
  
  // Process parameters operations
  getProcessParameters(): Promise<ProcessParameter[]>;
  insertProcessParameter(param: NewProcessParameter): Promise<ProcessParameter>;
  updateProcessParameter(id: string, param: Partial<ProcessParameter>): Promise<ProcessParameter>;
  
  // Production metrics operations
  getProductionMetrics(limit?: number): Promise<ProductionMetrics[]>;
  insertProductionMetrics(metrics: NewProductionMetrics): Promise<ProductionMetrics>;
  getProductionMetricsByTimeRange(startTime: Date, endTime: Date): Promise<ProductionMetrics[]>;
}

export class DatabaseStorage implements IStorage {
  // Cement Kiln Data operations
  async insertCementKilnData(data: NewCementKilnData[]): Promise<CementKilnData[]> {
    const result = await db
      .insert(cementKilnData)
      .values(data)
      .returning();
    return result;
  }

  async getCementKilnData(limit = 1000, offset = 0): Promise<CementKilnData[]> {
    return await db
      .select()
      .from(cementKilnData)
      .orderBy(desc(cementKilnData.timestamp))
      .limit(limit)
      .offset(offset);
  }

  async getCementKilnDataByTimeRange(startTime: Date, endTime: Date): Promise<CementKilnData[]> {
    return await db
      .select()
      .from(cementKilnData)
      .where(
        and(
          gte(cementKilnData.timestamp, startTime),
          lte(cementKilnData.timestamp, endTime)
        )
      )
      .orderBy(desc(cementKilnData.timestamp));
  }

  async getAnomalousData(): Promise<CementKilnData[]> {
    return await db
      .select()
      .from(cementKilnData)
      .where(eq(cementKilnData.is_anomaly, 1))
      .orderBy(desc(cementKilnData.timestamp));
  }

  // Episodes operations
  async insertEpisodes(episodeList: NewEpisode[]): Promise<Episode[]> {
    const result = await db
      .insert(episodes)
      .values(episodeList)
      .returning();
    return result;
  }

  async getEpisodes(): Promise<Episode[]> {
    return await db
      .select()
      .from(episodes)
      .orderBy(desc(episodes.startTime));
  }

  async getEpisodeById(episodeId: string): Promise<Episode | undefined> {
    const [episode] = await db
      .select()
      .from(episodes)
      .where(eq(episodes.episodeId, episodeId));
    return episode;
  }

  // Sensor readings operations
  async getSensorReadings(): Promise<SensorReading[]> {
    return await db
      .select()
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp));
  }

  async getLatestSensorReadings(): Promise<SensorReading[]> {
    // Get the latest reading for each unique sensor
    const results = await db
      .select()
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(50); // Return latest 50 readings
    
    return results;
  }

  async insertSensorReading(reading: NewSensorReading): Promise<SensorReading> {
    const [result] = await db
      .insert(sensorReadings)
      .values(reading)
      .returning();
    return result;
  }

  async updateSensorReading(id: string, reading: Partial<SensorReading>): Promise<SensorReading> {
    const [result] = await db
      .update(sensorReadings)
      .set(reading)
      .where(eq(sensorReadings.id, id))
      .returning();
    return result;
  }

  // Anomalies operations
  async getAnomalies(): Promise<Anomaly[]> {
    return await db
      .select()
      .from(anomalies)
      .orderBy(desc(anomalies.detectedAt));
  }

  async getActiveAnomalies(): Promise<Anomaly[]> {
    return await db
      .select()
      .from(anomalies)
      .where(eq(anomalies.isResolved, false))
      .orderBy(desc(anomalies.detectedAt));
  }

  async insertAnomaly(anomaly: NewAnomaly): Promise<Anomaly> {
    const [result] = await db
      .insert(anomalies)
      .values(anomaly)
      .returning();
    return result;
  }

  async updateAnomaly(id: string, anomaly: Partial<Anomaly>): Promise<Anomaly> {
    const [result] = await db
      .update(anomalies)
      .set(anomaly)
      .where(eq(anomalies.id, id))
      .returning();
    return result;
  }

  async resolveAnomaly(id: string, rootCause?: string): Promise<Anomaly> {
    const [result] = await db
      .update(anomalies)
      .set({
        isResolved: true,
        resolvedAt: new Date(),
        rootCause: rootCause,
      })
      .where(eq(anomalies.id, id))
      .returning();
    return result;
  }

  // Alerts operations
  async getAlerts(): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .orderBy(desc(alerts.createdAt));
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.status, "active"))
      .orderBy(desc(alerts.createdAt));
  }

  async insertAlert(alert: NewAlert): Promise<Alert> {
    const [result] = await db
      .insert(alerts)
      .values(alert)
      .returning();
    return result;
  }

  async updateAlert(id: string, alert: Partial<Alert>): Promise<Alert> {
    const [result] = await db
      .update(alerts)
      .set(alert)
      .where(eq(alerts.id, id))
      .returning();
    return result;
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert> {
    const [result] = await db
      .update(alerts)
      .set({
        status: "acknowledged",
        acknowledgedAt: new Date(),
        acknowledgedBy: acknowledgedBy,
      })
      .where(eq(alerts.id, id))
      .returning();
    return result;
  }

  // Equipment status operations
  async getEquipmentStatus(): Promise<EquipmentStatus[]> {
    return await db
      .select()
      .from(equipmentStatus)
      .orderBy(desc(equipmentStatus.updatedAt));
  }

  async insertEquipmentStatus(status: NewEquipmentStatus): Promise<EquipmentStatus> {
    const [result] = await db
      .insert(equipmentStatus)
      .values(status)
      .returning();
    return result;
  }

  async updateEquipmentStatus(id: string, status: Partial<EquipmentStatus>): Promise<EquipmentStatus> {
    const [result] = await db
      .update(equipmentStatus)
      .set({ ...status, updatedAt: new Date() })
      .where(eq(equipmentStatus.id, id))
      .returning();
    return result;
  }

  // Process parameters operations
  async getProcessParameters(): Promise<ProcessParameter[]> {
    return await db
      .select()
      .from(processParameters)
      .orderBy(desc(processParameters.timestamp));
  }

  async insertProcessParameter(param: NewProcessParameter): Promise<ProcessParameter> {
    const [result] = await db
      .insert(processParameters)
      .values(param)
      .returning();
    return result;
  }

  async updateProcessParameter(id: string, param: Partial<ProcessParameter>): Promise<ProcessParameter> {
    const [result] = await db
      .update(processParameters)
      .set(param)
      .where(eq(processParameters.id, id))
      .returning();
    return result;
  }

  // Production metrics operations
  async getProductionMetrics(limit = 100): Promise<ProductionMetrics[]> {
    return await db
      .select()
      .from(productionMetrics)
      .orderBy(desc(productionMetrics.timestamp))
      .limit(limit);
  }

  async insertProductionMetrics(metrics: NewProductionMetrics): Promise<ProductionMetrics> {
    const [result] = await db
      .insert(productionMetrics)
      .values(metrics)
      .returning();
    return result;
  }

  async getProductionMetricsByTimeRange(startTime: Date, endTime: Date): Promise<ProductionMetrics[]> {
    return await db
      .select()
      .from(productionMetrics)
      .where(
        and(
          gte(productionMetrics.timestamp, startTime),
          lte(productionMetrics.timestamp, endTime)
        )
      )
      .orderBy(desc(productionMetrics.timestamp));
  }
}

export const storage = new DatabaseStorage();