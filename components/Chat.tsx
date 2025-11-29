"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string | null | undefined;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  useEffect(() => {
    if (!accessToken) {
      const errorDetails = {
        message: "Missing access token for Chat component initialization.",
        timestamp: new Date().toISOString(),
        hint:
          "Pass a valid accessToken prop from parent after token retrieval. This component relies on the token to authenticate with the Hume API.",
      };
      console.error("Chat initialization error", errorDetails);
      setInitError("Access token not available. Please authenticate to obtain a token and retry.");
      // Optionally show a toast
      toast.error("Chat: Access token not available");
    }
  }, [accessToken]);

  if (!accessToken) {
    // Render a user-friendly error if no token is available
    return (
      <div
        role={"alert"}
        className={"p-4 m-4 border border-red-500 bg-red-50 rounded"}
      >
        <strong>Chat initialization error:</strong> Access token not available.
        <div className={"mt-2 text-sm text-gray-700"}>
          Please authenticate to obtain an access token and retry.
        </div>
        <div className={"mt-2 text-xs text-gray-500"}>
          Details have been logged for debugging.
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
        onError={(error) => {
          toast.error(error.message);
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}
