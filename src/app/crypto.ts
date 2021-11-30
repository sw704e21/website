export interface Crypto {
  id: string;
  icon: string,
  name: string;
  displayName: string;
  mostInfluence: Number;
  mostInteractions: Number;
  price: Number;
  mentions: Number;
  relMentions: Number;
  relSentiment: Number;
  posSentiment: Number;
  negSentiment: Number;

  //Momentum score
  final_score: number;
  average_sentiment: number;
  correlation_rank: number;
  price_score: number;
  social_score: number;
}
