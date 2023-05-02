import {extractId, malwarePropertyTypes} from "@/api/malwares/malwares";
import {Cve, CveClaim} from "@/modules/cves/store/cveStore";
import {loadCVEById, loadCVEByIdApache} from "@/api/cve/sparql";
import {DataSourceType} from "@/modules/queries/store/queriesStore";
import {NoteData, RefData} from "@/api/cve/types";

export const cveLocalEndpoints = [
    'http://localhost:8080/database/cve_gen/CVE-2000-owl.owl',
    'http://localhost:8080/database/cve_gen/OVAL_ios.owl'
    /* 'http://localhost:8080/database/cve/cve_generate_data_1999.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2000.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2001.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2002.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2003.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2004.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2005.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2006.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2007.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2008.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2009.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2010.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2011.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2012.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2013.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2014.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2015.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2016.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2017.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2018.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2019.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2020.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2021.rdf' */
];

export const cveEndpointsSources = [
    {type: 'file', value: cveLocalEndpoints[0], name: 'CVE - 2000'},
    {type: 'file', value: cveLocalEndpoints[1], name: 'OVAL - iOS'}
];

export enum CVEProperties {
    DESCRIPTION = 'Description',
    TITLE = 'Title',
    VALUE = 'Value',
    URL = 'Url',
    TYPE = 'Type'
}

export const context = {
    sources: cveEndpointsSources,
    '@context': {
        sources: {
            '@id': 'urn:sources',
            '@type': '@id'
        }
    }
};

export const extractCVEId = (str: string) => {
    let index = str.indexOf("_");
    return str.substring(0, index);
};

const trimQuotes = (str: string) => {
    if (str.startsWith('"') && str.endsWith('"')) {
        return str.slice(1, -1);
    }
    return str;
};

export const parseCveProperties = (properties: any) => {
    return properties.map((property: any) => ({
        property: extractId(property.property.type, '/'),
        value: extractId(property.value.value, '/')
    }));
};

export const getCveEntityType = (predicate: string) => {
    let entityType = null;
    if (predicate.includes('#')) {
        entityType = extractId(predicate);
    } else {
        entityType = extractId(predicate, '/');
    }
    return entityType;
};

export const getRefDataForCveProperty = async(cveId: string, local: boolean = false): Promise<RefData> => {
    const refData = local ? await loadCVEById(cveId) : await loadCVEByIdApache(cveId);
    const refObject = {} as RefData;
    // @ts-ignore
    for (const data of refData) {
        if (local) {
            const refType = getCveEntityType(data?.predicate);
            refObject.id = extractId(data?.subject, '/');
            refObject.source = DataSourceType.CVE_DOMAIN;
            switch (refType) {
                case CVEProperties.DESCRIPTION:
                    refObject.description = trimQuotes(data.object);
                    break;
                case CVEProperties.URL:
                    if (!refObject?.url) {
                        refObject.url = [];
                    }
                    refObject?.url?.push(trimQuotes(data.object));
                    break;
                default:
                    break;
            }
        } else {
            const refType = getCveEntityType(data?.property.value);
            refObject.id = extractId(data?.subject, '/');
            refObject.source = DataSourceType.CVE_DOMAIN;
            switch (refType) {
                case CVEProperties.DESCRIPTION:
                    refObject.description = data.value.value;
                    break;
                case CVEProperties.URL:
                    if (!refObject?.url) {
                        refObject.url = [];
                    }
                    refObject?.url?.push(data.value.value);
                    break;
                default:
                    break;
            }
        }
    }
    return refObject;
};

export const getDataForCveProperty = async(cveId: string, local: boolean = false): Promise<NoteData> => {
    const noteData = local ? await loadCVEById(cveId) : await loadCVEByIdApache(cveId);
    const noteObject = {} as NoteData;
    // @ts-ignore
    for (const data of noteData) {
        if (local) {
            const noteType = getCveEntityType(data?.predicate);
            switch (noteType) {
                case CVEProperties.TYPE:
                    noteObject.type = trimQuotes(data.object);
                    break;
                case CVEProperties.VALUE:
                    noteObject.value = trimQuotes(data.object);
                    break;
                case CVEProperties.TITLE:
                    noteObject.title = trimQuotes(data.object);
                    break;
                default:
                    break;
            }
        } else {
            const noteType = getCveEntityType(data?.property.value);
            switch (noteType) {
                case CVEProperties.TYPE:
                    noteObject.type = data?.value.value;
                    break;
                case CVEProperties.VALUE:
                    noteObject.value = data?.value.value;
                    break;
                case CVEProperties.TITLE:
                    noteObject.title = data?.value.value;
                    break;
                default:
                    break;
            }
        }
    }
    return noteObject;
};

export enum cvePropertyTypes {
    HAS_NOTE = 'has_note',
    NOTE = 'Note',
    REF = 'Ref',
    MAPPED_NOTES = 'mappedNotes',
    MAPPED_REFERENCES = 'mappedReferences',
    HAS_REFERENCE = 'has_reference',
    NOTES = 'notes',
    MODIFIED = 'Modified',
    PUBLISHED = 'Published',
    DESCRIPTION = 'Description',
    REFERENCES = 'references',
    TITLE = 'Title'
}

export const mapCveData = async(cve: Cve, claims: CveClaim[], local: boolean = false) => {
    for (const claim of claims) {
        if (local) {
            switch (claim.property) {
                case cvePropertyTypes.HAS_NOTE:
                    const noteObject = await getDataForCveProperty(claim.value);
                    cve[cvePropertyTypes.NOTES]?.push(noteObject);
                    break;
                case cvePropertyTypes.HAS_REFERENCE:
                    const refObject = await getRefDataForCveProperty(claim.value);
                    cve[cvePropertyTypes.REFERENCES]?.push(refObject);
                    break;
                default:
                    break;
            }
        } else {
            if (claim.value.includes(cvePropertyTypes.NOTE)) {
                const noteObject = await getDataForCveProperty(claim.value);
                cve[cvePropertyTypes.NOTES]?.push(noteObject);
            } else if (claim.value.includes(cvePropertyTypes.REF)) {
                const refObject = await getRefDataForCveProperty(claim.value);
                cve[cvePropertyTypes.REFERENCES]?.push(refObject);
            }
        }
    }
    if (cve[cvePropertyTypes.NOTES]) {
        // @ts-ignore
        for (const note of cve[cvePropertyTypes.NOTES]) {
            if (note.title === cvePropertyTypes.PUBLISHED) {
                cve[malwarePropertyTypes.WAS_CREATED] = note.value;
            } else if (note.title === cvePropertyTypes.MODIFIED) {
                cve[malwarePropertyTypes.WAS_LAST_MODIFIED] = note.value;
            } else if (note.type === cvePropertyTypes.DESCRIPTION) {
                cve[malwarePropertyTypes.HAS_DESCRIPTION] = note.value;
            }
        }
    }
};
