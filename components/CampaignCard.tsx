import { Campaign, statusClasses, statusNames } from "@/types";
import {
  calculateProgress,
  formatAddress,
  formatAmount,
  formatTimeLeft,
} from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAccount } from "wagmi";

type CampaignCardProps = {
  campaign: Campaign;
  onViewDetails: (id: bigint) => void;
};

export function CampaignCard({ campaign, onViewDetails }: CampaignCardProps) {
  const { address } = useAccount();
  const progress = calculateProgress(
    campaign.currentAmount,
    campaign.targetAmount
  );
  const isOwner = address?.toLowerCase() === campaign.owner.toLowerCase();

  return (
    <Card
      className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onViewDetails(campaign.id)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold line-clamp-1">
            {campaign.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              statusClasses[campaign.status]
            }`}
          >
            {statusNames[campaign.status]}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
          {campaign.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {formatAmount(campaign.currentAmount)} ETH raised
            </span>
            <span className="font-medium">
              {formatAmount(campaign.targetAmount)} ETH goal
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <span>by {formatAddress(campaign.owner)}</span>
            {isOwner && (
              <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                You
              </span>
            )}
          </div>
          <div className="text-gray-600">
            {formatTimeLeft(campaign.deadline)}
          </div>
        </div>
      </div>
    </Card>
  );
}
