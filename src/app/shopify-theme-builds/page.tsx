import { BuildPageView } from "@/components/build/BuildPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Builds + Migrations | Hoahwa",
  description:
    "Discovery, migration, and Shopify theme development for ambitious DTC brands on Shopify Plus.",
};

export default function BuildPage() {
  return <BuildPageView />;
}
