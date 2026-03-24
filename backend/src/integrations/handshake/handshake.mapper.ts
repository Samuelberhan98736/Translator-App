import type {
  CreateTranslationRequest,
  TranslationResult
} from "../../modules/translations/translation.types";

export type HandshakeJobListing = {
  title: string;
  description: string;
  url?: string;
};

export function mapHandshakeListingToTranslationInput(
  listing: HandshakeJobListing,
  resumeText: string
): CreateTranslationRequest {
  return {
    jobTitle: listing.title,
    jobDescription: listing.description,
    handshakeUrl: listing.url,
    source: "handshake",
    resumeText
  };
}

export function mapTranslationToHandshakePreview(result: TranslationResult): string {
  return `${result.transformedResume}\n\nMatched Keywords: ${result.matchedKeywords.join(", ")}`;
}
