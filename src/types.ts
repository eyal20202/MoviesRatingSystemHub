export interface VoteData  {
    generatedTime: string;
    itemId: number;
    itemCount: number;
  }
  
  export interface Movie {
    id: number;
    description: string;
    votes: { time: string; count: number }[];
    lastUpdated: string;
    position: number;
    title:string;
  }