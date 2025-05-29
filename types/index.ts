export enum FundingStatus {
  Pending = 0,
  Active = 1,
  Successful = 2,
  Failed = 3,
  Cancelled = 4,
}

export interface Campaign {
  id: bigint;
  owner: string;
  title: string;
  description: string;
  targetAmount: bigint;
  currentAmount: bigint;
  deadline: bigint;
  status: FundingStatus;
  isVerified: boolean;
}

export interface Contribution {
  campaignId: number;
  contributor: string;
  amount: bigint;
}

export interface CreateCampaignFormData {
  title: string;
  description: string;
  targetAmount: string;
  durationDays: string;
}

export interface ContributeFormData {
  amount: string;
}

export const statusNames: Record<number, string> = {
  [FundingStatus.Pending]: "Pending",
  [FundingStatus.Active]: "Active",
  [FundingStatus.Successful]: "Successful",
  [FundingStatus.Failed]: "Failed",
  [FundingStatus.Cancelled]: "Cancelled",
};

export const statusClasses: Record<number, string> = {
  [FundingStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [FundingStatus.Active]: "bg-blue-100 text-blue-800",
  [FundingStatus.Successful]: "bg-green-100 text-green-800",
  [FundingStatus.Failed]: "bg-red-100 text-red-800",
  [FundingStatus.Cancelled]: "bg-gray-100 text-gray-800",
};
