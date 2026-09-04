import type { ApiListResponse } from '@/types/api.types'

export type HelpMatchStatus = 'pending' | 'accepted' | 'contacting' | 'agreed' | 'completed' | 'rejected' | 'cancelled'
export interface HelpMatchItem {
  id:string; type:string; amount:number|null; description:string|null; status:HelpMatchStatus; contactMethod:string|null; phone:string|null;
  request:{id:string;title:string;status:string;fulfillmentStatus:string|null;urgency:string;location:string|null;category:{id:string;name:string}|null}|null;
  helper:{id:string;name:string;email:string|null;phone:string|null;preferredCity:string|null;availabilityStatus:string|null;capabilities:Array<{id:string;name:string;slug:string}>}|null;
  requestOwner:{id:string;name:string;email:string|null;phone:string|null}|null;
  signals:{preferredCity:string|null;requestLocation:string|null;explicitCategoryWeight:number;behavioralCategoryWeight:number};
  createdAt:string|null; updatedAt:string|null; completedAt:string|null; ageHours:number; isStale:boolean;
}
export interface HelpMatchParams { page?:number; perPage?:number; sort?:string; filter?:{status?:string;type?:string;urgency?:string;search?:string;staleOnly?:boolean} }
export type HelpMatchListResponse = ApiListResponse<HelpMatchItem>
export type HelpMatchDetailResponse = {data:HelpMatchItem}
export interface HelpMonitoringResponse { data:{ range:{from:string;to:string}; kpis:{totalOffers:number;completedOffers:number;completionRate:number;staleOffers:number;averageCompletionHours:number;notificationsSent:number;notificationsRead:number;notificationReadRate:number}; statusCounts:Record<string,number>; notificationBreakdown:Array<{eventType:string;sent:number;read:number;readRate:number}>; series:Array<{day:string;offers:number;notificationsSent:number;notificationsRead:number}> } }
