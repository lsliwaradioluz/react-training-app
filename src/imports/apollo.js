import { loader } from "graphql.macro"

// Queries
export const GET_FAMILIES = loader("src/apollo/queries/getAllFamilies.gql")
export const GET_USERS = loader("src/apollo/queries/getAllUsers.gql")
export const GET_EXERCISE = loader("src/apollo/queries/getSingleExercise.gql")
export const GET_FAMILY = loader("src/apollo/queries/getSingleFamily.gql")
export const GET_USER = loader("src/apollo/queries/getSingleUser.gql")
export const GET_USER_BY_EMAIL = loader("src/apollo/queries/getSingleUserByEmail.gql")
export const GET_WORKOUT = loader("src/apollo/queries/getSingleWorkout.gql")

// Mutations
export const LOGIN = loader("src/apollo/mutations/login.gql")
export const REGISTER = loader("src/apollo/mutations/register.gql")
export const CREATE_EXERCISE = loader("src/apollo/mutations/createExercise.gql")
export const CREATE_FAMILY = loader("src/apollo/mutations/createFamily.gql")
export const CREATE_USER = loader("src/apollo/mutations/createUser.gql")
export const CREATE_WORKOUT = loader("src/apollo/mutations/createWorkout.gql")
export const DELETE_EXERCISE = loader("src/apollo/mutations/deleteExercise.gql")
export const DELETE_FAMILY = loader("src/apollo/mutations/deleteFamily.gql")
export const DELETE_USER = loader("src/apollo/mutations/deleteUser.gql")
export const DELETE_WORKOUT = loader("src/apollo/mutations/deleteWorkout.gql")
export const UPDATE_EXERCISE = loader("src/apollo/mutations/updateExercise.gql")
export const UPDATE_FAMILY = loader("src/apollo/mutations/updateFamily.gql")
export const UPDATE_USER = loader("src/apollo/mutations/updateUser.gql")
export const UPDATE_WORKOUT = loader("src/apollo/mutations/updateWorkout.gql")