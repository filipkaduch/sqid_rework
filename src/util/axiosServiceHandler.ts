import type {AxiosError, AxiosResponse} from 'axios';
// eslint-disable-next-line no-duplicate-imports
import axios from 'axios';
const devMode = true;

const handleError = (error: unknown): never => {
    if (error instanceof Error) {
        if (isAxiosError(error)) {
            if (error.response) {
                if (devMode) {
                    console.error(error.response.data);
                    console.error(error.response.status);
                    console.error(error.response.headers);
                }
                throw error;
            } else if (error.request) {
                // The request was made but no response was received
                if (devMode) {
                    console.error(error.request);
                }
                throw new Error(error as any);
            }
        } else {
            // Something happened in setting up the request that triggered an Error
            if (devMode) {
                console.error('Error', error.message);
            }
            throw new Error(error.message);
        }
    }
    throw new Error(error as any);
};

const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;
export const isAxiosError = (value: any): value is AxiosError => typeof value?.response === 'object';
export const axiosPost = (url: string, params: object = {}): Promise<AxiosResponse> => axios.post(url, params)
    .then(handleResponse)
    .catch(handleError);

export const axiosGet = (url: string, params: object = {}): Promise<AxiosResponse> => axios.get(url, params)
    .then(handleResponse)
    .catch(handleError);

export const axiosUpdate = (url: string, params: object): Promise<AxiosResponse> => axios.put(url, params)
    .then(handleResponse)
    .catch(handleError);

export const axiosDelete = (url: string): Promise<void> => axios.delete(url)
    .then(handleResponse)
    .catch(handleError);
