"use client";

import { useState, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  Button,
  Input,
  FileUpload,
  Alert,
  AlertTitle,
  AlertDescription,
  VStack,
  Text,
} from "@/design-system";

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

  function handleFileSelect(file: File | null) {
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
      <form onSubmit={handleSubmit}>
        <VStack gap="md">
          <Input
            label="X Profile Handle"
            id="targetHandle"
            type="text"
            placeholder="@elonmusk"
            value={targetHandle}
            onChange={(e) => setTargetHandle(e.target.value)}
            required
          />

          <Input
            label="Token Name"
            id="tokenName"
            type="text"
            placeholder="Elon Coin"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            required
            maxLength={128}
          />

          <Input
            label="Token Symbol"
            id="tokenSymbol"
            type="text"
            placeholder="ELON"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            required
            maxLength={16}
          />

          <FileUpload
            ref={fileInputRef}
            label="Token Image"
            hint="PNG, JPEG, WebP, or GIF (max 4 MB)"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onFileSelect={handleFileSelect}
            preview={imagePreview}
            fileName={imageFile?.name}
            fileSize={
              imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : undefined
            }
            onClear={clearImage}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            {loading
              ? "Deploying..."
              : authenticated
                ? "Launch Token"
                : "Sign in to Launch"}
          </Button>
        </VStack>
      </form>

      {error && (
        <Alert variant="danger" className="mt-[var(--space-4)]">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert variant="success" className="mt-[var(--space-4)]">
          <AlertTitle>Token launched!</AlertTitle>
          <AlertDescription>
            <VStack gap="xs">
              <Text variant="body-sm" as="p">
                <Text variant="caption" as="span">Name:</Text>{" "}
                {result.tokenName} (${result.tokenSymbol})
              </Text>
              {result.tokenAddress && (
                <Text variant="body-sm" as="p" className="break-all">
                  <Text variant="caption" as="span">Address:</Text>{" "}
                  <a
                    href={`https://basescan.org/address/${result.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-default)] hover:underline underline-offset-4"
                  >
                    {result.tokenAddress}
                  </a>
                </Text>
              )}
              {result.deployTxHash && (
                <Text variant="body-sm" as="p" className="break-all">
                  <Text variant="caption" as="span">Tx:</Text>{" "}
                  <a
                    href={`https://basescan.org/tx/${result.deployTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-default)] hover:underline underline-offset-4"
                  >
                    {result.deployTxHash}
                  </a>
                </Text>
              )}
            </VStack>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
