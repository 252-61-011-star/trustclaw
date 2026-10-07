"use client";

import { useState } from "react";
import type { z } from "zod";
import { Loader2 } from "lucide-react";
import { trpc } from "~/clients/trpc";
import { allowedAnthropicModelSchema } from "~/server/api/routers/trustclaw/createInstance.schema";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  showSuccessToast,
  trpcToastOnError,
} from "~/components/core/toast-notifications";

const MODELS = [
  {
    value: "gemma-4-31b-it",
    label: "Gemma 4 31B",
    description: "Open model, most capable",
  },
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    description: "Fast & multimodal",
  },
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    description: "Advanced reasoning",
  },
  {
    value: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    description: "Lightweight & fast",
  },
  {
    value: "claude-opus-4-6",
    label: "Claude Opus 4.6",
    description: "Most capable",
  },
  {
    value: "claude-sonnet-4-5-20250929",
    label: "Claude Sonnet 4.5",
    description: "Balanced",
  },
  {
    value: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    description: "Fast & affordable",
  },
] as const;

type AllowedModel = z.infer<typeof allowedAnthropicModelSchema>;

interface ModelSettingsProps {
  currentModel: string;
}

export function ModelSettings({ currentModel }: ModelSettingsProps) {
  const parsed = allowedAnthropicModelSchema.catch("claude-sonnet-4-5-20250929").parse(currentModel);
  const [selectedModel, setSelectedModel] = useState<AllowedModel>(parsed);
  const utils = trpc.useUtils();

  const updateSettings = trpc.trustclaw.updateSettings.useMutation({
    onSuccess: () => {
      showSuccessToast("Model updated");
      void utils.trustclaw.getInstance.invalidate();
    },
    onError: trpcToastOnError,
  });

  const hasChanges = selectedModel !== currentModel;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model</CardTitle>
        <CardDescription>
          Choose which AI model powers your assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>AI Model</Label>
          <Select
            value={selectedModel}
            onValueChange={(val) => {
              const model = allowedAnthropicModelSchema.safeParse(val);
              if (model.success) setSelectedModel(model.data);
            }}
          >
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  <span>{m.label}</span>
                  <span className="ml-2 text-muted-foreground">
                    - {m.description}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          disabled={!hasChanges || updateSettings.isPending}
          onClick={() =>
            void updateSettings.mutateAsync({ anthropicModel: selectedModel })
          }
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
