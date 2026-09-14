"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { BuyerForm } from "@/components/forms/BuyerForm";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { track } from "@/lib/analytics";

type LeadKind = "buyer" | "partner";
interface UICtx {
  openLead: (kind: LeadKind, prefill?: { product?: string }) => void;
  closeLead: () => void;
}
const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ kind: LeadKind; prefill?: { product?: string } } | null>(null);
  const openLead = useCallback((kind: LeadKind, prefill?: { product?: string }) => {
    track("lead_modal_open", { kind, product: prefill?.product });
    setState({ kind, prefill });
  }, []);
  const closeLead = useCallback(() => setState(null), []);
  const value = useMemo(() => ({ openLead, closeLead }), [openLead, closeLead]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <Modal open={!!state} onClose={closeLead} label={state?.kind === "partner" ? "Partnership" : "Consultation"}>
        <div className="p-6 sm:p-9">
          {state?.kind === "partner" ? <PartnerForm compact /> : <BuyerForm compact prefill={state?.prefill} />}
        </div>
      </Modal>
    </Ctx.Provider>
  );
}

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI outside UIProvider");
  return c;
}
