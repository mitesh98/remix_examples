export type SearchCallBack = (searchText:string) => any
export interface User {
    "id": string ,
    "createdAt" : string|number,
    "updatedAt": string|number,
    "username" :string,
    "passwordHash":string
}
export interface Jokes{
    id: string, name: string,content:string 
}
export const DEFAULT_PAGE_SIZE=2
export const DEFAULT_JOKES_PAGE_SIZE=10
export enum fieldsEnum{
    PAGE="page",
    PAGE_SIZE="pageSize",
    USER_ID="userId",
    SEARCH_TEXT="searchText"
}
export enum APIEnum{
    LIST_USERS='/api/getUsers',
    LIST_JOKES='/api/getJokes'
}
