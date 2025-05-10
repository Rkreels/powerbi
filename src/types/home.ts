
export type RecommendedItemType = "tutorial" | "report";
export type RecentItemType = "report" | "dashboard";

export interface RecommendedItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: RecommendedItemType;
}

export interface RecentItem {
  id: string;
  title: string;
  lastModified: string;
  owner: string;
  type: RecentItemType;
}
