export interface RecommendationKpis { impressions:number; openRate:number; saveRate:number; helpOffers:number; applications:number; donations:number; fulfilledRequests:number; recommendationToHelpRate:number }
export interface RecommendationFeedbackMetrics { interested:number; interestedRate:number; notInterested:number; notInterestedRate:number; hidePost:number; hidePostRate:number; hidePublisher:number; hidePublisherRate:number }
export interface RecommendationDiversityMetrics { uniquePublishersShown:number; uniqueCategoriesShown:number; topPublisherImpressionShare:number; topCategoryImpressionShare:number }
export interface RecommendationSeriesRow { day:string; impressions:number; opens:number; help_actions:number }
export interface RecommendationAnalyticsResponse { data:{ range:{from:string;to:string}; kpis:RecommendationKpis; feedback:RecommendationFeedbackMetrics; diversity:RecommendationDiversityMetrics; series:RecommendationSeriesRow[] } }
