# Cement Kiln Monitoring System

A comprehensive industrial monitoring and analytics platform for cement kiln operations with real-time anomaly detection, root cause analysis, and operational dashboards.

## Features

- **Real-time Sensor Monitoring**: Comprehensive dashboard displaying all sensor data from actual cement kiln CSV datasets
- **Anomaly Detection**: Statistical analysis with z-score calculations and rule-based detection
- **Root Cause Analysis**: Deep dive analysis of anomalies and their causal relationships
- **Alert Management**: Configurable alerts with acknowledgment workflow
- **Operations Dashboard**: Real-time operational KPIs and equipment monitoring
- **Advanced Analytics**: Pattern analysis and predictive insights
- **Data Management**: ETL capabilities for various industrial data sources
- **User Reporting**: Generate and manage custom reports

## System Architecture

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for state management
- shadcn/ui components with Tailwind CSS
- Chart.js for data visualization
- WebSocket for real-time updates

### Backend
- Node.js with Express.js
- TypeScript with ES modules
- WebSocket server for live data streaming
- PostgreSQL with Neon serverless hosting
- Drizzle ORM for database operations

## Local Setup Instructions

### Prerequisites

1. **Node.js** (version 18 or higher)
   ```bash
   # Check your Node.js version
   node --version
   
   # If you need to install Node.js:
   # Download from https://nodejs.org/
   # Or use nvm:
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **PostgreSQL Database**
   ```bash
   # Option 1: Local PostgreSQL installation
   # Ubuntu/Debian:
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS with Homebrew:
   brew install postgresql
   brew services start postgresql
   
   # Option 2: Use Docker
   docker run --name cement-kiln-db -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres:15
   
   # Option 3: Use a cloud service like Neon, Supabase, or Railway
   ```

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd cement-kiln-monitoring
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/cement_kiln_db
   
   # For local PostgreSQL:
   PGHOST=localhost
   PGPORT=5432
   PGUSER=your_username
   PGPASSWORD=your_password
   PGDATABASE=cement_kiln_db
   
   # Session Configuration
   SESSION_SECRET=your-super-secret-session-key-here
   
   # Development Configuration
   NODE_ENV=development
   PORT=5000
   ```

4. **Database Setup**
   
   Create the database:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE cement_kiln_db;
   
   # Exit psql
   \q
   ```
   
   Push the database schema:
   ```bash
   npm run db:push
   ```

5. **CSV Data Files**
   
   The system uses real cement kiln data. Ensure these CSV files are in the `attached_assets` folder:
   - `cement_kiln_train_70_1755521187464.csv` (training data)
   - `cement_kiln_test_30_1755521187463.csv` (test data)
   - `cement_kiln_episodes_30days_1755521187462.csv` (episodes data)

6. **Start the Application**
   ```bash
   npm run dev
   ```
   
   This command starts both the Express server (backend) and Vite dev server (frontend).

7. **Access the Application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
cement-kiln-monitoring/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   ├── csv-loader.ts      # CSV data processing
│   └── db.ts              # Database configuration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
├── attached_assets/        # CSV data files
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## API Endpoints

### Sensor Data
- `GET /api/sensor-readings/latest` - Get latest sensor readings
- `GET /api/sensor-readings/history` - Get historical sensor data

### Anomalies
- `GET /api/anomalies/active` - Get active anomalies
- `POST /api/anomalies` - Create new anomaly

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert
- `PATCH /api/alerts/:id/acknowledge` - Acknowledge alert

### Failure Modes
- `GET /api/failure-modes` - Get all failure modes
- `GET /api/failure-modes/:id` - Get specific failure mode

## Real-time Features

The system includes WebSocket support for real-time updates:
- Live sensor data streaming
- Real-time anomaly notifications
- Equipment status updates

## Data Sources

The system processes real cement kiln operational data including:
- Temperature sensors (preheater, kiln zones, clinker)
- Flow rates (fuel, feed, production)
- Speed sensors (kiln, fans)
- Emissions monitoring (O2, CO, NOx)
- Pressure and torque measurements
- Energy consumption metrics

## Dashboard Features

### Sensor Dashboard
- Real-time display of all 21+ sensors
- Grouped by sensor type and location
- Quality indicators and status monitoring
- Interactive charts and heatmaps

### Anomaly Dashboard
- Active anomaly monitoring
- Severity classification
- Root cause analysis tools
- Historical anomaly patterns

### Operations Dashboard
- Equipment status overview
- Production metrics
- Energy efficiency monitoring
- Alert management

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   sudo service postgresql status
   
   # Restart PostgreSQL
   sudo service postgresql restart
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

3. **CSV Data Loading Issues**
   - Ensure CSV files are in the correct `attached_assets` folder
   - Check file permissions
   - Verify CSV format matches expected schema

4. **Missing Dependencies**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Environment Variables

Make sure all required environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Set to 'development' for local development

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production-ready database
3. Configure proper session storage
4. Set up SSL/TLS certificates
5. Use a process manager like PM2
6. Configure reverse proxy (nginx)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue in the repository