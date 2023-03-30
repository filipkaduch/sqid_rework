import {defineStore} from 'pinia';
import {cloneDeep} from "lodash";
import {ClaimsState} from "./types";
import {getStatementQualifiers, getStatementValue} from "./utils";
import {ClaimsMap, EntityId} from "./types";
import {i18n} from "@/plugins/all";
import {getEntityData, wikidataUrl} from "@/api/wikidata/wikidata";
import {wikifyLink} from "@/api/wikidata/sqid";
import {Claim} from "@/api/wikidata/types";
export interface ClaimsStoreState {
    entities: {
        [entityId: EntityId]: ClaimsState;
    };
}
export const useClaimsStore = defineStore('claimsStore', {
    /* state: (): ClaimsState => ({
        claims: new Map<string, ClaimsMap>()
    }), */
    state: (): ClaimsStoreState => ({
        entities: {}
    }),
    getters: {
        getClaimsGetter: (state) => (entityId: EntityId, queryEntityId: EntityId) => state.entities[queryEntityId].claims.get(entityId),
        getClaimsForProperty: (state) => (entityId: EntityId, propertyId: EntityId, queryEntityId: EntityId) => {
            console.log('SHoW: ', state.entities[queryEntityId]);
            const claims = state.entities[queryEntityId]?.claims?.get(entityId);

            if (claims === undefined) {
                return undefined;
            }

            return claims.get(propertyId);
        },
        hasClaims: (state) => (entityId: EntityId, queryEntityId: EntityId) => state.entities[queryEntityId]?.claims?.has(entityId) ?? false,
        getValuesForProperty() {
            return (entityId: EntityId, propertyId: EntityId, queryEntityId: EntityId) => {
                const result = [];
                const claims = this.getClaimsForProperty(entityId, propertyId, queryEntityId);

                if (claims !== undefined) {
                    for (const claim of claims) {
                        result.push({
                            value: getStatementValue(claim),
                            qualifiers: getStatementQualifiers(claim),
                            id: claim.id
                        });
                    }
                }

                return result;
            }
        },
        getBestValueForProperty() {
            return (entityId: EntityId, propertyId: EntityId, queryEntityId: EntityId) => {
                let result = null;

                const claims = this.getClaimsForProperty(entityId, propertyId, queryEntityId);

                if (claims !== undefined) {
                    for (const claim of claims) {
                        if (claim.rank === 'preferred') {
                            result = getStatementValue(claim);
                            break;
                        } else if (result === null && claim.rank !== 'deprecated') {
                            result = getStatementValue(claim);
                        }
                    }
                }

                return result;
            }
        },
        getImages() {
            return (entityId: EntityId, queryEntityId: EntityId) => {
                const result = [];
                const images = this.getValuesForProperty(entityId, 'P18', queryEntityId);
                if (images !== undefined) {
                    for (const {value: image} of images) {
                        result.push(wikifyLink(image));
                    }
                }

                return result;
            }
        },
        getBanner() {return (entityId: EntityId, queryEntityId: EntityId) => wikifyLink(this.getBestValueForProperty(entityId, 'P948', queryEntityId))},
        getHomepage() {return (entityId: EntityId, queryEntityId: EntityId) => this.getBestValueForProperty(entityId, 'P856', queryEntityId)},
        getWikidataUrl: () => (entityId: EntityId) => wikidataUrl(entityId),
        getReasonatorUrl: () => (entityId: EntityId) => {
            return `https://tools.wmflabs.org/reasonator/?q=${entityId}${i18n.global.locale}`
        }
    },
    actions: {
        checkClaimsStore(queryEntityId: EntityId) {
          if (!this.entities[queryEntityId]) {
              this.entities[queryEntityId] = {
                  claims: new Map<string, ClaimsMap>()
              };
          }
        },
        claimsLoaded(claims: Map<EntityId, ClaimsMap>, queryEntityId: EntityId) {
            this.checkClaimsStore(queryEntityId);
            for (const [entityId, claimsMap] of claims) {
                let theClaims = this.entities[queryEntityId].claims.get(entityId)

                if (theClaims === undefined) {
                    theClaims = new Map<EntityId, Claim[]>()
                }

                for (const [propertyId, claim] of claimsMap) {
                    theClaims.set(propertyId, claim)
                }

                this.entities[queryEntityId].claims.set(entityId, theClaims);
            }
        },
        async getClaims(entityId: string, queryEntityId: EntityId) {
            this.checkClaimsStore(queryEntityId);
            if (this.hasClaims(entityId, queryEntityId)) {
                return this.getClaimsGetter(entityId, queryEntityId);
            }

            const entityData = await getEntityData(entityId, i18n.global.locale, true, queryEntityId);
            this.claimsLoaded({
                // @ts-ignore
                claims: entityData.claims
            }, queryEntityId);
            return this.getClaimsGetter(entityId, queryEntityId);
        }
    }
});


