import { ApiError } from 'types';

export const postData = async <T extends Object>(url: string, reqData: T) => {
    try {
        const response = await fetch(`http://localhost:8080/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
        });

        const { data, error } = await response.json();

        if (error?.message) {
            throw new ApiError(error.message, error.inputName);
        }

        return data;
    } catch (e: any) {
        if (e instanceof Error) {
            throw new ApiError('Cannot connect with api.');
        } else {
            throw e;
        }
    }
};
