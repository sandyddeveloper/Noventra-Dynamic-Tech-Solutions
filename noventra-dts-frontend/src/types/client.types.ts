// src/types/client.types.ts
export type ClientTier = "Standard" | "Premium" | "Enterprise";
export type ClientHealth = "Healthy" | "At Risk" | "Critical";

export interface Client {
  id: string;
  code: string;
  name: string;
  accountOwner: string;

  email: string;
  phone?: string;
  website?: string;

  industry?: string;
  location?: string;
  timezone?: string;

  tier: ClientTier;
  health: ClientHealth;
  tags: string[];

  // Relationship / business
  mrr: number; // monthly recurring revenue
  arr: number;
  activeProjects: number;
  totalProjects: number;

  // Service & support
  openTickets: number;
  ticketsLast30d: number;
  slaBreachesLast30d: number;
  avgResponseHours: number;

  // AI-related insights (precomputed scores from backend / ML later)
  sentimentScore: number; // -1..1
  aiRiskScore: number; // 0..100 (0 = safe, 100 = very risky)
  aiChurnProbability: number; // 0..1

  // Timestamps
  createdAt: string;
  lastContactAt?: string;
  lastProjectDeliveredAt?: string;
}
