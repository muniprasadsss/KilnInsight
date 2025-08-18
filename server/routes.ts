import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertSensorReadingSchema, insertAnomalySchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Sensor readings endpoints
  app.get('/api/sensor-readings', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const readings = await storage.getSensorReadings(limit);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch sensor readings' });
    }
  });

  app.get('/api/sensor-readings/latest', async (req, res) => {
    try {
      const readings = await storage.getLatestSensorReadings();
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch latest sensor readings' });
    }
  });

  app.post('/api/sensor-readings', async (req, res) => {
    try {
      const validation = insertSensorReadingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid sensor reading data', errors: validation.error.errors });
      }
      
      const reading = await storage.createSensorReading(validation.data);
      
      // Broadcast new reading to connected clients
      broadcast({ type: 'sensor_reading', data: reading });
      
      res.status(201).json(reading);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create sensor reading' });
    }
  });

  // Anomalies endpoints
  app.get('/api/anomalies', async (req, res) => {
    try {
      const status = req.query.status as string;
      const anomalies = await storage.getAnomalies(status);
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch anomalies' });
    }
  });

  app.get('/api/anomalies/active', async (req, res) => {
    try {
      const anomalies = await storage.getActiveAnomalies();
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch active anomalies' });
    }
  });

  app.get('/api/anomalies/:id', async (req, res) => {
    try {
      const anomaly = await storage.getAnomalyById(req.params.id);
      if (!anomaly) {
        return res.status(404).json({ message: 'Anomaly not found' });
      }
      res.json(anomaly);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch anomaly' });
    }
  });

  app.post('/api/anomalies', async (req, res) => {
    try {
      const validation = insertAnomalySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid anomaly data', errors: validation.error.errors });
      }
      
      const anomaly = await storage.createAnomaly(validation.data);
      
      // Broadcast new anomaly to connected clients
      broadcast({ type: 'anomaly', data: anomaly });
      
      res.status(201).json(anomaly);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create anomaly' });
    }
  });

  app.patch('/api/anomalies/:id', async (req, res) => {
    try {
      const anomaly = await storage.updateAnomaly(req.params.id, req.body);
      if (!anomaly) {
        return res.status(404).json({ message: 'Anomaly not found' });
      }
      
      // Broadcast anomaly update to connected clients
      broadcast({ type: 'anomaly_update', data: anomaly });
      
      res.json(anomaly);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update anomaly' });
    }
  });

  // Alerts endpoints
  app.get('/api/alerts', async (req, res) => {
    try {
      const acknowledged = req.query.acknowledged === 'true' ? true : 
                         req.query.acknowledged === 'false' ? false : undefined;
      const alerts = await storage.getAlerts(acknowledged);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch alerts' });
    }
  });

  app.post('/api/alerts', async (req, res) => {
    try {
      const validation = insertAlertSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid alert data', errors: validation.error.errors });
      }
      
      const alert = await storage.createAlert(validation.data);
      
      // Broadcast new alert to connected clients
      broadcast({ type: 'alert', data: alert });
      
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create alert' });
    }
  });

  app.patch('/api/alerts/:id/acknowledge', async (req, res) => {
    try {
      const { acknowledgedBy } = req.body;
      if (!acknowledgedBy) {
        return res.status(400).json({ message: 'acknowledgedBy is required' });
      }
      
      const alert = await storage.acknowledgeAlert(req.params.id, acknowledgedBy);
      if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
      }
      
      // Broadcast alert acknowledgment to connected clients
      broadcast({ type: 'alert_acknowledged', data: alert });
      
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Failed to acknowledge alert' });
    }
  });

  // Process parameters endpoints
  app.get('/api/process-parameters', async (req, res) => {
    try {
      const parameters = await storage.getProcessParameters();
      res.json(parameters);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch process parameters' });
    }
  });

  // Failure modes endpoints
  app.get('/api/failure-modes', async (req, res) => {
    try {
      const failureModes = await storage.getFailureModes();
      res.json(failureModes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch failure modes' });
    }
  });

  // Equipment status endpoints
  app.get('/api/equipment-status', async (req, res) => {
    try {
      const equipment = await storage.getEquipmentStatus();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch equipment status' });
    }
  });

  // Production data endpoints
  app.get('/api/production-data', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const data = await storage.getProductionData(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch production data' });
    }
  });

  // Simulate real-time data generation
  setInterval(async () => {
    try {
      // Generate new sensor readings
      const sensorIds = ["temp_preheater_1", "speed_kiln_1", "o2_percent_1", "nox_ppm_1", "fuel_flow_1", "feed_rate_1"];
      const locations = ["preheater", "rotary_kiln", "rotary_kiln", "rotary_kiln", "rotary_kiln", "preheater"];
      const units = ["°C", "rpm", "%", "ppm", "kg/h", "tph"];
      const names = ["Preheater Temperature", "Kiln Speed", "O2 Percentage", "NOx Level", "Fuel Flow", "Feed Rate"];
      
      for (let i = 0; i < sensorIds.length; i++) {
        const baseValues: Record<string, number> = {
          "temp_preheater_1": 544.2,
          "speed_kiln_1": 2.01,
          "o2_percent_1": 3.98,
          "nox_ppm_1": 332,
          "fuel_flow_1": 6956,
          "feed_rate_1": 117.8,
        };
        
        const base = baseValues[sensorIds[i]] || 100;
        const value = Number((base * (0.95 + Math.random() * 0.1)).toFixed(2));
        
        const reading = await storage.createSensorReading({
          sensorId: sensorIds[i],
          sensorName: names[i],
          value,
          unit: units[i],
          location: locations[i],
          quality: "good"
        });
        
        broadcast({ type: 'sensor_reading', data: reading });
      }
    } catch (error) {
      console.error('Error generating simulated data:', error);
    }
  }, 5000); // Generate new data every 5 seconds

  return httpServer;
}
