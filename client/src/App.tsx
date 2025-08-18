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
import ComprehensiveDashboard from "@/pages/comprehensive-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Layout title="Comprehensive Dashboard" description="Full-stack React/Node.js/PostgreSQL cement kiln monitoring">
          <ComprehensiveDashboard />
        </Layout>
      </Route>
      <Route path="/root-cause">
        <Layout title="Root Cause Analysis" description="Deep dive analysis of anomalies and their causal relationships">
          <RootCauseAnalysis />
        </Layout>
      </Route>
      <Route path="/alerts">
        <Layout title="Alerts Center" description="Manage and configure system alerts and notifications">
          <AlertsCenter />
        </Layout>
      </Route>
      <Route path="/operations">
        <Layout title="Operations Dashboard" description="Real-time operational KPIs and equipment monitoring">
          <OperationsDashboard />
        </Layout>
      </Route>
      <Route path="/analytics">
        <Layout title="Advanced Analytics" description="Pattern analysis and predictive insights">
          <AdvancedAnalytics />
        </Layout>
      </Route>
      <Route path="/reporting">
        <Layout title="User Reporting" description="Generate and manage custom reports">
          <UserReporting />
        </Layout>
      </Route>
      <Route path="/data-management">
        <Layout title="Data Management" description="Manage data sources and quality monitoring">
          <DataManagement />
        </Layout>
      </Route>
      <Route path="/sensors">
        <Layout title="Sensor Dashboard" description="Comprehensive real-time sensor monitoring from CSV datasets">
          <SensorDashboard />
        </Layout>
      </Route>
      <Route path="/notifications">
        <Layout title="Notifications" description="Configure notification settings and delivery">
          <Notifications />
        </Layout>
      </Route>
      <Route path="/security">
        <Layout title="Security Management" description="User access control and audit logging">
          <Security />
        </Layout>
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
