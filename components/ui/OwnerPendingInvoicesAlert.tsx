import { useAuth } from "@/hooks/useAuth";
import { FaExclamationTriangle } from "react-icons/fa";

export function OwnerPendingInvoicesAlert() {
  const { ownerPendingInvoices, user } = useAuth();

  if (!user || user.userType !== "HOUSE_OWNER" || !ownerPendingInvoices) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg mb-4 flex items-center gap-3 shadow animate-enter">
      <FaExclamationTriangle className="w-6 h-6 text-yellow-500" />
      <span className="font-medium">
        Você possui boletos pendentes. Entre em contato com o suporte para
        regularizar sua situação.
      </span>
    </div>
  );
}
