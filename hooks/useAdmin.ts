
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/web3Config";

export function useAdmin() {
  const { address } = useAccount();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: adminAddress } = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "admin",
  });

  useEffect(() => {
    if (address && adminAddress) {
      setIsAdmin(address.toLowerCase() === (adminAddress as string).toLowerCase());
      setIsLoading(false);
    } else {
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [address, adminAddress]);

  return { isAdmin, isLoading };
}