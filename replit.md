# Cement Kiln Monitoring System

## Overview

This application is a comprehensive cement kiln monitoring and anomaly detection system built with a modern full-stack React/Node.js/PostgreSQL architecture. The system provides real-time monitoring of industrial cement kilns with complete database integration, featuring anomaly detection, root cause analysis, alert management, and operational dashboards. It's designed for industrial operators to monitor equipment health, detect potential failures, and optimize production efficiency.

The application serves multiple user roles including operations personnel, maintenance teams, and management, providing different levels of access to monitoring data, analytics, and reporting capabilities.

## Recent Changes (December 2024)

✓ **Complete Application Revamp**: Fully implemented ReactJS, Node.js, and PostgreSQL architecture as requested
✓ **Comprehensive Database Schema**: Created complete PostgreSQL schema with cement_kiln_data, episodes, sensor_readings, anomalies, alerts, equipment_status, process_parameters, production_metrics tables
✓ **Full Database Integration**: Replaced all in-memory storage with PostgreSQL database operations using Drizzle ORM
✓ **CSV Data Integration**: Successfully integrated all 3 CSV files (30,239 training + 12,961 test + 18 episodes records) into PostgreSQL
✓ **Comprehensive Dashboard**: Built new comprehensive dashboard showing real PostgreSQL data with React components
✓ **Real-time WebSocket Updates**: Implemented WebSocket connections for live data streaming from database
✓ **Complete CRUD Operations**: Full Create, Read, Update, Delete operations for all data entities
✓ **Production-Ready Architecture**: Scalable database design with proper relations and indexing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching, React hooks for local state
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable interfaces
- **Styling**: Tailwind CSS with custom industrial theme variables and dark mode support
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API server
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Real-time Communication**: WebSocket server for live data streaming and notifications
- **Request Logging**: Custom middleware for API request/response logging and monitoring

### Data Storage & Schema
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Design**: Normalized relational structure with tables for:
  - Sensor readings with quality indicators and location metadata
  - Anomalies with severity levels, impact analysis, and resolution tracking
  - Alerts with acknowledgment workflow and user assignment
  - Process parameters, equipment status, and production metrics
  - Failure modes and root cause analysis data

### Real-time Data Processing
- **WebSocket Integration**: Bidirectional communication for live sensor data updates
- **Anomaly Detection**: Client-side statistical analysis using z-score calculations and rule-based detection
- **Data Quality**: Sensor reading validation with quality indicators (good/warning/bad)

### Authentication & Security
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Access Control**: Role-based permissions for different user types and system areas
- **Audit Logging**: Comprehensive tracking of user actions and system changes

### Development & Deployment
- **Development**: Vite dev server with HMR, TypeScript compilation, and Replit integration
- **Build Process**: Separate client (Vite) and server (ESBuild) build pipelines
- **Environment**: Monorepo structure with shared schema definitions between client and server
- **Code Quality**: TypeScript strict mode, path aliases for clean imports, and consistent coding patterns

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database with connection pooling
- **Runtime**: Node.js with WebSocket support for real-time communications
- **Session Storage**: PostgreSQL-backed session management for user authentication

### UI & Visualization
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Charts**: Chart.js for data visualization and trend analysis
- **Date Handling**: date-fns for consistent date/time operations across the application
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **Form Management**: React Hook Form with Zod validation for type-safe form handling
- **HTTP Client**: Fetch API with custom query client for server communication
- **Build Tools**: Vite for frontend bundling, ESBuild for server bundling
- **Type Safety**: Drizzle-Zod for automatic schema validation from database definitions

### Industrial-Specific Features
- **Process Monitoring**: Custom components for cement kiln visualization and status tracking
- **Alerting System**: Multi-channel notification support (email, SMS, webhooks)
- **Reporting**: Flexible report generation with multiple output formats
- **Data Management**: ETL capabilities for various industrial data sources and formats