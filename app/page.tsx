"use client";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdmin } from "@/hooks/useAdmin";
import { useAccount } from "wagmi";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { CreateCampaignForm } from "@/components/CreateCampaignForm";
import { PendingCampaigns } from "@/components/PendingCampaigns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { address } = useAccount();
  const { isAdmin } = useAdmin();
  const isMobile = useIsMobile();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Header />

      <main className="flex-1 container mx-auto py-8 px-2 sm:px-4 w-full max-w-7xl">
        {!address ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="glass-card p-6 sm:p-8 rounded-xl max-w-lg w-full">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">FlowFund</h1>
              <p className="text-muted-foreground mb-6 text-base sm:text-lg">
                Connect your wallet to start exploring crowdfunding campaigns or
                create your own.
              </p>
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-px rounded-lg w-full">
                  <Button
                    variant="default"
                    className="w-full bg-background text-foreground hover:bg-muted"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <Tabs defaultValue="campaigns">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <TabsList className="w-full sm:w-auto flex-1">
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  {isAdmin && (
                    <TabsTrigger value="admin">Admin Panel</TabsTrigger>
                  )}
                </TabsList>

                {!isMobile && (
                  <Button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="w-full sm:w-auto"
                  >
                    {showCreateForm ? "Hide Create Form" : "Create Campaign"}
                  </Button>
                )}
              </div>

              {isMobile && (
                <div className="mb-6">
                  <Button
                    className="w-full"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                  >
                    {showCreateForm ? "Hide Create Form" : "Create Campaign"}
                  </Button>
                </div>
              )}

              {showCreateForm && (
                <div className="mb-8">
                  <CreateCampaignForm />
                </div>
              )}

              <TabsContent value="campaigns">
                <Dashboard />
              </TabsContent>

              {isAdmin && (
                <TabsContent value="admin">
                  <div className="space-y-8">
                    <PendingCampaigns />
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </main>

      <footer className="border-t py-6 mt-8 w-full">
        <div className="container mx-auto px-2 sm:px-4 text-center text-xs sm:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FlowFund - A decentralized
          crowdfunding platform.
        </div>
      </footer>
    </div>
  );
};

export default Index;
