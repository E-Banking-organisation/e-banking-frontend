export interface AgentTransaction {
    id: string;
    type: 'enrollment' | 'account_creation' | 'subscription_management' | 'client_update';
    date: Date;
    details: string;
    agentId: string;
    clientId?: string;
    status: 'pending' | 'completed' | 'failed';
  }