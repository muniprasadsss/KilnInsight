import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import AnomalyDashboard from "@/pages/anomaly-dashboard";
import RootCauseAnalysis from "@/pages/root-cause-analysis";
import AlertsCenter from "@/pages/alerts-center";
import OperationsDashboard from "@/pages/operations-dashboard";
import AdvancedAnalytics from "@/pages/advanced-analytics";
import UserReporting from "@/pages/user-reporting";
import DataManagement from "@/pages/data-management";
import Notifications from "@/pages/notifications";
import Security from "@/pages/security";
import NotFound from "@/pages/not-found";
import SensorDashboard from "@/pages/sensor-dashboard";
import Dashboard from "./components/Newcomponents/Dashboard";
import Anomalydetection from "./components/Newcomponents/Anomalydetection";
import Optimisation from "./components/Newcomponents/Optimisation";
import Login from "./components/Newcomponents/Loginpage";
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* <Route path="/">
        <Layout title="Anomaly Dashboard" description="Real-time cement kiln monitoring and anomaly detection">
          <AnomalyDashboard />
        </Layout>
      </Route> */}
      <Route path="/">
        <Login />
      </Route>
      <Route path="/dashboard">
      <ProtectedRoute>
        <Layout title="Dashboard" description="Real-time cement kiln monitoring and anomaly detection">
          <Dashboard />
        </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/root-cause">
         <ProtectedRoute>
        <Layout title="Root Cause Analysis" description="Deep dive analysis of anomalies and their causal relationships">
          <RootCauseAnalysis />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/alerts">
         <ProtectedRoute>
        <Layout title="Alerts Center" description="Manage and configure system alerts and notifications">
          <AlertsCenter />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/operations">
         <ProtectedRoute>
        <Layout title="Operations Dashboard" description="Real-time operational KPIs and equipment monitoring">
          <OperationsDashboard />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/analytics">
         <ProtectedRoute>
        <Layout title="Advanced Analytics" description="Pattern analysis and predictive insights">
          <AdvancedAnalytics />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/reporting">
         <ProtectedRoute>
        <Layout title="User Reporting" description="Generate and manage custom reports">
          <UserReporting />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/data-management">
         <ProtectedRoute>
        <Layout title="Data Management" description="Manage data sources and quality monitoring">
          <DataManagement />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/sensors">
         <ProtectedRoute>
        <Layout title="Sensor Dashboard" description="Comprehensive real-time sensor monitoring from CSV datasets">
          <SensorDashboard />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/notifications">
         <ProtectedRoute>
        <Layout title="Notifications" description="Configure notification settings and delivery">
          <Notifications />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/security">
         <ProtectedRoute>
        <Layout title="Security Management" description="User access control and audit logging">
          <Security />
        </Layout>
         </ProtectedRoute>
      </Route>

      <Route path="/dashboard">
         <ProtectedRoute>
        <Layout title="Dashboard" description="Real-time cement kiln monitoring">
          <Dashboard />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/anomaly">
         <ProtectedRoute>
        <Layout title="Anomaly Detection" description="Real-time cement kiln monitoring and anomaly detection">
          <Anomalydetection />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route path="/optimization">
         <ProtectedRoute>
        <Layout title="Optimization" description="Optimization screen">
          <Optimisation />
        </Layout>
         </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
