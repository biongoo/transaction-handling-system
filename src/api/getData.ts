import { ApiError } from 'types';

export const getData = async (url: string) => {
    try {
        const response = await fetch(`http://localhost:8080/${url}`);

        const { data, error } = await response.json();

        if (error.message) {
            console.log(error);
            throw new ApiError(error.message, error.inputName);
        }

        return data;
    } catch (e) {
        if (e instanceof Error) {
            throw new ApiError('Cannot connect with api.');
        } else {
            throw e;
        }
    }
}