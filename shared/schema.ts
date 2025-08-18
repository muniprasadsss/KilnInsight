import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sensor readings table
export const sensorReadings = pgTable("sensor_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sensorId: varchar("sensor_id").notNull(),
  sensorName: varchar("sensor_name").notNull(),
  value: real("value").notNull(),
  unit: varchar("unit").notNull(),
  location: varchar("location").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  quality: varchar("quality").default("good"), // good, warning, bad
});

// Anomalies table
export const anomalies = pgTable("anomalies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  episodeId: varchar("episode_id").notNull().unique(),
  type: varchar("type").notNull(), // burner_trip, cyclone_blockage, esp_overheat, etc.
  severity: varchar("severity").notNull(), // critical, warning, normal
  location: varchar("location").notNull(), // preheater, rotary_kiln, cooler
  description: text("description").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  status: varchar("status").default("active"), // active, acknowledged, resolved
  impactedSensors: jsonb("impacted_sensors"), // array of sensor IDs
  rootCause: text("root_cause"),
  recommendation: text("recommendation"),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  anomalyId: varchar("anomaly_id").references(() => anomalies.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  severity: varchar("severity").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  acknowledged: boolean("acknowledged").default(false),
  acknowledgedBy: varchar("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
});

// Process parameters table
export const processParameters = pgTable("process_parameters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parameterName: varchar("parameter_name").notNull(),
  currentValue: real("current_value").notNull(),
  targetValue: real("target_value"),
  minLimit: real("min_limit"),
  maxLimit: real("max_limit"),
  unit: varchar("unit").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Failure modes table
export const failureModes = pgTable("failure_modes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  location: varchar("location").notNull(),
  description: text("description").notNull(),
  symptoms: jsonb("symptoms"), // array of symptoms
  causes: jsonb("causes"), // array of potential causes
  impacts: jsonb("impacts"), // array of impacts
  preventiveMeasures: jsonb("preventive_measures"), // array of preventive measures
});

// Equipment status table
export const equipmentStatus = pgTable("equipment_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").notNull(),
  equipmentName: varchar("equipment_name").notNull(),
  location: varchar("location").notNull(),
  status: varchar("status").notNull(), // running, stopped, maintenance, fault
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
  efficiency: real("efficiency"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Production data table
export const productionData = pgTable("production_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productionRate: real("production_rate").notNull(), // TPH
  energyConsumption: real("energy_consumption").notNull(), // kcal/kg
  fuelConsumption: real("fuel_consumption").notNull(), // kg/h
  rawMaterialFeed: real("raw_material_feed").notNull(), // tph
  qualityIndex: real("quality_index"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertSensorReadingSchema = createInsertSchema(sensorReadings).omit({ id: true, timestamp: true });
export const insertAnomalySchema = createInsertSchema(anomalies).omit({ id: true, startTime: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, timestamp: true });
export const insertProcessParameterSchema = createInsertSchema(processParameters).omit({ id: true, timestamp: true });
export const insertFailureModeSchema = createInsertSchema(failureModes).omit({ id: true });
export const insertEquipmentStatusSchema = createInsertSchema(equipmentStatus).omit({ id: true, timestamp: true });
export const insertProductionDataSchema = createInsertSchema(productionData).omit({ id: true, timestamp: true });

// Types
export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;
export type Anomaly = typeof anomalies.$inferSelect;
export type InsertAnomaly = z.infer<typeof insertAnomalySchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type ProcessParameter = typeof processParameters.$inferSelect;
export type InsertProcessParameter = z.infer<typeof insertProcessParameterSchema>;
export type FailureMode = typeof failureModes.$inferSelect;
export type InsertFailureMode = z.infer<typeof insertFailureModeSchema>;
export type EquipmentStatus = typeof equipmentStatus.$inferSelect;
export type InsertEquipmentStatus = z.infer<typeof insertEquipmentStatusSchema>;
export type ProductionData = typeof productionData.$inferSelect;
export type InsertProductionData = z.infer<typeof insertProductionDataSchema>;
