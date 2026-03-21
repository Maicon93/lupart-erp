export interface IApiResponse<T = unknown> {
    type: 'success' | 'error' | 'info' | 'warning';
    messageCode?: string;
    data?: T;
}
