export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan_type: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  charity_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  score_value: number;
  score_date: string;
  created_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCharity {
  id: string;
  user_id: string;
  charity_id: string;
  contribution_percentage: number;
  created_at: string;
  charity?: Charity;
}

export interface Donation {
  id: string;
  user_id: string;
  charity_id: string;
  amount: number;
  type: 'subscription' | 'independent';
  created_at: string;
  charity?: Charity;
}

export interface Draw {
  id: string;
  draw_date: string;
  draw_type: 'random' | 'weighted';
  status: 'pending' | 'simulated' | 'published';
  winning_numbers: number[];
  prize_pool_5_match: number;
  prize_pool_4_match: number;
  prize_pool_3_match: number;
  jackpot_rollover: number;
  created_at: string;
  updated_at: string;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  matched_numbers: number[];
  match_count: number;
  prize_amount: number;
  created_at: string;
  user?: Profile;
  draw?: Draw;
}

export interface Winner {
  id: string;
  draw_result_id: string;
  user_id: string;
  match_type: '5_match' | '4_match' | '3_match';
  prize_amount: number;
  verification_status: 'pending' | 'approved' | 'rejected' | 'paid';
  created_at: string;
  updated_at: string;
  user?: Profile;
  draw_result?: DrawResult;
}

export interface WinnerProof {
  id: string;
  winner_id: string;
  proof_url: string;
  notes: string | null;
  submitted_at: string;
}

export interface PrizePool {
  id: string;
  month: string;
  total_pool: number;
  five_match_pool: number;
  four_match_pool: number;
  three_match_pool: number;
  rollover_amount: number;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeSubscribers: number;
  totalPrizePool: number;
  totalCharityContributions: number;
  recentDraws: Draw[];
  pendingVerifications: number;
}
