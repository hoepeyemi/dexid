"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Web3 from "web3";
import Loader from "./Loader";
import Background from "./Background";
import { UploadButton, UploadDropzone } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

function AuthUser() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [matricNumber, setMatricNumber] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
  };

  const textVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const handleCreateId = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading

    const payload = {
      Matric_Number: matricNumber,
      Full_Name: name,
      Passport: image,
      Phone: phone,
      Wallet: address,
    };

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);

        router.push("/card");
      } else {
        console.error("Failed to create document:", await response.json());
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error creating document:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl p-4 sm:p-6 bg-black rounded-lg">
        <Background />

        <motion.form
          className="space-y-6"
          initial="hidden"
          animate="visible"
          onSubmit={handleCreateId}
        >
          <motion.div variants={textVariants}>
            <p className="text-lg sm:text-xl font-medium mb-1.5">
              {/* Welcome message */}
            </p>
            <p className="text-white/60 mb-4 text-sm sm:text-base">
              Confirm Details To Request/Access Your Institution ID
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12"
            variants={textVariants}
          >
            {/* Form fields - make them full width on mobile */}
            <motion.div
              className="flex flex-col space-y-2"
              variants={inputVariants}
              custom={0}
            >
              <label className="text-white/60">Unique ID(Matric Number, Staff ID, etc)</label>
              <motion.input
                className="w-full border-b-2 bg-transparent border-purple-900 focus:outline-none text-white/60"
                type="text"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            {/* Repeat similar changes for other input fields */}
            
            {/* Image upload section */}
            <div className="col-span-1 lg:col-span-2">
              <motion.div
                className="flex flex-col space-y-2"
                variants={inputVariants}
                custom={4}
              >
                <label className="text-white/60">Image (passport photo)</label>
                <UploadDropzone
                  className="bg-[#581c87] w-full"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && Array.isArray(res) && res.length > 0) {
                      setImage(res[0].url);
                    }
                  }}
                  onUploadError={(error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Submit button */}
          <motion.button
            className="w-full sm:w-auto px-7 py-2 bg-purple-900 text-white rounded-md duration-300 font-medium text-center mt-6"
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default AuthUser;
