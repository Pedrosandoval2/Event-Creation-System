export const decoded = (token: string) => {
    console.log("🚀 ~ decoded ~ token:", token)
    if (!token) {
        return ''
    }
    const [, payload,] = token.split('.');

    // Decodificar la parte payload (base64url a base64)
    const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );
    
    console.log("🚀 ~ decoded ~ decodedPayload:", decodedPayload)

    // Ahora puedes acceder a la información que está dentro del payload
    return decodedPayload;

};
