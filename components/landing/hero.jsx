"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useAccount, useConnect } from "wagmi";
import CoinbaseButton from "@/app/Components/CoinbaseButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import CoinbaseButton from "./Components/CoinbaseButton"; // import CoinbaseButton

export const Hero = () => {
  const { address, isConnected } = useAccount();
  const { connectors } = useConnect();

  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      router.push("/details");
    }
  }, [isConnected, address, router]);

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto w-full max-w-7xl py-8 sm:py-16">
        <div className="flex flex-col-reverse lg:flex-row gap-10">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Seamless Institution Experience: Identity, Payments, and Access - All in
              One Software.
            </h2>
            <h6 className="text-lg sm:text-xl font-medium opacity-80">
              Your key to effortless shopping, secure identity verification, and
              hassle-free activities.
            </h6>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
