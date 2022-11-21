import { ApiError } from 'types';

type ConnectApiProps<T> = Omit<RequestInit, 'url' | 'body'> & {
  endpoint: string;
  reqData?: T;
};

export const connectApi = async <T>(props: ConnectApiProps<T>) => {
  try {
    const response = await fetch(`http://localhost:8000/${props.endpoint}`, {
      method: props.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...props.headers,
      },
      body: props.reqData ? JSON.stringify(props.reqData) : undefined,
    });

    const { data, error, message } = await response.json();

    if (!response.ok) {
      throw new ApiError(error?.message ?? message, error?.inputName);
    }

    return data;
  } catch (error) {
    throw error instanceof Error
      ? new ApiError('Cannot connect with api.')
      : error;
  }
};
