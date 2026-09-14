"use client";

import dynamic from "next/dynamic";
import { useLang } from "@/i18n/LanguageProvider";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { Loader } from "./Loader";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { UIProvider } from "./UIProvider";
import { cn } from "@/lib/utils";

const Scene = dynamic(() => import("@/components/three/Scene").then((m) => m.Scene), { ssr: false });

export function AppShell({ children }: { children: React.ReactNode }) {
  const { switching, lang } = useLang();
  return (
    <UIProvider>
      <SmoothScroll />
      <Loader />
      <Cursor />
      <Scene />
      <Header />
      <main id="main" key={lang} className={cn("relative z-[1]", switching && "lang-swap")}>
        {children}
      </main>
      <Footer />
    </UIProvider>
  );
}
