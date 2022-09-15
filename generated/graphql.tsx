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
  value?: Maybe<Scalars['Float']>;
};

export type AddOnInput = {
  type: Scalars['String'];
  value?: InputMaybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addService: Scalars['Boolean'];
};


export type MutationAddServiceArgs = {
  input: Array<ServicesInput>;
};

export type Query = {
  __typename?: 'Query';
  getAllService: Array<Services>;
  getServiceDetails: Array<Services>;
  login: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  me: User;
  register: Scalars['Boolean'];
};


export type QueryGetServiceDetailsArgs = {
  input: ServicesDetailInput;
};


export type QueryLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};


export type QueryRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  password: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};

export type Services = {
  __typename?: 'Services';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  createdAt: Scalars['DateTime'];
  deliveryDays?: Maybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  estimatedTime?: Maybe<Scalars['Float']>;
  for?: Maybe<Scalars['String']>;
  inputTrackLimit?: Maybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: Maybe<Scalars['Float']>;
  mixProcessingDelays?: Maybe<Scalars['String']>;
  mixProcessingOtherFx?: Maybe<Scalars['String']>;
  mixProcessingReverbs?: Maybe<Scalars['String']>;
  mixVocalTuning?: Maybe<Scalars['String']>;
  numberOfReferenceFileUploads?: Maybe<Scalars['Float']>;
  price: Scalars['Float'];
  revisionsDelivery?: Maybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: Maybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: Maybe<Scalars['String']>;
  subService2?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
};

export type ServicesDetailInput = {
  mainCategory: Scalars['String'];
  serviceName: Scalars['String'];
  subCategory: Scalars['String'];
  subService?: InputMaybe<Scalars['String']>;
};

export type ServicesInput = {
  addOn: Array<AddOnInput>;
  deliveryDays?: InputMaybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  estimatedTime?: InputMaybe<Scalars['Float']>;
  for?: InputMaybe<Scalars['String']>;
  inputTrackLimit?: InputMaybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: InputMaybe<Scalars['Float']>;
  mixProcessingDelays?: InputMaybe<Scalars['String']>;
  mixProcessingOtherFx?: InputMaybe<Scalars['String']>;
  mixProcessingReverbs?: InputMaybe<Scalars['String']>;
  mixVocalTuning?: InputMaybe<Scalars['String']>;
  numberOfReferenceFileUploads?: InputMaybe<Scalars['Float']>;
  price: Scalars['Float'];
  revisionsDelivery?: InputMaybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: InputMaybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: InputMaybe<Scalars['String']>;
  subService2?: InputMaybe<Scalars['String']>;
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  accountVerified: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  lastLoggedIn?: Maybe<Scalars['DateTime']>;
  lastLoggedOut?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  number: Scalars['String'];
  services: Array<UserServices>;
  updatedAt: Scalars['DateTime'];
};

export type UserServices = {
  __typename?: 'UserServices';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  createdAt: Scalars['DateTime'];
  deliveryDays?: Maybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  estimatedTime?: Maybe<Scalars['Float']>;
  for?: Maybe<Scalars['String']>;
  inputTrackLimit?: Maybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: Maybe<Scalars['Float']>;
  mixProcessingDelays?: Maybe<Scalars['String']>;
  mixProcessingOtherFx?: Maybe<Scalars['String']>;
  mixProcessingReverbs?: Maybe<Scalars['String']>;
  mixVocalTuning?: Maybe<Scalars['String']>;
  numberOfReferenceFileUploads?: Maybe<Scalars['Float']>;
  paid: Scalars['Boolean'];
  price: Scalars['Float'];
  projectName?: Maybe<Scalars['String']>;
  revisionsDelivery?: Maybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: Maybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: Maybe<Scalars['String']>;
  subService2?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
};

export type GetAllServiceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllServiceQuery = { __typename?: 'Query', getAllService: Array<{ __typename?: 'Services', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, for?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuning?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, createdAt: any, updatedAt: any, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null }> }> };

export type AddServiceMutationVariables = Exact<{
  input: Array<ServicesInput> | ServicesInput;
}>;


export type AddServiceMutation = { __typename?: 'Mutation', addService: boolean };


export const GetAllServiceDocument = gql`
    query GetAllService {
  getAllService {
    _id
    mainCategory
    subCategory
    serviceName
    subService
    subService2
    for
    description
    estimatedTime
    price
    inputTrackLimit
    uploadFileFormat
    deliveryFileFormat
    deliveryDays
    maxFileDuration
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
    mutation AddService($input: [ServicesInput!]!) {
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