"use client";
import Link from "next/link";
import React from "react";
import { DiamondPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import CoinbaseButton from "@/app/Components/CoinbaseButton";

export const LandingNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full py-4">
      <div className="w-[90%] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link
          href=""
          className="text-xl sm:text-2xl font-semibold flex items-center gap-3"
        >
          <DiamondPlus />
          <span className="whitespace-nowrap">Henry-hub-ID-verify</span>
        </Link>

        <div className="w-full sm:w-auto">
          <CoinbaseButton />
        </div>
      </div>
    </nav>
  );
};
