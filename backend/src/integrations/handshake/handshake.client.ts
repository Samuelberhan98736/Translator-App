import type { HandshakeJobListing } from "./handshake.mapper";

export async function searchHandshakeJobs(query: string): Promise<HandshakeJobListing[]> {
  if (!query.trim()) {
    return [];
  }

  return [
    {
      title: `${query} Intern`,
      description: `Sample description for ${query} from placeholder Handshake integration.`,
      url: "https://app.joinhandshake.com"
    }
  ];
}
