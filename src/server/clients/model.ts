import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import { env } from "~/env";

/* eslint-disable @typescript-eslint/restrict-template-expressions */
export function resolveLanguageModel(modelName?: string): LanguageModel | string {
  const geminiKey = env.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;

  if (geminiKey) {
    const google = createGoogleGenerativeAI({
      apiKey: geminiKey,
    });
    const targetModel = modelName ?? "gemma-4-31b-it";
    const cleanModel = targetModel
      .replace(/^google\//, "")
      .replace(/^anthropic\//, "")
      .replace(/^models\//, "");

    // If it's a gemma or gemini model, or default
    if (cleanModel.startsWith("gemma") || cleanModel.startsWith("gemini")) {
      return google(cleanModel);
    }

    return google("gemma-4-31b-it");
  }

  const model = modelName ?? "gemma-4-31b-it";
  if (model.includes("/")) return model;
  return `anthropic/${model}`;
}
