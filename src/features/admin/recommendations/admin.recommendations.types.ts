export interface RecommendationKpis { impressions:number; openRate:number; saveRate:number; helpOffers:number; applications:number; donations:number; fulfilledRequests:number; recommendationToHelpRate:number }
export interface RecommendationSeriesRow { day:string; impressions:number; opens:number; help_actions:number }
export interface RecommendationAnalyticsResponse { data:{ range:{from:string;to:string}; kpis:RecommendationKpis; series:RecommendationSeriesRow[] } }
