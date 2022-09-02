import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AddOn = {
  __typename?: 'AddOn';
  type: Scalars['String'];
  value: Scalars['Float'];
};

export type AddOnInput = {
  type: Scalars['String'];
  value: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addService: Scalars['Boolean'];
};


export type MutationAddServiceArgs = {
  input: ServicesInput;
};

export type Query = {
  __typename?: 'Query';
  getAllService: Array<Services>;
  testQuery: Scalars['Boolean'];
};

export type Services = {
  __typename?: 'Services';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  createdAt: Scalars['DateTime'];
  deliveryDays: Scalars['Float'];
  deliveryFormat: Scalars['String'];
  description: Scalars['String'];
  estimatedTime: Scalars['Float'];
  fileFormat: Scalars['String'];
  for: Scalars['String'];
  inputLimit: Scalars['Float'];
  maxDuration: Scalars['Float'];
  mixProcessingDelays: Scalars['String'];
  mixProcessingOtherFx: Scalars['String'];
  mixProcessingReverbs: Scalars['String'];
  mixVocalTuning: Scalars['String'];
  numberOfReferenceFileUploads: Scalars['Float'];
  price: Scalars['Float'];
  revisionsDelivery: Scalars['Float'];
  serviceCategory: Scalars['String'];
  serviceName: Scalars['String'];
  setOfRevisions: Scalars['Float'];
  subService: Scalars['String'];
  subSubService: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ServicesInput = {
  addOn: Array<AddOnInput>;
  deliveryDays: Scalars['Float'];
  deliveryFormat: Scalars['String'];
  description: Scalars['String'];
  estimatedTime: Scalars['Float'];
  fileFormat: Scalars['String'];
  for: Scalars['String'];
  inputLimit: Scalars['Float'];
  maxDuration: Scalars['Float'];
  mixProcessingDelays: Scalars['String'];
  mixProcessingOtherFx: Scalars['String'];
  mixProcessingReverbs: Scalars['String'];
  mixVocalTuning: Scalars['String'];
  numberOfReferenceFileUploads: Scalars['Float'];
  price: Scalars['Float'];
  revisionsDelivery: Scalars['Float'];
  serviceCategory: Scalars['String'];
  serviceName: Scalars['String'];
  setOfRevisions: Scalars['Float'];
  subService: Scalars['String'];
  subSubService: Scalars['String'];
};

export type GetAllServiceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllServiceQuery = { __typename?: 'Query', getAllService: Array<{ __typename?: 'Services', _id: string, serviceCategory: string, serviceName: string, subService: string, subSubService: string, for: string, description: string, estimatedTime: number, price: number, inputLimit: number, fileFormat: string, deliveryFormat: string, deliveryDays: number, maxDuration: number, numberOfReferenceFileUploads: number, setOfRevisions: number, revisionsDelivery: number, mixVocalTuning: string, mixProcessingReverbs: string, mixProcessingDelays: string, mixProcessingOtherFx: string, createdAt: any, updatedAt: any, addOn: Array<{ __typename?: 'AddOn', type: string, value: number }> }> };

export type AddServiceMutationVariables = Exact<{
  input: ServicesInput;
}>;


export type AddServiceMutation = { __typename?: 'Mutation', addService: boolean };


export const GetAllServiceDocument = gql`
    query GetAllService {
  getAllService {
    _id
    serviceCategory
    serviceName
    subService
    subSubService
    for
    description
    estimatedTime
    price
    inputLimit
    fileFormat
    deliveryFormat
    deliveryDays
    maxDuration
    numberOfReferenceFileUploads
    setOfRevisions
    revisionsDelivery
    mixVocalTuning
    mixProcessingReverbs
    mixProcessingDelays
    mixProcessingOtherFx
    addOn {
      type
      value
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAllServiceQuery__
 *
 * To run a query within a React component, call `useGetAllServiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllServiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllServiceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllServiceQuery(baseOptions?: Apollo.QueryHookOptions<GetAllServiceQuery, GetAllServiceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllServiceQuery, GetAllServiceQueryVariables>(GetAllServiceDocument, options);
      }
export function useGetAllServiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllServiceQuery, GetAllServiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllServiceQuery, GetAllServiceQueryVariables>(GetAllServiceDocument, options);
        }
export type GetAllServiceQueryHookResult = ReturnType<typeof useGetAllServiceQuery>;
export type GetAllServiceLazyQueryHookResult = ReturnType<typeof useGetAllServiceLazyQuery>;
export type GetAllServiceQueryResult = Apollo.QueryResult<GetAllServiceQuery, GetAllServiceQueryVariables>;
export const AddServiceDocument = gql`
    mutation AddService($input: ServicesInput!) {
  addService(input: $input)
}
    `;
export type AddServiceMutationFn = Apollo.MutationFunction<AddServiceMutation, AddServiceMutationVariables>;

/**
 * __useAddServiceMutation__
 *
 * To run a mutation, you first call `useAddServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addServiceMutation, { data, loading, error }] = useAddServiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddServiceMutation(baseOptions?: Apollo.MutationHookOptions<AddServiceMutation, AddServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddServiceMutation, AddServiceMutationVariables>(AddServiceDocument, options);
      }
export type AddServiceMutationHookResult = ReturnType<typeof useAddServiceMutation>;
export type AddServiceMutationResult = Apollo.MutationResult<AddServiceMutation>;
export type AddServiceMutationOptions = Apollo.BaseMutationOptions<AddServiceMutation, AddServiceMutationVariables>;