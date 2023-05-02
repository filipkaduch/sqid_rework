import {defineStore} from 'pinia';
import cloneDeep from "lodash/cloneDeep";
import {loadCVEById, loadCVEByIdApache} from "@/api/cve/sparql";
import {cvePropertyTypes, mapCveData, parseCveProperties, RefData} from "@/api/cve/cve";
import {NoteData} from "@/api/cve/cve";
import {malwarePropertyTypes} from "@/api/malwares/malwares";

export interface CvesState {
    cves: {
        [cveId: string]: Cve;
    };
}

export interface Cve {
    id: string
    loading: boolean
    claims: CveClaim[] | null
    terms: any
    [malwarePropertyTypes.HAS_DESCRIPTION]?: string
    [malwarePropertyTypes.WAS_LAST_MODIFIED]?: string
    [malwarePropertyTypes.WAS_CREATED]?: string
    [cvePropertyTypes.NOTES]?: NoteData[]
    [cvePropertyTypes.REFERENCES]?: RefData[]
    [cvePropertyTypes.TITLE]?: string
}

export interface CveClaim {
    object: string
    property: string
    value: string
}

export const defaultCve: Cve = {
    id: '',
    claims: null,
    terms: null,
    loading: false,
    [cvePropertyTypes.NOTES]: [],
    [cvePropertyTypes.REFERENCES]: []
};

export const useCVEStore = defineStore('cveStore', {
    state: (): CvesState => ({
        cves: {}
    }),
    getters: {
        getAllCves: (state) => state.cves
    },
    actions: {
        async updateCveData(cveId: string, local: boolean = false) {
            let properties;
            if (local) {
                properties = await loadCVEById(cveId);
            } else {
                properties = await loadCVEByIdApache(cveId);
            }
            const parsedData = parseCveProperties(properties);
            this.cves[cveId].claims = cloneDeep(parsedData);
            this.cves[cveId].id = cveId;
            this.cves[cveId][cvePropertyTypes.TITLE] = cveId;
            await mapCveData(this.cves[cveId], parsedData);
        }
    }
});
