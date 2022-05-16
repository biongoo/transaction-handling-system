export const getData = async (url: string) => {
    try {
        const response = await fetch(`http://localhost:8080/${url}`);

        const { data, error } = await response.json();

        if (!response.ok || error) {
            throw error;
        }

        return data;
    } catch (e) {
        if (typeof e === 'string') {
            throw new Error(e);
        } else if (e instanceof Error) {
            throw new Error('Error while fetching.');
        }
    }
}