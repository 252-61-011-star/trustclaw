import { z } from "zod";

export const ALLOWED_ANTHROPIC_MODELS = [
  "gemma-4-31b-it",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
  "claude-sonnet-4-5-20250929",
  "claude-opus-4-6",
  "claude-haiku-4-5-20251001",
] as const;

export const allowedAnthropicModelSchema = z.enum(ALLOWED_ANTHROPIC_MODELS);

export const createInstanceInput = z.object({
  anthropicModel: allowedAnthropicModelSchema.default(
    "gemma-4-31b-it",
  ),
});

export type CreateInstanceInput = z.infer<typeof createInstanceInput>;
