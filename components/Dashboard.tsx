"use client";
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { Campaign, FundingStatus } from "@/types";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/web3Config";
import { CampaignCard } from "./CampaignCard";
import { CampaignDetails } from "./CampaignDetails";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [activeFilter, setActiveFilter] = useState<string>("active");
  const [campaignIds, setCampaignIds] = useState<number[]>([]);

  const { data: totalCampaignsData, refetch: refetchTotal } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getTotalCampaigns",
  });

  useEffect(() => {
    if (totalCampaignsData !== undefined) {
      const total = Number(totalCampaignsData);
      const ids = Array.from({ length: total }, (_, i) => i + 1);
      setCampaignIds(ids);
    }
  }, [totalCampaignsData]);

  const { data: campaignData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCampaignDetails",
    args: [BigInt(campaignIds[0] || 1)],
  });

  useEffect(() => {
    if (campaignData) {
      setCampaigns((prev) => {
        const newCampaigns = [...prev, campaignData as unknown as Campaign];
        return newCampaigns.sort((a, b) => Number(b.deadline - a.deadline));
      });
    }
  }, [campaignData]);

  const handleRefresh = () => {
    setCampaigns([]);
    refetchTotal();
  };

  const handleViewDetails = (id: bigint) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) {
      setSelectedCampaign(campaign);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCampaign(null);
    handleRefresh();
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (activeFilter === "active") {
      return campaign.status === FundingStatus.Active;
    } else if (activeFilter === "successful") {
      return campaign.status === FundingStatus.Successful;
    } else if (activeFilter === "failed") {
      return (
        campaign.status === FundingStatus.Failed ||
        campaign.status === FundingStatus.Cancelled
      );
    } else {
      return true; // "all" filter
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeFilter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={activeFilter === "successful" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("successful")}
        >
          Successful
        </Button>
        <Button
          variant={activeFilter === "failed" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("failed")}
        >
          Failed/Cancelled
        </Button>
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          All
        </Button>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={String(campaign.id)}
              campaign={campaign}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No campaigns found</p>
        </div>
      )}

      {selectedCampaign && (
        <CampaignDetails
          campaign={selectedCampaign}
          onClose={handleCloseDetails}
          refetch={handleRefresh}
        />
      )}
    </div>
  );
}

{
  /* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"> */
}
