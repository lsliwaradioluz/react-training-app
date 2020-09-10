import { loader } from "graphql.macro"

export const LOGIN = loader("src/apollo/mutations/login.gql")
export const GET_FAMILIES = loader("src/apollo/queries/getAllFamilies.gql")