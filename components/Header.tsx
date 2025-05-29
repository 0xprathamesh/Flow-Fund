import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAdmin } from "@/hooks/useAdmin";

export function Header() {
  const { isAdmin } = useAdmin();

  return (
    <header className="w-full border-b shadow-sm py-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M13 2L3 14h9l-1 8L21 10h-8l1-8z" />
            </svg>
          </div>
          <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            FlowFund
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {isAdmin && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Admin
            </span>
          )}
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </header>
  );
}
