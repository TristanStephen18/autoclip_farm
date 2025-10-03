import { useState } from "react"

export const useLogInHooks = () => {
    const [isLoggingIn, setIsloggingIn] = useState(false);

    const login= (data: any)=> {
        setIsloggingIn(true);

        //once database has been settled handle login function here
        console.log("Login Data:", data.email);
        setIsloggingIn(false);
    }

    return {
        isLoggingIn,
        login
    }
}