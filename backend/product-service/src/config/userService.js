const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:5000"

export const getUserById = async (userId, authorization) => {
    if(!userId || !authorization){
        return null
    }

    try {
        const response = await fetch(`${userServiceUrl}/api/user/profile/${userId}`, {
            headers: {
                Authorization: authorization
            },
            signal: AbortSignal.timeout(3000)
        })

        if(!response.ok){
            return null
        }

        const data = await response.json()
        return data.user || null
    } catch (error) {
        console.log("User service request failed", error.message)
        return null
    }
}