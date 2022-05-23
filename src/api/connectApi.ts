import { ApiError } from 'types';

type ConnectApiProps<T> = Omit<RequestInit, 'url' | 'body'> & {
    endpoint: string;
    reqData?: T;
};

export const connectApi = async <T>(props: ConnectApiProps<T>) => {
    try {
        const response = await fetch(
            `http://localhost:8080/${props.endpoint}`,
            {
                method: props.method ?? 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...props.headers,
                },
                body: props.reqData ? JSON.stringify(props.reqData) : undefined,
            },
        );

        const { data, error } = await response.json();

        if (!response.ok) {
            throw new ApiError(error?.message, error.inputName);
        }

        return data;
    } catch (e) {
        if (e instanceof Error) {
            throw new ApiError('Cannot connect with api.');
        } else {
            throw e;
        }
    }
};
