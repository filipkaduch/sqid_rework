import {Entity} from "./entityStore";
import {EntityId, EntitySiteLink, WBDatatype} from "../../../api/wikidata/types";
export {EntityId, EntitySiteLink, WBDatatype}

export interface EntityState {
    id: string
    loading: boolean
    entity: Entity
    claims: any
    reverseClaims: any
    groupedClaims: any
    groupedReverseClaims: any
    propertyUsage: any
    hierarchyStatistics: any
    timestamps: Map<EntityId, Date>
    sitelinks: Map<EntityId, Map<string, EntitySiteLink>>
    datatypes: { [key: string]: WBDatatype }
}