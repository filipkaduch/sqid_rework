import {EntityId} from "../../../api/wikidata/types";

export interface ClassStatistics {
  directInstances: number,
  directSubclasses: number,
  allInstances: number,
  allSubclasses: number,
  superClasses: EntityId[],
  nonemptySubClasses: EntityId[],
  relatedProperties: EntityId[],
}

export interface ClassesState {
  hierarchy: Map<EntityId, ClassStatistics>,
  hierarchyRefreshed: Date,
  cachedHierarchyRefreshVariable: number,
}
