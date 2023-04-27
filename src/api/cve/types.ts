import {DataSourceType} from "@/modules/queries/store/queriesStore";

export interface SearchedCveObject {
    value: string
    entity: string
    predicate: string
}

export interface NoteData {
    type: string
    value: string
    title: string
    id: string
}

export interface RefData {
    type?: string
    value?: string
    title?: string
    url?: string[]
    description?: string
    source?: DataSourceType
    id?: string
}

export interface CveResult {

}
