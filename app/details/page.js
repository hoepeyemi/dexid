"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from 'wagmi';
import AuthUser from "../Components/Auth";
import Background from "../Components/Background";
import { LandingNavbar } from "@/components/landing/navbar";
import Loader from "../Components/Loader";

const Page = () => {
  const router = useRouter();
  const { isConnected, isConnecting } = useAccount();

  useEffect(() => {
    if (!isConnected && !isConnecting) {
      router.push('/');
    }
  }, [isConnected, isConnecting, router]);

  if (isConnecting) {
    return <Loader />;
  }

  if (!isConnected) {
    return null;
  }

  return (
    <div className="card-gradient">
      <Background />
      <LandingNavbar />
      <AuthUser />
    </div>
  );
};

export default Page;
