"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Campaign, FundingStatus, statusClasses, statusNames } from "@/types";
import {
  calculateProgress,
  formatAddress,
  formatAmount,
  formatTimeLeft,
  handleError,
  parseEther,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/web3Config";
import { useAdmin } from "@/hooks/useAdmin";

interface CampaignDetailsProps {
  campaign: Campaign;
  onClose: () => void;
  refetch: () => void;
}

export function CampaignDetails({
  campaign,
  onClose,
  refetch,
}: CampaignDetailsProps) {
  const { address } = useAccount();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const { data: userContribution } = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getUserContribution",
    args: [
      campaign.id,
      address || "0x0000000000000000000000000000000000000000",
    ],
  });

  const progress = calculateProgress(
    campaign.currentAmount,
    campaign.targetAmount
  );
  const isOwner = address?.toLowerCase() === campaign.owner.toLowerCase();
  const canContribute =
    campaign.status === FundingStatus.Active &&
    Number(campaign.deadline) > Math.floor(Date.now() / 1000);
  const canWithdraw =
    isOwner &&
    campaign.status === FundingStatus.Active &&
    campaign.currentAmount >= campaign.targetAmount;

  const canRefund =
    (address && campaign.status === FundingStatus.Cancelled) ||
    (campaign.status === FundingStatus.Active &&
      Number(campaign.deadline) <= Math.floor(Date.now() / 1000) &&
      campaign.currentAmount < campaign.targetAmount);

  const canVerify = isAdmin && campaign.status === FundingStatus.Pending;
  const canCancel =
    isAdmin &&
    (campaign.status === FundingStatus.Pending ||
      campaign.status === FundingStatus.Active);

  const handleContribute = async () => {
    if (!amount || !campaign) return;

    try {
      setIsSubmitting(true);
      const parsedAmount = parseEther(amount);
      await writeContractAsync({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "contribute",
        args: [campaign.id],
        value: parsedAmount,
      });

      toast({
        title: "Success",
        description: "Contribution successful!",
      });
      setAmount("");
      refetch();
    } catch (error: unknown) {
      const errorMessage = String(
        handleError(error instanceof Error ? error : new Error(String(error)))
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!campaign) return;

    try {
      setIsSubmitting(true);
      await writeContractAsync({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "verifyFunding",
        args: [campaign.id],
      });

      toast({
        title: "Success",
        description: "Campaign verified successfully!",
      });
      refetch();
    } catch (error: unknown) {
      const errorMessage = String(
        handleError(error instanceof Error ? error : new Error(String(error)))
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!campaign) return;

    try {
      setIsSubmitting(true);
      await writeContractAsync({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "cancelCampaign",
        args: [campaign.id],
      });

      toast({
        title: "Success",
        description: "Campaign cancelled successfully!",
      });
      refetch();
    } catch (error: unknown) {
      const errorMessage = String(
        handleError(error instanceof Error ? error : new Error(String(error)))
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!campaign) return;

    try {
      setIsSubmitting(true);
      await writeContractAsync({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "withdrawFunds",
        args: [campaign.id],
      });

      toast({
        title: "Success",
        description: "Funds withdrawn successfully!",
      });
      refetch();
    } catch (error: unknown) {
      const errorMessage = String(
        handleError(error instanceof Error ? error : new Error(String(error)))
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimRefund = async () => {
    if (!campaign) return;

    try {
      setIsSubmitting(true);
      await writeContractAsync({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "claimRefund",
        args: [campaign.id],
      });

      toast({
        title: "Success",
        description: "Refund claimed successfully!",
      });
      refetch();
    } catch (error: unknown) {
      const errorMessage = String(
        handleError(error instanceof Error ? error : new Error(String(error)))
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{campaign.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span>by {formatAddress(campaign.owner)}</span>
                {isOwner && (
                  <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                    You
                  </span>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                statusClasses[campaign.status]
              }`}
            >
              {statusNames[campaign.status]}
            </span>
          </div>

          <p className="text-gray-700 mb-6 whitespace-pre-line">
            {campaign.description}
          </p>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">
                  {formatAmount(campaign.currentAmount)} ETH raised
                </span>
                <span>{formatAmount(campaign.targetAmount)} ETH goal</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className="font-medium">
                  {formatTimeLeft(campaign.deadline)}
                </p>
              </div>

              {address && typeof userContribution === "bigint" && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Your Contribution</p>
                  <p className="font-medium">
                    {formatAmount(userContribution)} ETH
                  </p>
                </div>
              )}
            </div>

            {canContribute && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">
                  Contribute to this campaign
                </h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount in ETH"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Button
                    onClick={handleContribute}
                    disabled={isSubmitting || !amount}
                  >
                    {isSubmitting ? "Processing..." : "Contribute"}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {canWithdraw && (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleWithdraw}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Withdraw Funds"}
                </Button>
              )}

              {canRefund && Number(userContribution) > 0 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClaimRefund}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Claim Refund"}
                </Button>
              )}

              {isAdmin && (
                <div className="flex gap-2 flex-1">
                  {canVerify && (
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleVerify}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Verify"}
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Cancel"}
                    </Button>
                  )}
                </div>
              )}

              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
