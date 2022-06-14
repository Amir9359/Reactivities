export interface User {
    username : string;
    displayName : string;
    token : string;
    image ?: string;
}

export interface UserFormValue {
    email : string;
    password : string;
    username ?: string;
    displayName ?: string;
}