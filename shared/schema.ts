import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  decimal,
  boolean,
  uuid,
  serial,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Cement kiln data table - stores all CSV data
export const cementKilnData = pgTable("cement_kiln_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  timestamp: timestamp("timestamp").notNull(),
  // Temperature sensors
  preheater_outlet_temp: real("preheater_outlet_temp"),
  kiln_inlet_temp: real("kiln_inlet_temp"), 
  kiln_shell_temp: real("kiln_shell_temp"),
  cooler_inlet_temp: real("cooler_inlet_temp"),
  clinker_temp: real("clinker_temp"),
  // Flow rates
  raw_meal_flow: real("raw_meal_flow"),
  fuel_flow: real("fuel_flow"),
  primary_air_flow: real("primary_air_flow"),
  secondary_air_flow: real("secondary_air_flow"),
  production_rate: real("production_rate"),
  // Speeds and power
  kiln_speed: real("kiln_speed"),
  fan_speed: real("fan_speed"),
  main_drive_power: real("main_drive_power"),
  main_drive_torque: real("main_drive_torque"),
  // Pressures
  preheater_pressure: real("preheater_pressure"),
  kiln_pressure: real("kiln_pressure"),
  // Emissions
  nox_emissions: real("nox_emissions"),
  o2_percentage: real("o2_percentage"),
  co_emissions: real("co_emissions"),
  so2_emissions: real("so2_emissions"),
  // Energy and efficiency
  specific_energy_consumption: real("specific_energy_consumption"),
  // Fuel and process data
  fuel_type: varchar("fuel_type", { length: 50 }),
  // Anomaly detection
  is_anomaly: integer("is_anomaly"),
  event: varchar("event", { length: 200 }),
  episode_id: varchar("episode_id", { length: 50 }),
  // Metadata
  data_source: varchar("data_source", { length: 20 }).notNull().default("train"), // train, test, episode
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Episodes table for failure mode analysis
export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  episodeId: varchar("episode_id", { length: 50 }).notNull().unique(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  durationMin: integer("duration_min").notNull(),
  failureMode: varchar("failure_mode", { length: 200 }),
  severity: varchar("severity", { length: 20 }),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Sensor readings table for real-time monitoring
export const sensorReadings = pgTable("sensor_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  sensorId: varchar("sensor_id", { length: 100 }).notNull(),
  sensorName: varchar("sensor_name", { length: 200 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  quality: varchar("quality", { length: 20 }), // good, warning, bad
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Anomalies table  
export const anomalies = pgTable("anomalies", {
  id: uuid("id").primaryKey().defaultRandom(),
  sensorId: varchar("sensor_id", { length: 100 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // critical, warning, normal
  description: text("description").notNull(),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  isResolved: boolean("is_resolved").notNull().default(false),
  impact: text("impact"),
  rootCause: text("root_cause"),
  confidenceScore: real("confidence_score"),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(), 
  anomalyId: uuid("anomaly_id").references(() => anomalies.id),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, acknowledged, resolved
  createdAt: timestamp("created_at").notNull().defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at"),
  acknowledgedBy: varchar("acknowledged_by", { length: 100 }),
});

// Equipment status table
export const equipmentStatus = pgTable("equipment_status", {
  id: uuid("id").primaryKey().defaultRandom(),
  equipmentId: varchar("equipment_id", { length: 100 }).notNull(),
  equipmentName: varchar("equipment_name", { length: 200 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // operational, maintenance, fault
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
  efficiency: decimal("efficiency", { precision: 5, scale: 2 }),
  location: varchar("location", { length: 100 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Process parameters table
export const processParameters = pgTable("process_parameters", {
  id: uuid("id").primaryKey().defaultRandom(),
  parameterId: varchar("parameter_id", { length: 100 }).notNull(),
  parameterName: varchar("parameter_name", { length: 200 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).notNull(),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  minValue: decimal("min_value", { precision: 10, scale: 2 }),
  maxValue: decimal("max_value", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Production metrics table
export const productionMetrics = pgTable("production_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  productionRate: real("production_rate").notNull(),
  energyConsumption: real("energy_consumption").notNull(),
  fuelConsumption: real("fuel_consumption").notNull(),
  clinkerQuality: real("clinker_quality"),
  efficiency: real("efficiency"),
  downtime: integer("downtime").default(0),
  shiftId: varchar("shift_id", { length: 20 }),
});

// Relations
export const anomaliesRelations = relations(anomalies, ({ many }) => ({
  alerts: many(alerts),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  anomaly: one(anomalies, {
    fields: [alerts.anomalyId],
    references: [anomalies.id],
  }),
}));

// Export types
export type CementKilnData = typeof cementKilnData.$inferSelect;
export type NewCementKilnData = typeof cementKilnData.$inferInsert;

export type Episode = typeof episodes.$inferSelect;
export type NewEpisode = typeof episodes.$inferInsert;

export type SensorReading = typeof sensorReadings.$inferSelect;
export type NewSensorReading = typeof sensorReadings.$inferInsert;

export type Anomaly = typeof anomalies.$inferSelect;  
export type NewAnomaly = typeof anomalies.$inferInsert;

export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;

export type EquipmentStatus = typeof equipmentStatus.$inferSelect;
export type NewEquipmentStatus = typeof equipmentStatus.$inferInsert;

export type ProcessParameter = typeof processParameters.$inferSelect;
export type NewProcessParameter = typeof processParameters.$inferInsert;

export type ProductionMetrics = typeof productionMetrics.$inferSelect;
export type NewProductionMetrics = typeof productionMetrics.$inferInsert;

// Zod schemas for validation
export const insertCementKilnDataSchema = createInsertSchema(cementKilnData);
export const insertEpisodeSchema = createInsertSchema(episodes);
export const insertSensorReadingSchema = createInsertSchema(sensorReadings);
export const insertAnomalySchema = createInsertSchema(anomalies);
export const insertAlertSchema = createInsertSchema(alerts);
export const insertEquipmentStatusSchema = createInsertSchema(equipmentStatus);
export const insertProcessParameterSchema = createInsertSchema(processParameters);
export const insertProductionMetricsSchema = createInsertSchema(productionMetrics);