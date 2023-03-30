import {i18n} from "../../../../plugins/all";
import {EntityId, LangCode, MultilingualInflightMap, MultilingualTermsMap} from "./types";

type TermsMap = Map<string, string>
type Terms = Map<string, TermsMap>

export const termsMap = (terms: Terms,
                  lang?: string): TermsMap => {
    const langCode = lang || i18n.global.locale;
    const langTerms = terms?.get(langCode);

    if (langTerms !== undefined) {
        return langTerms;
    }

    return fallbackTermsMap(terms);
};

export const fallbackTermsMap = (terms: Terms): TermsMap => {
    const lang = i18n.global.fallbackLocale.toString();
    console.log('TERMS: ', terms);
    if (!terms?.has(lang)) {
        terms?.set(lang, new Map<string, string>());
    }

    return terms?.get(lang)!;
};

export const getTerm = (terms: Terms, entityId: string, lang?: string, fallback: boolean = true) => {
    const nativeTerms = termsMap(terms, lang);
    const nativeTerm = nativeTerms.get(entityId);

    if (!fallback || nativeTerm !== undefined) {
        return nativeTerm;
    }

    return fallbackTermsMap(terms).get(entityId);
};

export const hasTerm = (terms: Terms, entityId: string, lang?: string, fallback: boolean = true) => {
    const nativeTerms = termsMap(terms, lang);
    const fallbackTerms = fallbackTermsMap(terms);

    if (nativeTerms !== undefined) {
        const hasNativeTerm = nativeTerms.has(entityId);

        if (!fallback) {
            return hasNativeTerm;
        }
    } else if (!fallback) {
        return false;
    }

    return fallbackTerms?.has(entityId) ?? false;
};

export const getPromise = (inflight: any, entityId: string, lang?: string, fallback: boolean = true) => {
    const langCode = lang || i18n.global.locale;
    const nativeInflight = inflight.get(langCode);

    if (nativeInflight !== undefined) {
        if (nativeInflight.has(entityId)) {
            return nativeInflight.get(entityId)!;
        }

        if (fallback) {
            const fallbackInflight = inflight.get(i18n.global.fallbackLocale);

            if (fallbackInflight !== undefined) {
                return fallbackInflight.get(entityId);
            }
        }
    }
};

export const hasPromise = (inflight: any, entityId: string, lang?: string, fallback: boolean = true) => {
    const langCode = lang || i18n.global.locale;
    const nativeInflight = inflight.get(langCode);

    if (nativeInflight !== undefined) {
        if (nativeInflight.has(entityId)) {
            return true;
        }

        if (fallback) {
            const fallbackInflight = inflight.get(i18n.global.fallbackLocale);

            if (fallbackInflight !== undefined) {
                return fallbackInflight.has(entityId);
            }
        }
    }

    return false;
};

export const mergeTerms = (currentTerms: MultilingualTermsMap,
                    loadedTerms: MultilingualTermsMap) => {
    for (const [langCode, termsMap] of loadedTerms) {
        let theTerms = currentTerms.get(langCode);

        if (theTerms === undefined) {
            theTerms = new Map<string, string>();
        }

        for (const [entityId, term] of termsMap) {
            theTerms.set(entityId, term);
        }

        currentTerms.set(langCode, theTerms);
    }

    return currentTerms;
};

export const addInflight = (currentInflight: MultilingualInflightMap,
                     entities: EntityId[],
                     lang: LangCode,
                     promise: Promise<string>) => {
    const langCode = lang || i18n.global.locale;
    let inflight = currentInflight.get(langCode);

    if (inflight === undefined) {
        inflight = new Map<EntityId, Promise<string>>();
    }

    for (const entityId of entities) {
        inflight.set(entityId, promise);
    }

    currentInflight.set(langCode, inflight);

    return currentInflight;
};

export const clearInflight = (currentInflight: MultilingualInflightMap,
                       terms: MultilingualTermsMap) => {
    for (const [langCode, theTerms] of terms) {
        const inflight = currentInflight.get(langCode);

        if (inflight !== undefined) {
            for (const entityId of theTerms.keys()) {
                inflight.delete(entityId);
            }

            currentInflight.set(langCode, inflight);
        }
    }

    return currentInflight;
};
