export interface Student {
  id: string;
  name: string;
  grade_level: string;
  parent_id: string;
  parent: {
    is_subscribed: boolean;
    subscription_status: string;
  };
  insights: Insight[];
  action_plans: ActionPlan[];
  readiness_score: number;
  assessments: Assessment[];
  created_at: string;
}

export interface Assessment {
  id: string;
  type: string;
  data: Record<string, unknown>;
  analysis_results: Record<string, any>;
  created_at: string;
}

export interface Insight {
  id: string;
  type: "risk" | "strength" | "habit" | "trend";
  title: string;
  observation: string;
  interpretation: string;
  confidence_score: number;
  created_at: string;
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  role_target: "parent" | "student";
  status: "pending" | "in_progress" | "completed";
  due_date?: string;
  created_at: string;
}
