"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { Campaign, FundingStatus } from "@/types";
import { CONTRACT_ABI, CONTRACT_ADDRESS,publicClient } from "@/lib/web3Config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignDetails } from "./CampaignDetails";

export function PendingCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: totalCampaignsData, refetch: refetchTotal } = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getTotalCampaigns",
  });

  useEffect(() => {
    if (totalCampaignsData !== undefined) {
      fetchAllCampaigns(totalCampaignsData as bigint);
    }
  }, [totalCampaignsData]);

  const fetchAllCampaigns = async (total: bigint) => {
    setLoading(true);
    try {
      const fetchedCampaigns: Campaign[] = [];

      for (let i = 1; i <= Number(total); i++) {
        try {
          const result = await publicClient.readContract({
            abi: CONTRACT_ABI,
            address: CONTRACT_ADDRESS,
            functionName: "getCampaignDetails",
            args: [BigInt(i)],
          });

          if (result) {
            const campaign = result as Campaign;
            if (campaign.status === FundingStatus.Pending) {
              fetchedCampaigns.push(campaign);
            }
          }
        } catch (error) {
          console.error(`Error fetching campaign ${i}:`, error);
        }
      }

      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    refetchTotal();
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseDetails = () => {
    setSelectedCampaign(null);
    handleRefresh();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-pulse-light">Loading pending campaigns...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending campaigns to verify
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={String(campaign.id)}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewDetails(campaign)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCampaign && (
            <CampaignDetails
              campaign={selectedCampaign}
              onClose={handleCloseDetails}
              refetch={handleRefresh}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
