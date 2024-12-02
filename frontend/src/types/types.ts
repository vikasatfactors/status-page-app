export interface Service {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
  description?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  service_id: string;
  status: 'investigating' | 'active' | 'monitoring' | 'resolved';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  team_id: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  organization_id: string;
  description?: string;
  members: User[];
  created_at: string;
  updated_at: string;
}

export interface WebSocketMessage {
  type: 'service-update' | 'incident-update' | 'team-update';
  payload: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Status {
  service_id: string;
  current_status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
  lastUpdated: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface TeamManagement {
  teamId: string;
  name: string;
  members: TeamMember[];
}
