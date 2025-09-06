export interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export interface ContributionObj {
  id: string;
  title: string;
  description: string;
  user_id: string;
  department: string;
  created_at: string;
  points: number;
  status: string;
}

export interface DashboardContribution {
  contribution: ContributionObj;
  club_name: string;
  department_name: string;
}

export interface Activity {
  id: string;
  title: string;
  uid: string;
  department: string;
  date: string;
  points: number;
}
