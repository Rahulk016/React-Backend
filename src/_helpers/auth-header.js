export function authHeader(isImage) {
    // Return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('userDetails'));

    if (user && user.token) {
     
        if (isImage != null && isImage) {
            return {
                'Authorization': 'Bearer ' + user.token
            };
        } else {
            return {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            };
        }
    } else {
        return {};
    }

}