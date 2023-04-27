import {CveResult} from "./types";
import {axiosGet} from "@/util/axiosServiceHandler";

export const cveSparqlRequest = async(endpoint: string, query: string): Promise<CveResult> => {
    const response = await axiosGet(endpoint, {
        params: {
            format: 'json',
            query,
        },
    });

    return response.data;
}
