import {Claim} from "../../../../api/wikidata/types";

export type EntityId = string;
export type ClaimsMap = Map<EntityId, Claim[]>;

export interface ClaimsState {
  claims: Map<EntityId, ClaimsMap>
};
