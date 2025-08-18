import { SensorReading } from "@shared/schema";

export interface AnomalyDetectionResult {
  isAnomaly: boolean;
  confidence: number;
  anomalyType?: string;
  description?: string;
}

export class AnomalyDetector {
  private sensorBaselines: Map<string, { mean: number; std: number; min: number; max: number }> = new Map();

  constructor() {
    this.initializeBaselines();
  }

  private initializeBaselines() {
    // Initialize baseline values for different sensors
    const baselines = {
      "temp_preheater_1": { mean: 544.2, std: 15.0, min: 500, max: 600 },
      "speed_kiln_1": { mean: 2.01, std: 0.1, min: 1.8, max: 2.3 },
      "o2_percent_1": { mean: 3.98, std: 0.5, min: 2.0, max: 6.0 },
      "nox_ppm_1": { mean: 332, std: 25, min: 200, max: 400 },
      "fuel_flow_1": { mean: 6956, std: 200, min: 6000, max: 8000 },
      "feed_rate_1": { mean: 117.8, std: 5.0, min: 100, max: 130 },
    };

    Object.entries(baselines).forEach(([sensorId, baseline]) => {
      this.sensorBaselines.set(sensorId, baseline);
    });
  }

  detectAnomaly(reading: SensorReading): AnomalyDetectionResult {
    const baseline = this.sensorBaselines.get(reading.sensorId);
    
    if (!baseline) {
      return { isAnomaly: false, confidence: 0 };
    }

    // Statistical anomaly detection using z-score
    const zScore = Math.abs((reading.value - baseline.mean) / baseline.std);
    const isStatisticalAnomaly = zScore > 2.5; // 2.5 standard deviations

    // Range-based anomaly detection
    const isOutOfRange = reading.value < baseline.min || reading.value > baseline.max;

    // Rule-based anomaly detection
    const ruleBasedAnomaly = this.checkRuleBasedAnomalies(reading);

    const isAnomaly = isStatisticalAnomaly || isOutOfRange || ruleBasedAnomaly.isAnomaly;
    const confidence = Math.max(
      isStatisticalAnomaly ? Math.min(zScore / 3, 1) : 0,
      isOutOfRange ? 0.9 : 0,
      ruleBasedAnomaly.confidence
    );

    let anomalyType = '';
    let description = '';

    if (isAnomaly) {
      if (isOutOfRange) {
        anomalyType = reading.value > baseline.max ? 'high_value' : 'low_value';
        description = `${reading.sensorName} value ${reading.value}${reading.unit} is ${anomalyType === 'high_value' ? 'above' : 'below'} normal range`;
      } else if (ruleBasedAnomaly.isAnomaly) {
        anomalyType = ruleBasedAnomaly.type || 'rule_based';
        description = ruleBasedAnomaly.description || 'Rule-based anomaly detected';
      } else {
        anomalyType = 'statistical';
        description = `${reading.sensorName} shows statistical deviation (z-score: ${zScore.toFixed(2)})`;
      }
    }

    return {
      isAnomaly,
      confidence,
      anomalyType,
      description,
    };
  }

  private checkRuleBasedAnomalies(reading: SensorReading): { isAnomaly: boolean; confidence: number; type?: string; description?: string } {
    // Implement specific rules for cement kiln operations
    
    if (reading.sensorId === "nox_ppm_1" && reading.value > 350) {
      return {
        isAnomaly: true,
        confidence: 0.8,
        type: 'environmental_violation',
        description: 'NOx levels exceeding environmental limits'
      };
    }

    if (reading.sensorId === "temp_preheater_1" && reading.value > 580) {
      return {
        isAnomaly: true,
        confidence: 0.9,
        type: 'overheat',
        description: 'Preheater temperature exceeding safe operating limits'
      };
    }

    if (reading.sensorId === "o2_percent_1" && reading.value < 2.5) {
      return {
        isAnomaly: true,
        confidence: 0.7,
        type: 'combustion_issue',
        description: 'Low oxygen levels indicating combustion problems'
      };
    }

    if (reading.sensorId === "fuel_flow_1" && reading.value < 5000) {
      return {
        isAnomaly: true,
        confidence: 0.8,
        type: 'fuel_shortage',
        description: 'Significantly reduced fuel flow detected'
      };
    }

    return { isAnomaly: false, confidence: 0 };
  }

  // Detect pattern-based anomalies (requires historical data)
  detectPatternAnomalies(readings: SensorReading[]): AnomalyDetectionResult[] {
    const results: AnomalyDetectionResult[] = [];
    
    // Group readings by sensor
    const sensorGroups = new Map<string, SensorReading[]>();
    readings.forEach(reading => {
      if (!sensorGroups.has(reading.sensorId)) {
        sensorGroups.set(reading.sensorId, []);
      }
      sensorGroups.get(reading.sensorId)!.push(reading);
    });

    // Analyze each sensor group for patterns
    sensorGroups.forEach((sensorReadings, sensorId) => {
      if (sensorReadings.length < 5) return; // Need minimum readings for pattern analysis

      // Sort by timestamp
      sensorReadings.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Check for trend anomalies
      const trendAnomaly = this.detectTrendAnomaly(sensorReadings);
      if (trendAnomaly.isAnomaly) {
        results.push(trendAnomaly);
      }

      // Check for oscillation anomalies
      const oscillationAnomaly = this.detectOscillationAnomaly(sensorReadings);
      if (oscillationAnomaly.isAnomaly) {
        results.push(oscillationAnomaly);
      }
    });

    return results;
  }

  private detectTrendAnomaly(readings: SensorReading[]): AnomalyDetectionResult {
    if (readings.length < 5) {
      return { isAnomaly: false, confidence: 0 };
    }

    const values = readings.map(r => r.value);
    const n = values.length;
    
    // Calculate trend using linear regression
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      const yDiff = values[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const baseline = this.sensorBaselines.get(readings[0].sensorId);
    
    if (!baseline) {
      return { isAnomaly: false, confidence: 0 };
    }

    // Detect significant trends
    const trendThreshold = baseline.std * 0.5; // Threshold for trend detection
    const isTrendAnomaly = Math.abs(slope) > trendThreshold;
    
    return {
      isAnomaly: isTrendAnomaly,
      confidence: isTrendAnomaly ? Math.min(Math.abs(slope) / trendThreshold, 1) : 0,
      anomalyType: 'trend',
      description: `${readings[0].sensorName} showing ${slope > 0 ? 'increasing' : 'decreasing'} trend`
    };
  }

  private detectOscillationAnomaly(readings: SensorReading[]): AnomalyDetectionResult {
    if (readings.length < 10) {
      return { isAnomaly: false, confidence: 0 };
    }

    const values = readings.map(r => r.value);
    
    // Count direction changes to detect oscillations
    let directionChanges = 0;
    for (let i = 2; i < values.length; i++) {
      const prev = values[i - 1] - values[i - 2];
      const curr = values[i] - values[i - 1];
      if ((prev > 0 && curr < 0) || (prev < 0 && curr > 0)) {
        directionChanges++;
      }
    }

    const oscillationRatio = directionChanges / (values.length - 2);
    const isOscillationAnomaly = oscillationRatio > 0.6; // More than 60% direction changes

    return {
      isAnomaly: isOscillationAnomaly,
      confidence: isOscillationAnomaly ? oscillationRatio : 0,
      anomalyType: 'oscillation',
      description: `${readings[0].sensorName} showing excessive oscillation pattern`
    };
  }
}

export const anomalyDetector = new AnomalyDetector();
