export interface TokenData {
  tokenName: string;
  symbol: string;
  supply: number;
  tokenImageUrl: string;
  tokenDescription: string;
  contractAddress: string | null;
  youtube: string;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;

  youtubeChannelId: string | null;
  twitchChannelId: string | null;
}
