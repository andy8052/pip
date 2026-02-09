"use client";

import { useState, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";

interface LaunchResult {
  tokenAddress?: string;
  tokenName?: string;
  tokenSymbol?: string;
  deployTxHash?: string;
}

export function LaunchForm() {
  const { authenticated, getAccessToken, login } = usePrivy();
  const [targetHandle, setTargetHandle] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PNG, JPEG, WebP, or GIF.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("File too large. Maximum size is 4 MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authenticated) {
      login();
      return;
    }

    if (!imageFile) {
      setError("Please upload a token image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getAccessToken();

      // Step 1: Upload image to Vercel Blob
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      const tokenImageUrl = uploadData.url;

      // Step 2: Launch the token with the uploaded image URL
      const res = await fetch("/api/launch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetTwitterUsername: targetHandle.replace(/^@/, ""),
          tokenName,
          tokenSymbol,
          tokenImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Launch failed");
      }

      setResult({
        tokenAddress: data.launch.tokenAddress,
        tokenName: data.launch.tokenName,
        tokenSymbol: data.launch.tokenSymbol,
        deployTxHash: data.launch.deployTxHash,
      });

      // Reset form
      setTargetHandle("");
      setTokenName("");
      setTokenSymbol("");
      clearImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="targetHandle"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            X Profile Handle
          </label>
          <input
            id="targetHandle"
            type="text"
            placeholder="@elonmusk"
            value={targetHandle}
            onChange={(e) => setTargetHandle(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tokenName"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            Token Name
          </label>
          <input
            id="tokenName"
            type="text"
            placeholder="Elon Coin"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            maxLength={128}
          />
        </div>
        <div>
          <label
            htmlFor="tokenSymbol"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            Token Symbol
          </label>
          <input
            id="tokenSymbol"
            type="text"
            placeholder="ELON"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            maxLength={16}
          />
        </div>
        <div>
          <label
            htmlFor="tokenImage"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            Token Image
          </label>
          {imagePreview ? (
            <div className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 p-3">
              <Image
                src={imagePreview}
                alt="Token image preview"
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-cover"
                unoptimized
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {imageFile?.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {imageFile
                    ? `${(imageFile.size / 1024).toFixed(1)} KB`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={clearImage}
                className="rounded-md p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border border-dashed border-zinc-700 bg-zinc-900 px-3 py-6 text-zinc-500 hover:border-zinc-500 hover:text-zinc-400 transition-colors flex flex-col items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-sm">
                Click to upload image
              </span>
              <span className="text-xs">
                PNG, JPEG, WebP, or GIF (max 4 MB)
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            id="tokenImage"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Deploying..."
            : authenticated
              ? "Launch Token"
              : "Sign in to Launch"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-green-800 bg-green-950/50 p-4 space-y-2">
          <p className="font-medium text-green-400">Token launched!</p>
          <p className="text-sm text-zinc-400">
            <span className="text-zinc-500">Name:</span> {result.tokenName} ($
            {result.tokenSymbol})
          </p>
          {result.tokenAddress && (
            <p className="text-sm text-zinc-400 break-all">
              <span className="text-zinc-500">Address:</span>{" "}
              <a
                href={`https://basescan.org/address/${result.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {result.tokenAddress}
              </a>
            </p>
          )}
          {result.deployTxHash && (
            <p className="text-sm text-zinc-400 break-all">
              <span className="text-zinc-500">Tx:</span>{" "}
              <a
                href={`https://basescan.org/tx/${result.deployTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {result.deployTxHash}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
