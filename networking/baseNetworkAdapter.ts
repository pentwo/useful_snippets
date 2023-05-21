import { AxiosResponse } from "axios";
import axios from "axios";

export type ResponseData = {
    success: boolean;
    message?: string[] | string;
    data?: IResponseDataData;
    error?: any;
    expired?: boolean;
};

interface IResponseDataData {
    data: any | any[];
    pagination?: IPagination;
}
export interface IPagination {
    page: number;
    per_page: number;
    to: number;
    from: number;
    last_page: number;
    total: number;
}
// ==========================================
// Base Network Adapter
//
// Handles all network requests
// ==========================================

abstract class BaseAdapter {
    static BASE_URL = import.meta.env.VITE_API_URL || "http://localhost";

    static METHODS = {
        GET: "GET",
        POST: "POST",
        DELETE: "DELETE",
        PUT: "PUT",
    };

    url: string;
    method: string;
    params: any[];
    data: any;

    constructor(url: string, method: string, params: any[]) {
        this.url = url;
        this.method = method;
        this.params = params;
    }

    getRoute() {
        let route = this.url;

        for (let i = 0; i < this.params.length; i++) {
            route = route.replace("{{" + (i + 1) + "}}", this.params[i].toString());
        }

        return route;
    }

    serialize(obj: object) {
        let str: string[] = [];

        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                // @ts-ignore
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }

        return str.join("&");
    }

    async fetch(): Promise<ResponseData> {
        try {
            let token = localStorage.getItem("token");

            let headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.replace(/['"]+/g, "")}`,
            };

            let callRoute = this.getRoute();
            let requestBody = JSON.stringify(this.data);

            // Axios Call
            let axiosCall = axios.create({
                baseURL: BaseAdapter.BASE_URL,
                responseType: "json",
                // withCredentials: true,
                headers: headers,
            });

            switch (this.method) {
                case BaseAdapter.METHODS.GET:
                    // GET REQUEST

                    return axiosCall
                        .get(callRoute)
                        .then((response: AxiosResponse<any>) => {
                            if (response.status === 200) {
                                return {
                                    success: response.data.success,
                                    message: response.data.message,
                                    data: response.data.payload,
                                };
                            }

                            return {
                                success: false,
                            };
                        })
                        .catch((error: any) => {
                            let responseCode = error.response?.status;
                            let responseData = error.response?.data;

                            if (responseCode === 401) {
                                return {
                                    success: false,
                                    login: false,
                                };
                            }

                            return {
                                success: false,
                                message: responseData?.errors ?? "Unknown error",
                            };
                        });
                case BaseAdapter.METHODS.POST:
                    // POST REQUEST

                    return axiosCall
                        .post(callRoute, requestBody)
                        .then((response: AxiosResponse<any>) => {
                            if (response.status === 200 || response.status === 201) {
                                return {
                                    success: response.data.success,
                                    message: response.data.message,
                                    data: response.data.payload,
                                };
                            }

                            return {
                                success: false,
                            };
                        })
                        .catch((error: any) => {
                            let responseCode = error.response?.status;
                            let responseData = error.response?.data;

                            return {
                                success: false,
                                message: responseData?.errors ?? "Unknown error",
                            };
                        });
                // case BaseAdapter.METHODS.PATCH:
                case BaseAdapter.METHODS.PUT:
                    // PUT REQUEST

                    return axiosCall
                        .put(callRoute, requestBody)
                        .then((response: AxiosResponse<any>) => {
                            if (response.status === 200) {
                                return {
                                    success: true,
                                    data: response.data,
                                };
                            }

                            return {
                                success: false,
                            };
                        })
                        .catch((error: any) => {
                            let responseCode = error.response?.status;
                            let responseData = error.response?.data;

                            return {
                                success: false,
                                message: responseData?.errors ?? "Unknown error",
                            };
                        });
                case BaseAdapter.METHODS.DELETE:
                    // DELETE REQUEST

                    return axiosCall
                        .delete(callRoute)
                        .then((response: AxiosResponse<any>) => {
                            if (response.status === 200) {
                                return {
                                    success: true,
                                    data: response.data,
                                };
                            }

                            return {
                                success: false,
                            };
                        })
                        .catch((error: any) => {
                            let responseData = error.response?.data;

                            return {
                                success: false,
                                message: responseData?.errors ?? "Unknown error",
                            };
                        });
                default:
                    return {
                        success: false,
                    };
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
            };
        }
    }
}

export default BaseAdapter;
