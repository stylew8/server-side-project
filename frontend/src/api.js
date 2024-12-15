export const apiNoAuth = async (endpoint, method = "GET", data = null) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:7097";

    // Заголовки
    const headers = {
        "Content-Type": "application/json",
    };

    let body = null;

    if (data) {
        if (method !== "GET") {
            body = JSON.stringify(data);
        } else {
            const params = new URLSearchParams(data);
            endpoint = `${endpoint}?${params.toString()}`;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body,
        });

        return response;
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
};

export const apiAuth = async (endpoint, method = "GET", data = null) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:7097";

    const headers = {
        "Content-Type": "application/json",
    };

    const token = localStorage.getItem("jwt");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let body = null;

    if (data) {
        if (method !== "GET") {
            body = JSON.stringify(data);
            console.log("1");
        } else {
            const params = new URLSearchParams(data);
            endpoint = `${endpoint}?${params.toString()}`;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body,
        });

        return response;
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
};
