import {EntityId} from "../../../api/wikidata/types";
import {i18n} from "../../../plugins/all";
import {useTermsStore} from "./terms/termsStore";

export const idsFromExamples = async(getExample: (entityId: EntityId, lang: string)=> Promise<Array<{entityId: EntityId, label: string}>>,
                               entityId: EntityId): Promise<EntityId[]> => {
    const lang = i18n.global.locale;
    const result = await getExample(entityId, lang);
    const labels = new Map<string, Map<EntityId, string>>();
    const langLabels = new Map<EntityId, string>();

    for (const { entityId: id, label } of result) {
        langLabels.set(id, label);
    }

    labels.set(lang, langLabels);
    useTermsStore().labelsLoaded(labels);
    console.log(result);
    return result.map((entity) => entity.entityId);
}