import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, User, UserCheck, UserX, Key, Lock, AlertTriangle, Eye, Plus, Edit, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
  mfaEnabled: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  system: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  critical: boolean;
}

interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure" | "warning";
  details?: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  settings: Record<string, any>;
  lastModified: Date;
}

export default function Security() {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - in real app would come from APIs
  const systemUsers: SystemUser[] = [
    {
      id: "1",
      username: "jdoe",
      email: "john.doe@company.com",
      firstName: "John",
      lastName: "Doe",
      role: "operator",
      department: "Operations",
      status: "active",
      lastLogin: new Date('2024-01-27T08:30:00'),
      createdAt: new Date('2024-01-01'),
      permissions: ["view_dashboard", "acknowledge_alerts", "view_reports"],
      mfaEnabled: true
    },
    {
      id: "2",
      username: "jsmith",
      email: "jane.smith@company.com", 
      firstName: "Jane",
      lastName: "Smith",
      role: "supervisor",
      department: "Operations",
      status: "active",
      lastLogin: new Date('2024-01-27T09:15:00'),
      createdAt: new Date('2023-12-15'),
      permissions: ["view_dashboard", "acknowledge_alerts", "view_reports", "manage_equipment", "export_data"],
      mfaEnabled: true
    },
    {
      id: "3",
      username: "mjohnson",
      email: "mike.johnson@company.com",
      firstName: "Mike", 
      lastName: "Johnson",
      role: "maintenance",
      department: "Maintenance",
      status: "active",
      lastLogin: new Date('2024-01-26T16:45:00'),
      createdAt: new Date('2023-11-20'),
      permissions: ["view_dashboard", "manage_equipment", "schedule_maintenance"],
      mfaEnabled: false
    },
    {
      id: "4",
      username: "swilson",
      email: "sarah.wilson@company.com",
      firstName: "Sarah",
      lastName: "Wilson",
      role: "engineer",
      department: "Engineering", 
      status: "suspended",
      lastLogin: new Date('2024-01-20T14:30:00'),
      createdAt: new Date('2023-10-10'),
      permissions: ["view_dashboard", "configure_system", "manage_analytics", "export_data"],
      mfaEnabled: true
    }
  ];

  const roles: Role[] = [
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: ["*"],
      userCount: 2,
      system: true
    },
    {
      id: "2", 
      name: "Supervisor",
      description: "Operations oversight with equipment management",
      permissions: ["view_dashboard", "acknowledge_alerts", "manage_equipment", "view_reports", "export_data"],
      userCount: 3,
      system: false
    },
    {
      id: "3",
      name: "Operator",
      description: "Basic operations monitoring and alert management",
      permissions: ["view_dashboard", "acknowledge_alerts", "view_reports"],
      userCount: 8,
      system: false
    },
    {
      id: "4",
      name: "Maintenance",
      description: "Equipment maintenance and scheduling",
      permissions: ["view_dashboard", "manage_equipment", "schedule_maintenance", "view_maintenance_reports"],
      userCount: 4,
      system: false
    },
    {
      id: "5",
      name: "Engineer", 
      description: "System configuration and analytics management",
      permissions: ["view_dashboard", "configure_system", "manage_analytics", "export_data", "view_all_reports"],
      userCount: 3,
      system: false
    }
  ];

  const permissions: Permission[] = [
    { id: "1", name: "view_dashboard", description: "View operational dashboards", category: "Viewing", critical: false },
    { id: "2", name: "acknowledge_alerts", description: "Acknowledge system alerts", category: "Operations", critical: false },
    { id: "3", name: "manage_equipment", description: "Control equipment operations", category: "Operations", critical: true },
    { id: "4", name: "configure_system", description: "Modify system configuration", category: "Administration", critical: true },
    { id: "5", name: "manage_users", description: "Create and manage user accounts", category: "Administration", critical: true },
    { id: "6", name: "view_reports", description: "Access operational reports", category: "Viewing", critical: false },
    { id: "7", name: "export_data", description: "Export system data", category: "Data", critical: false },
    { id: "8", name: "manage_analytics", description: "Configure analytics and ML models", category: "Analytics", critical: true },
    { id: "9", name: "schedule_maintenance", description: "Create maintenance schedules", category: "Maintenance", critical: false },
    { id: "10", name: "emergency_stop", description: "Execute emergency stop procedures", category: "Safety", critical: true }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: new Date('2024-01-27T14:21:15'),
      userId: "1",
      username: "jdoe",
      action: "Alert Acknowledged",
      resource: "Burner Trip Alert",
      ipAddress: "192.168.1.101",
      userAgent: "Chrome 120.0",
      status: "success"
    },
    {
      id: "2",
      timestamp: new Date('2024-01-27T13:45:30'),
      userId: "2", 
      username: "jsmith",
      action: "Equipment Control",
      resource: "Kiln Speed Adjustment",
      ipAddress: "192.168.1.102",
      userAgent: "Chrome 120.0",
      status: "success",
      details: "Speed changed from 2.01 to 1.98 rpm"
    },
    {
      id: "3",
      timestamp: new Date('2024-01-27T12:15:22'),
      userId: "4",
      username: "swilson",
      action: "Login Attempt",
      resource: "Authentication System",
      ipAddress: "192.168.1.105",
      userAgent: "Firefox 121.0",
      status: "failure",
      details: "Account suspended"
    },
    {
      id: "4",
      timestamp: new Date('2024-01-27T11:30:45'),
      userId: "3",
      username: "mjohnson", 
      action: "Data Export",
      resource: "Sensor Readings CSV",
      ipAddress: "192.168.1.103",
      userAgent: "Chrome 120.0",
      status: "success",
      details: "Exported 24-hour sensor data"
    }
  ];

  const securityPolicies: SecurityPolicy[] = [
    {
      id: "1",
      name: "Password Policy",
      description: "Password complexity and rotation requirements",
      enabled: true,
      settings: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxAge: 90,
        preventReuse: 5
      },
      lastModified: new Date('2024-01-15')
    },
    {
      id: "2",
      name: "Multi-Factor Authentication",
      description: "MFA requirements for user roles",
      enabled: true,
      settings: {
        requiredForRoles: ["administrator", "supervisor", "engineer"],
        optionalForRoles: ["operator", "maintenance"],
        methods: ["totp", "sms"],
        backupCodes: true
      },
      lastModified: new Date('2024-01-10')
    },
    {
      id: "3",
      name: "Session Management",
      description: "User session timeout and security settings",
      enabled: true,
      settings: {
        idleTimeout: 30,
        absoluteTimeout: 480,
        concurrentSessions: 1,
        secureOnly: true
      },
      lastModified: new Date('2024-01-20')
    },
    {
      id: "4",
      name: "Access Control",
      description: "IP-based access restrictions and monitoring",
      enabled: false,
      settings: {
        allowedNetworks: ["192.168.1.0/24", "10.0.0.0/8"],
        blockedCountries: [],
        failedLoginThreshold: 5,
        lockoutDuration: 15
      },
      lastModified: new Date('2024-01-05')
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <UserCheck className="w-4 h-4 text-status-normal" />;
      case "suspended": return <UserX className="w-4 h-4 text-status-critical" />;
      case "inactive": return <User className="w-4 h-4 text-gray-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "success": return "text-status-normal";
      case "suspended": case "failure": return "text-status-critical";
      case "inactive": case "warning": return "text-status-warning";
      default: return "text-gray-400";
    }
  };

  const handleUserStatusChange = (userId: string, status: string) => {
    console.log('Changing user status:', userId, status);
    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${status}.`,
    });
  };

  const handleResetPassword = (userId: string) => {
    console.log('Resetting password for user:', userId);
    toast({
      title: "Password Reset",
      description: "A password reset link has been sent to the user.",
    });
  };

  const handleTogglePolicy = (policyId: string, enabled: boolean) => {
    console.log('Toggling security policy:', policyId, enabled);
    toast({
      title: enabled ? "Policy Enabled" : "Policy Disabled",
      description: `Security policy has been ${enabled ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{systemUsers.length}</p>
                <p className="text-xs text-status-normal">
                  {systemUsers.filter(u => u.status === 'active').length} Active
                </p>
              </div>
              <User className="text-3xl text-industrial-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">MFA Enabled</p>
                <p className="text-2xl font-bold text-white">
                  {systemUsers.filter(u => u.mfaEnabled).length}
                </p>
                <p className="text-xs text-gray-400">
                  {Math.round((systemUsers.filter(u => u.mfaEnabled).length / systemUsers.length) * 100)}% Coverage
                </p>
              </div>
              <Shield className="text-3xl text-status-normal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Failed Logins</p>
                <p className="text-2xl font-bold text-white">23</p>
                <p className="text-xs text-status-warning">Last 24 hours</p>
              </div>
              <AlertTriangle className="text-3xl text-status-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Key className="text-3xl text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Security Management */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-industrial-card border border-gray-700">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-industrial-accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-industrial-card border-gray-700 max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" className="bg-gray-800 border-gray-600" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" className="bg-gray-800 border-gray-600" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" className="bg-gray-800 border-gray-600" />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" className="bg-gray-800 border-gray-600" />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.filter(r => !r.system).map(role => (
                              <SelectItem key={role.id} value={role.name.toLowerCase()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mfa" />
                        <Label htmlFor="mfa">Require Multi-Factor Authentication</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-industrial-accent">
                          Create User
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Role</TableHead>
                    <TableHead className="text-gray-300">Department</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">MFA</TableHead>
                    <TableHead className="text-gray-300">Last Login</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800">
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(user.status)}
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.status === 'active' ? 'default' :
                          user.status === 'suspended' ? 'destructive' : 'secondary'
                        }>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.mfaEnabled ? (
                          <Shield className="w-4 h-4 text-status-normal" />
                        ) : (
                          <Shield className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {user.lastLogin?.toLocaleString() || 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-industrial-accent">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-400"
                            onClick={() => handleResetPassword(user.id)}
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="space-y-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Role Management</CardTitle>
                  <Button className="bg-industrial-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.map((role) => (
                    <Card key={role.id} className="bg-gray-800 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-white">{role.name}</h3>
                              {role.system && (
                                <Badge variant="outline" className="text-xs">
                                  System Role
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{role.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-400">
                              {role.userCount} users
                            </div>
                            {!role.system && (
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-400">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Permissions</Label>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.includes('*') ? (
                              <Badge variant="destructive">All Permissions</Badge>
                            ) : (
                              role.permissions.map((permission, index) => {
                                const permDetail = permissions.find(p => p.name === permission);
                                return (
                                  <Badge 
                                    key={index} 
                                    variant={permDetail?.critical ? "secondary" : "outline"}
                                    className="text-xs"
                                  >
                                    {permDetail?.name || permission}
                                  </Badge>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Available Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    permissions.reduce((groups, permission) => {
                      const category = permission.category;
                      if (!groups[category]) groups[category] = [];
                      groups[category].push(permission);
                      return groups;
                    }, {} as Record<string, Permission[]>)
                  ).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="font-medium text-white mb-2">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {perms.map((permission) => (
                          <div 
                            key={permission.id} 
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm text-white">{permission.name}</span>
                                {permission.critical && (
                                  <AlertTriangle className="w-4 h-4 text-status-critical" />
                                )}
                              </div>
                              <p className="text-xs text-gray-400">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Security Audit Logs</CardTitle>
                <div className="space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="success">Success Only</SelectItem>
                      <SelectItem value="failure">Failures Only</SelectItem>
                      <SelectItem value="warning">Warnings Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Timestamp</TableHead>
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Action</TableHead>
                    <TableHead className="text-gray-300">Resource</TableHead>
                    <TableHead className="text-gray-300">IP Address</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-gray-800 hover:bg-gray-800">
                      <TableCell className="text-white font-mono text-sm">
                        {log.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {log.username}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {log.action}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {log.resource}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          log.status === 'success' ? 'default' :
                          log.status === 'failure' ? 'destructive' : 'secondary'
                        }>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm max-w-xs truncate">
                        {log.details || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityPolicies.map((policy) => (
                  <Card key={policy.id} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Switch 
                            checked={policy.enabled}
                            onCheckedChange={(checked) => handleTogglePolicy(policy.id, checked)}
                          />
                          <div>
                            <h3 className="font-semibold text-white">{policy.name}</h3>
                            <p className="text-sm text-gray-400">{policy.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            Modified: {policy.lastModified.toLocaleDateString()}
                          </span>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {Object.entries(policy.settings).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                            <span className="font-mono text-white">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
