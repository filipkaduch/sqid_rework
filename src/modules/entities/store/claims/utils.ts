import {Claim, Snak, EntityId} from "@/api/wikidata/types";

export const getStatementValue = (claim: Claim) => {
    if (claim.mainsnak.snaktype === 'value') {
        return (claim.mainsnak.datavalue as any).value;
    }
};

export const getStatementQualifiers = (claim: Claim) => {
    const qualifiers = new Map<EntityId, Snak[]>();

    if (!claim.qualifiers) {
        return qualifiers;
    }

    const order = claim['qualifiers-order'] || Object.keys(claim.qualifiers);

    for (const propId of order) {
        qualifiers.set(propId, claim.qualifiers[propId]);
    }

    return qualifiers;
};