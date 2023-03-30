import {axiosGet} from "@/util/axiosServiceHandler";
import { ApiResult, SparqlResult } from './types'
import http from "@/plugins/http";

export async function apiRequest(endpoint: string, query: any): Promise<ApiResult> {
  const response = await axiosGet(endpoint, {
    params: {
      format: 'json',
      origin: '*',
      ...query,
    },
  }) as ApiResult;
  return response;
}

export async function sparqlRequest(endpoint: string, query: string): Promise<SparqlResult> {
  const response = await http.get(endpoint, {
    params: {
      format: 'json',
      query,
    },
  });
  return response.data;
}
