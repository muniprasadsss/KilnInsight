import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { CsvLoader } from "./csv-loader";
import { 
  insertSensorReadingSchema, 
  insertAnomalySchema, 
  insertAlertSchema,
  insertEquipmentStatusSchema,
  insertProcessParameterSchema,
  insertProductionMetricsSchema
} from "@shared/schema";

const csvLoader = new CsvLoader();

export function registerRoutes(app: Express): Server {
  // CSV Data endpoints - Load cement kiln data from files
  app.get("/api/cement-kiln-data", async (req, res) => {
    try {
      const { limit = 1000, offset = 0 } = req.query;
      const data = await storage.getCementKilnData(Number(limit), Number(offset));
      res.json(data);
    } catch (error) {
      console.error("Error fetching cement kiln data:", error);
      res.status(500).json({ message: "Failed to fetch cement kiln data" });
    }
  });

  app.get("/api/cement-kiln-data/anomalous", async (req, res) => {
    try {
      const data = await storage.getAnomalousData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching anomalous data:", error);
      res.status(500).json({ message: "Failed to fetch anomalous data" });
    }
  });

  app.get("/api/episodes", async (req, res) => {
    try {
      const episodes = await storage.getEpisodes();
      res.json(episodes);
    } catch (error) {
      console.error("Error fetching episodes:", error);
      res.status(500).json({ message: "Failed to fetch episodes" });
    }
  });

  app.get("/api/episodes/:episodeId", async (req, res) => {
    try {
      const { episodeId } = req.params;
      const episode = await storage.getEpisodeById(episodeId);
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      res.json(episode);
    } catch (error) {
      console.error("Error fetching episode:", error);
      res.status(500).json({ message: "Failed to fetch episode" });
    }
  });

  // CSV Data loading endpoint
  app.post("/api/load-csv-data", async (req, res) => {
    try {
      // Load data from CSV files and populate database
      const trainData = csvLoader.getTrainData();
      const testData = csvLoader.getTestData();
      const episodeData = csvLoader.getEpisodes();
      
      // Transform and insert cement kiln data
      const cementData = [...trainData, ...testData].map(record => ({
        timestamp: record.timestamp,
        preheater_outlet_temp: record.preheater_outlet_temp,
        kiln_inlet_temp: record.kiln_inlet_temp,
        kiln_shell_temp: record.kiln_shell_temp,
        cooler_inlet_temp: record.cooler_inlet_temp,
        clinker_temp: record.clinker_temp,
        raw_meal_flow: record.raw_meal_flow,
        fuel_flow: record.fuel_flow,
        primary_air_flow: record.primary_air_flow,
        secondary_air_flow: record.secondary_air_flow,
        production_rate: record.production_rate,
        kiln_speed: record.kiln_speed,
        fan_speed: record.fan_speed,
        main_drive_power: record.main_drive_power,
        main_drive_torque: record.main_drive_torque,
        preheater_pressure: record.preheater_pressure,
        kiln_pressure: record.kiln_pressure,
        nox_emissions: record.nox_emissions,
        o2_percentage: record.o2_percentage,
        co_emissions: record.co_emissions,
        so2_emissions: record.so2_emissions,
        specific_energy_consumption: record.specific_energy_consumption,
        fuel_type: record.fuel_type,
        is_anomaly: record.is_anomaly,
        event: record.event,
        episode_id: record.episode_id,
        data_source: trainData.includes(record) ? "train" : "test"
      }));

      // Insert data in batches
      const batchSize = 1000;
      const batches = [];
      for (let i = 0; i < cementData.length; i += batchSize) {
        batches.push(cementData.slice(i, i + batchSize));
      }

      let insertedRecords = 0;
      for (const batch of batches) {
        const result = await storage.insertCementKilnData(batch);
        insertedRecords += result.length;
      }

      // Insert episodes
      const episodes = episodeData.map(episode => ({
        episodeId: episode.episode_id,
        startTime: episode.start_time,
        endTime: episode.end_time,
        durationMin: episode.duration_min,
        failureMode: episode.failure_mode,
        severity: episode.severity || "normal",
        description: episode.description || `Episode ${episode.episode_id}: Duration ${episode.duration_min} minutes`
      }));

      const insertedEpisodes = await storage.insertEpisodes(episodes);

      res.json({
        message: "CSV data loaded successfully",
        cementKilnRecords: insertedRecords,
        episodes: insertedEpisodes.length
      });
    } catch (error) {
      console.error("Error loading CSV data:", error);
      res.status(500).json({ message: "Failed to load CSV data" });
    }
  });

  // Sensor readings endpoints
  app.get("/api/sensor-readings", async (req, res) => {
    try {
      const readings = await storage.getSensorReadings();
      res.json(readings);
    } catch (error) {
      console.error("Error fetching sensor readings:", error);
      res.status(500).json({ message: "Failed to fetch sensor readings" });
    }
  });

  app.get("/api/sensor-readings/latest", async (req, res) => {
    try {
      const readings = await storage.getLatestSensorReadings();
      res.json(readings);
    } catch (error) {
      console.error("Error fetching latest sensor readings:", error);
      res.status(500).json({ message: "Failed to fetch latest sensor readings" });
    }
  });

  app.post("/api/sensor-readings", async (req, res) => {
    try {
      const validatedData = insertSensorReadingSchema.parse(req.body);
      const reading = await storage.insertSensorReading(validatedData);
      res.status(201).json(reading);
    } catch (error) {
      console.error("Error creating sensor reading:", error);
      res.status(400).json({ message: "Invalid sensor reading data" });
    }
  });

  // Anomalies endpoints
  app.get("/api/anomalies", async (req, res) => {
    try {
      const anomalies = await storage.getAnomalies();
      res.json(anomalies);
    } catch (error) {
      console.error("Error fetching anomalies:", error);
      res.status(500).json({ message: "Failed to fetch anomalies" });
    }
  });

  app.get("/api/anomalies/active", async (req, res) => {
    try {
      const anomalies = await storage.getActiveAnomalies();
      res.json(anomalies);
    } catch (error) {
      console.error("Error fetching active anomalies:", error);
      res.status(500).json({ message: "Failed to fetch active anomalies" });
    }
  });

  app.post("/api/anomalies", async (req, res) => {
    try {
      const validatedData = insertAnomalySchema.parse(req.body);
      const anomaly = await storage.insertAnomaly(validatedData);
      res.status(201).json(anomaly);
    } catch (error) {
      console.error("Error creating anomaly:", error);
      res.status(400).json({ message: "Invalid anomaly data" });
    }
  });

  app.patch("/api/anomalies/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      const { rootCause } = req.body;
      const anomaly = await storage.resolveAnomaly(id, rootCause);
      res.json(anomaly);
    } catch (error) {
      console.error("Error resolving anomaly:", error);
      res.status(500).json({ message: "Failed to resolve anomaly" });
    }
  });

  // Alerts endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/active", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching active alerts:", error);
      res.status(500).json({ message: "Failed to fetch active alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.insertAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
      const { id } = req.params;
      const { acknowledgedBy } = req.body;
      const alert = await storage.acknowledgeAlert(id, acknowledgedBy);
      res.json(alert);
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Equipment status endpoints
  app.get("/api/equipment-status", async (req, res) => {
    try {
      const equipment = await storage.getEquipmentStatus();
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching equipment status:", error);
      res.status(500).json({ message: "Failed to fetch equipment status" });
    }
  });

  app.post("/api/equipment-status", async (req, res) => {
    try {
      const validatedData = insertEquipmentStatusSchema.parse(req.body);
      const equipment = await storage.insertEquipmentStatus(validatedData);
      res.status(201).json(equipment);
    } catch (error) {
      console.error("Error creating equipment status:", error);
      res.status(400).json({ message: "Invalid equipment status data" });
    }
  });

  // Process parameters endpoints
  app.get("/api/process-parameters", async (req, res) => {
    try {
      const parameters = await storage.getProcessParameters();
      res.json(parameters);
    } catch (error) {
      console.error("Error fetching process parameters:", error);
      res.status(500).json({ message: "Failed to fetch process parameters" });
    }
  });

  app.post("/api/process-parameters", async (req, res) => {
    try {
      const validatedData = insertProcessParameterSchema.parse(req.body);
      const parameter = await storage.insertProcessParameter(validatedData);
      res.status(201).json(parameter);
    } catch (error) {
      console.error("Error creating process parameter:", error);
      res.status(400).json({ message: "Invalid process parameter data" });
    }
  });

  // Production metrics endpoints
  app.get("/api/production-metrics", async (req, res) => {
    try {
      const { limit = 100 } = req.query;
      const metrics = await storage.getProductionMetrics(Number(limit));
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching production metrics:", error);
      res.status(500).json({ message: "Failed to fetch production metrics" });
    }
  });

  app.post("/api/production-metrics", async (req, res) => {
    try {
      const validatedData = insertProductionMetricsSchema.parse(req.body);
      const metrics = await storage.insertProductionMetrics(validatedData);
      res.status(201).json(metrics);
    } catch (error) {
      console.error("Error creating production metrics:", error);
      res.status(400).json({ message: "Invalid production metrics data" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    // Send initial data
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Cement Kiln Monitor WebSocket'
    }));

    // Simulate real-time sensor updates
    const interval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          const latestReadings = await storage.getLatestSensorReadings();
          ws.send(JSON.stringify({
            type: 'sensor_update',
            data: latestReadings.slice(0, 5) // Send latest 5 readings
          }));
        } catch (error) {
          console.error('Error sending sensor updates:', error);
        }
      }
    }, 5000); // Update every 5 seconds

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clearInterval(interval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(interval);
    });
  });

  return httpServer;
}