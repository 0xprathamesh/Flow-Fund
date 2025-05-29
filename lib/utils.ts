
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function formatAmount(amount: bigint): string {
  const ethers = Number(amount) / 1e18;
  return ethers.toFixed(4);
}

export function formatTimeLeft(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  if (date < new Date()) {
    return "Expired";
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

export function calculateProgress(current: bigint, target: bigint): number {
  if (target === BigInt(0)) return 0;
  return Number((current * BigInt(100)) / target);
}

export function parseEther(amount: string): bigint {
  if (!amount || amount === '') return BigInt(0);
  
  try {
    const result = BigInt(Math.floor(Number(amount) * 1e18));
    return result;
  } catch (error) {
    console.error("Error parsing ether:", error);
    return BigInt(0);
  }
}

export function handleError(error: Error): string {
  console.error("Error:", error);
  
  // Handle common solidity errors
  if (error?.message) {
    if (error.message.includes("FundingNotVerified")) {
      return "This campaign has not been verified by admin yet.";
    } else if (error.message.includes("FundingNotActive")) {
      return "This campaign is not active.";
    } else if (error.message.includes("FundingExpired")) {
      return "This campaign has expired.";
    } else if (error.message.includes("InvalidAmount")) {
      return "Invalid amount provided.";
    } else if (error.message.includes("Unauthorized")) {
      return "You are not authorized to perform this action.";
    } else if (error.message.includes("FundingTargetNotReached")) {
      return "Funding target has not been reached yet.";
    } else if (error.message.includes("FundingStillActive")) {
      return "This campaign is still active.";
    } else if (error.message.includes("user rejected transaction")) {
      return "Transaction was rejected by the user.";
    }
    return error.message.slice(0, 100);
  }
  
  return "An error occurred. Please try again.";
}