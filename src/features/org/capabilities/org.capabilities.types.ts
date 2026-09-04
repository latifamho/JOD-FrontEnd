export interface OrgCapabilityBriefItem {
  id: string
  name: string
  slug: string
}

export type OrgCapabilitiesBriefResponse = { data: OrgCapabilityBriefItem[] }
