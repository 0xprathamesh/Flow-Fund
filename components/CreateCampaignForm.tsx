import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther, handleError } from "@/lib/utils";
import { CreateCampaignFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/web3Config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CreateCampaignForm() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const [formData, setFormData] = useState<CreateCampaignFormData>({
    title: "",
    description: "",
    targetAmount: "",
    durationDays: "30",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }

      if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
        throw new Error("Target amount must be greater than 0");
      }

      if (!formData.durationDays || Number(formData.durationDays) <= 0) {
        throw new Error("Duration must be greater than 0 days");
      }

      await writeContractAsync({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "createFunding",
        args: [
          formData.title,
          formData.description,
          parseEther(formData.targetAmount),
          BigInt(Number(formData.durationDays)),
        ],
      });

      toast({
        title: "Campaign Created!",
        description:
          "Your campaign has been created. It will be active after admin verification.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        targetAmount: "",
        durationDays: "30",
      });
    } catch (error) {
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
    <Card className="bg-white w-full max-w-lg mx-auto p-4 sm:p-6 md:p-8">
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
        <CardDescription>
          Launch a new funding campaign. It will be active after admin
          verification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Campaign Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a catchy title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your campaign"
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="targetAmount" className="text-sm font-medium">
                Target Amount (ETH)
              </label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="0.0"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="durationDays" className="text-sm font-medium">
                Duration (Days)
              </label>
              <Input
                id="durationDays"
                name="durationDays"
                type="number"
                min="1"
                max="365"
                value={formData.durationDays}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
