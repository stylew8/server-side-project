import { apiAuth } from "../api";

export const checkAuth = async () => {
    const token = localStorage.getItem("jwt");

    if(!token)
        return false;


    try {
        var response = await apiAuth("/auth/verify-token");

        var {role} = await response.json();

        if(response.ok){
            return {auth: true, role: role};
        }
        else{
            localStorage.removeItem("jwt");
            return {auth: false, role: role};
        }
        
    } catch (error) {
        console.error("Authentication error:", error);
    }
  };
  