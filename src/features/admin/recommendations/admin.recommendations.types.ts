export interface RecommendationKpis { impressions:number; openRate:number; saveRate:number; helpOffers:number; applications:number; donations:number; fulfilledRequests:number; recommendationToHelpRate:number }
export interface RecommendationFeedbackMetrics { interested:number; interestedRate:number; notInterested:number; notInterestedRate:number; hidePost:number; hidePostRate:number; hidePublisher:number; hidePublisherRate:number }
export interface RecommendationDiversityMetrics { uniquePublishersShown:number; uniqueCategoriesShown:number; topPublisherImpressionShare:number; topCategoryImpressionShare:number }
export interface RecommendationSeriesRow { day:string; impressions:number; opens:number; help_actions:number }
export interface RecommendationAnalyticsResponse { data:{ range:{from:string;to:string}; kpis:RecommendationKpis; feedback:RecommendationFeedbackMetrics; diversity:RecommendationDiversityMetrics; series:RecommendationSeriesRow[] } }

export interface RecommendationSettings {
  weights: Record<string, number>
  candidateLimit: number
  popularityCap: number
  explorationRatio: number
  activeWeightKeys: string[]
  updatedAt: string | null
}
export interface RecommendationSettingsResponse { data: RecommendationSettings; message?: string }
export interface RecommendationSettingsUpdateRequest {
  weights?: Record<string, number>
  candidateLimit?: number
  popularityCap?: number
  explorationRatio?: number
}

export interface RecommendationInspectorResult {
  user: { id:string; name:string; intent:string|null; preferredCity:string|null }
  post: { id:string; title:string; type:string; status:string; category:{id:string;name:string}|null; publisher:{type:string;id:string;name:string}; location:string|null; urgency:string }
  eligible: boolean
  exclusions: string[]
  score: number
  components: Record<string, number>
  reasons: string[]
  source: 'exploration' | 'for_you'
  isExploration: boolean
  feedbackRequested: boolean
  signals: { followsAuthor:boolean; followsOrganization:boolean; explicitCategoryWeight:number; behavioralCategoryWeight:number; viewsLast30Days:number; publisherHidden:boolean }
}
export interface RecommendationInspectorResponse { data: RecommendationInspectorResult }
