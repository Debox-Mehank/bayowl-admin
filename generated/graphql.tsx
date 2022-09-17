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
  qty?: Maybe<Scalars['Float']>;
  type: Scalars['String'];
  value?: Maybe<Scalars['Float']>;
};

export type AddOnInput = {
  qty?: InputMaybe<Scalars['Float']>;
  type: Scalars['String'];
  value?: InputMaybe<Scalars['Float']>;
};

export type Admin = {
  __typename?: 'Admin';
  _id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Admin>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<AdminRole>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type AdminLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type AdminRegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  type: AdminRole;
};

/** Enum For Type of Admin Roles i.e. Master, Admin & Normal */
export enum AdminRole {
  Employee = 'employee',
  Manager = 'manager',
  Master = 'master'
}

export type FileUploadResponse = {
  __typename?: 'FileUploadResponse';
  fileId?: Maybe<Scalars['String']>;
  fileKey?: Maybe<Scalars['String']>;
};

export type FinalMultipartUploadInput = {
  fileId?: InputMaybe<Scalars['String']>;
  fileKey?: InputMaybe<Scalars['String']>;
  parts?: InputMaybe<Array<FinalMultipartUploadPartsInput>>;
};

export type FinalMultipartUploadPartsInput = {
  ETag?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['Float']>;
};

export type MultipartSignedUrlResponse = {
  __typename?: 'MultipartSignedUrlResponse';
  PartNumber?: Maybe<Scalars['Float']>;
  signedUrl?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addService: Scalars['Boolean'];
  addUser: Scalars['String'];
  assignService: Scalars['Boolean'];
};


export type MutationAddServiceArgs = {
  input: Array<ServicesInput>;
};


export type MutationAddUserArgs = {
  input: AdminRegisterInput;
};


export type MutationAssignServiceArgs = {
  adminId: Scalars['String'];
  serviceId: Scalars['String'];
};

export type Payment = {
  __typename?: 'Payment';
  _id: Scalars['ID'];
  amount: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  orderId?: Maybe<Scalars['String']>;
  paymentId?: Maybe<Scalars['String']>;
  paymentLinkId?: Maybe<Scalars['String']>;
  signature?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  userServiceId?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  addUserService: Scalars['Boolean'];
  adminLogin: Scalars['Boolean'];
  adminLogout: Scalars['Boolean'];
  allAdmins: Array<Admin>;
  allEmployee: Array<Admin>;
  completeAccount: Scalars['Boolean'];
  finalizeMultipartUpload?: Maybe<Scalars['String']>;
  getAllPayment: Array<Payment>;
  getAllService: Array<Services>;
  getAllServiceForEmployee: Array<UserServices>;
  getAllUser: Array<User>;
  getMultipartPreSignedUrls: Array<MultipartSignedUrlResponse>;
  getS3SignedURL: Scalars['String'];
  getServiceDetails: Array<Services>;
  getUserServiceDetailsById?: Maybe<UserServices>;
  initFileUpload: FileUploadResponse;
  initiatePayment: Scalars['String'];
  login: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  me: User;
  meAdmin: Scalars['String'];
  register: Scalars['Boolean'];
  updatePorjectName: Scalars['Boolean'];
  uploadFilesForService: Scalars['Boolean'];
  verifyUser: Scalars['Boolean'];
};


export type QueryAddUserServiceArgs = {
  input: UserServicesInput;
};


export type QueryAdminLoginArgs = {
  input: AdminLoginInput;
};


export type QueryCompleteAccountArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type QueryFinalizeMultipartUploadArgs = {
  input: FinalMultipartUploadInput;
};


export type QueryGetMultipartPreSignedUrlsArgs = {
  fileId: Scalars['String'];
  fileKey: Scalars['String'];
  parts: Scalars['Float'];
};


export type QueryGetS3SignedUrlArgs = {
  fileName: Scalars['String'];
};


export type QueryGetServiceDetailsArgs = {
  input: ServicesDetailInput;
};


export type QueryGetUserServiceDetailsByIdArgs = {
  serviceId: Scalars['String'];
};


export type QueryInitFileUploadArgs = {
  fileName: Scalars['String'];
};


export type QueryInitiatePaymentArgs = {
  email?: InputMaybe<Scalars['String']>;
  service: UserServicesInput;
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


export type QueryUpdatePorjectNameArgs = {
  projectName: Scalars['String'];
  serviceId: Scalars['String'];
};


export type QueryUploadFilesForServiceArgs = {
  referenceUploadedFiles: Array<Scalars['String']>;
  serviceId: Scalars['String'];
  uplodedFiles: Array<Scalars['String']>;
};


export type QueryVerifyUserArgs = {
  token: Scalars['String'];
};

export type RevisionFiles = {
  __typename?: 'RevisionFiles';
  description?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['String']>;
  revision: Scalars['Float'];
};

export type ServiceStatusObject = {
  __typename?: 'ServiceStatusObject';
  name?: Maybe<UserServiceStatus>;
  state: ServiceStatusObjectState;
};

/** Enum for state */
export enum ServiceStatusObjectState {
  Completed = 'completed',
  Current = 'current',
  Pending = 'pending'
}

export type Services = {
  __typename?: 'Services';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  createdAt?: Maybe<Scalars['DateTime']>;
  deliveryDays?: Maybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  estimatedTime?: Maybe<Scalars['Float']>;
  inputTrackLimit?: Maybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: Maybe<Scalars['Float']>;
  mixProcessingDelays?: Maybe<Scalars['String']>;
  mixProcessingOtherFx?: Maybe<Scalars['String']>;
  mixProcessingReverbs?: Maybe<Scalars['String']>;
  mixVocalTuningAdvanced?: Maybe<Scalars['String']>;
  mixVocalTuningBasic?: Maybe<Scalars['String']>;
  numberOfReferenceFileUploads?: Maybe<Scalars['Float']>;
  price: Scalars['Float'];
  revisionsDelivery?: Maybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: Maybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: Maybe<Scalars['String']>;
  subService2?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
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
  inputTrackLimit?: InputMaybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: InputMaybe<Scalars['Float']>;
  mixProcessingDelays?: InputMaybe<Scalars['String']>;
  mixProcessingOtherFx?: InputMaybe<Scalars['String']>;
  mixProcessingReverbs?: InputMaybe<Scalars['String']>;
  mixVocalTuningAdvanced?: InputMaybe<Scalars['String']>;
  mixVocalTuningBasic?: InputMaybe<Scalars['String']>;
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
  name?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  services: Array<UserServices>;
  updatedAt: Scalars['DateTime'];
};

/** Enum for status of user service */
export enum UserServiceStatus {
  Completed = 'completed',
  Delivered = 'delivered',
  Pendingupload = 'pendingupload',
  Revisiondelivered = 'revisiondelivered',
  Revisionrequest = 'revisionrequest',
  Underreview = 'underreview',
  Workinprogress = 'workinprogress'
}

export type UserServices = {
  __typename?: 'UserServices';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  assignedBy?: Maybe<Admin>;
  assignedTo?: Maybe<Admin>;
  createdAt?: Maybe<Scalars['DateTime']>;
  deliveryDays?: Maybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  estimatedTime?: Maybe<Scalars['Float']>;
  inputTrackLimit?: Maybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: Maybe<Scalars['Float']>;
  mixProcessingDelays?: Maybe<Scalars['String']>;
  mixProcessingOtherFx?: Maybe<Scalars['String']>;
  mixProcessingReverbs?: Maybe<Scalars['String']>;
  mixVocalTuningAdvanced?: Maybe<Scalars['String']>;
  mixVocalTuningBasic?: Maybe<Scalars['String']>;
  numberOfReferenceFileUploads?: Maybe<Scalars['Float']>;
  paid: Scalars['Boolean'];
  price: Scalars['Float'];
  projectName?: Maybe<Scalars['String']>;
  referenceFiles: Array<Scalars['String']>;
  reupload?: Maybe<Scalars['DateTime']>;
  revisionFiles: Array<RevisionFiles>;
  revisionsDelivery?: Maybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: Maybe<Scalars['Float']>;
  status: Array<ServiceStatusObject>;
  statusType: UserServiceStatus;
  subCategory: Scalars['String'];
  subService?: Maybe<Scalars['String']>;
  subService2?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
  uploadedFiles: Array<Scalars['String']>;
};

export type UserServicesInput = {
  addOn: Array<AddOnInput>;
  deliveryDays?: InputMaybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  estimatedTime?: InputMaybe<Scalars['Float']>;
  inputTrackLimit?: InputMaybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: InputMaybe<Scalars['Float']>;
  mixProcessingDelays?: InputMaybe<Scalars['String']>;
  mixProcessingOtherFx?: InputMaybe<Scalars['String']>;
  mixProcessingReverbs?: InputMaybe<Scalars['String']>;
  mixVocalTuningAdvanced?: InputMaybe<Scalars['String']>;
  mixVocalTuningBasic?: InputMaybe<Scalars['String']>;
  numberOfReferenceFileUploads?: InputMaybe<Scalars['Float']>;
  price: Scalars['Float'];
  projectName?: InputMaybe<Scalars['String']>;
  revisionsDelivery?: InputMaybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: InputMaybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: InputMaybe<Scalars['String']>;
  subService2?: InputMaybe<Scalars['String']>;
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
};

export type GetAllServiceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllServiceQuery = { __typename?: 'Query', getAllService: Array<{ __typename?: 'Services', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuningBasic?: string | null, mixVocalTuningAdvanced?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, createdAt?: any | null, updatedAt?: any | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null, qty?: number | null }> }> };

export type GetAllUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserQuery = { __typename?: 'Query', getAllUser: Array<{ __typename?: 'User', _id: string, name?: string | null, email: string, number?: string | null, lastLoggedIn?: any | null, lastLoggedOut?: any | null, accountVerified: boolean, createdAt: any, updatedAt: any, services: Array<{ __typename?: 'UserServices', mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, uploadedFiles: Array<string>, referenceFiles: Array<string>, statusType: UserServiceStatus, _id: string, deliveryFileFormat: Array<string>, uploadFileFormat: Array<string>, paid: boolean, price: number, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null, qty?: number | null }>, revisionFiles: Array<{ __typename?: 'RevisionFiles', file?: string | null, description?: string | null, revision: number }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> }> }> };

export type GetAllPaymentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPaymentQuery = { __typename?: 'Query', getAllPayment: Array<{ __typename?: 'Payment', _id: string, email: string, orderId?: string | null, paymentId?: string | null, paymentLinkId?: string | null, signature?: string | null, userServiceId?: string | null, amount: number, status?: string | null, createdAt: any, updatedAt: any }> };

export type AllAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllAdminsQuery = { __typename?: 'Query', allAdmins: Array<{ __typename?: 'Admin', _id?: string | null, name?: string | null, email?: string | null, type?: AdminRole | null, createdAt?: any | null, updatedAt?: any | null, createdBy?: { __typename?: 'Admin', name?: string | null } | null }> };

export type GetAllServiceForEmployeeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllServiceForEmployeeQuery = { __typename?: 'Query', getAllServiceForEmployee: Array<{ __typename?: 'UserServices', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, estimatedTime?: number | null, price: number, mixVocalTuningBasic?: string | null, mixVocalTuningAdvanced?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, deliveryDays?: number | null, updatedAt?: any | null, createdAt?: any | null, projectName?: string | null, paid: boolean, statusType: UserServiceStatus, setOfRevisions?: number | null, inputTrackLimit?: number | null, referenceFiles: Array<string>, deliveryFileFormat: Array<string>, uploadFileFormat: Array<string>, uploadedFiles: Array<string>, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null, qty?: number | null }>, assignedTo?: { __typename?: 'Admin', name?: string | null } | null, assignedBy?: { __typename?: 'Admin', name?: string | null } | null, revisionFiles: Array<{ __typename?: 'RevisionFiles', file?: string | null, description?: string | null, revision: number }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> }> };

export type AllEmployeeQueryVariables = Exact<{ [key: string]: never; }>;


export type AllEmployeeQuery = { __typename?: 'Query', allEmployee: Array<{ __typename?: 'Admin', _id?: string | null, name?: string | null }> };

export type AssignServiceMutationVariables = Exact<{
  adminId: Scalars['String'];
  serviceId: Scalars['String'];
}>;


export type AssignServiceMutation = { __typename?: 'Mutation', assignService: boolean };

export type AdminLoginQueryVariables = Exact<{
  input: AdminLoginInput;
}>;


export type AdminLoginQuery = { __typename?: 'Query', adminLogin: boolean };

export type MeAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type MeAdminQuery = { __typename?: 'Query', meAdmin: string };

export type AddAdminMutationVariables = Exact<{
  input: AdminRegisterInput;
}>;


export type AddAdminMutation = { __typename?: 'Mutation', addUser: string };

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
    mixVocalTuningBasic
    mixVocalTuningAdvanced
    mixProcessingReverbs
    mixProcessingDelays
    mixProcessingOtherFx
    addOn {
      type
      value
      qty
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
export const GetAllUserDocument = gql`
    query GetAllUser {
  getAllUser {
    _id
    name
    email
    number
    services {
      mainCategory
      subCategory
      serviceName
      subService
      subService2
      uploadedFiles
      referenceFiles
      statusType
      _id
      addOn {
        type
        value
        qty
      }
      deliveryFileFormat
      uploadFileFormat
      paid
      price
      revisionFiles {
        file
        description
        revision
      }
      status {
        name
        state
      }
    }
    lastLoggedIn
    lastLoggedOut
    accountVerified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAllUserQuery__
 *
 * To run a query within a React component, call `useGetAllUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUserQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUserQuery, GetAllUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUserQuery, GetAllUserQueryVariables>(GetAllUserDocument, options);
      }
export function useGetAllUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUserQuery, GetAllUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUserQuery, GetAllUserQueryVariables>(GetAllUserDocument, options);
        }
export type GetAllUserQueryHookResult = ReturnType<typeof useGetAllUserQuery>;
export type GetAllUserLazyQueryHookResult = ReturnType<typeof useGetAllUserLazyQuery>;
export type GetAllUserQueryResult = Apollo.QueryResult<GetAllUserQuery, GetAllUserQueryVariables>;
export const GetAllPaymentDocument = gql`
    query GetAllPayment {
  getAllPayment {
    _id
    email
    orderId
    paymentId
    paymentLinkId
    signature
    userServiceId
    amount
    status
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAllPaymentQuery__
 *
 * To run a query within a React component, call `useGetAllPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPaymentQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPaymentQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPaymentQuery, GetAllPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPaymentQuery, GetAllPaymentQueryVariables>(GetAllPaymentDocument, options);
      }
export function useGetAllPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPaymentQuery, GetAllPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPaymentQuery, GetAllPaymentQueryVariables>(GetAllPaymentDocument, options);
        }
export type GetAllPaymentQueryHookResult = ReturnType<typeof useGetAllPaymentQuery>;
export type GetAllPaymentLazyQueryHookResult = ReturnType<typeof useGetAllPaymentLazyQuery>;
export type GetAllPaymentQueryResult = Apollo.QueryResult<GetAllPaymentQuery, GetAllPaymentQueryVariables>;
export const AllAdminsDocument = gql`
    query AllAdmins {
  allAdmins {
    _id
    name
    email
    type
    createdBy {
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllAdminsQuery__
 *
 * To run a query within a React component, call `useAllAdminsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllAdminsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllAdminsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllAdminsQuery(baseOptions?: Apollo.QueryHookOptions<AllAdminsQuery, AllAdminsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllAdminsQuery, AllAdminsQueryVariables>(AllAdminsDocument, options);
      }
export function useAllAdminsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllAdminsQuery, AllAdminsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllAdminsQuery, AllAdminsQueryVariables>(AllAdminsDocument, options);
        }
export type AllAdminsQueryHookResult = ReturnType<typeof useAllAdminsQuery>;
export type AllAdminsLazyQueryHookResult = ReturnType<typeof useAllAdminsLazyQuery>;
export type AllAdminsQueryResult = Apollo.QueryResult<AllAdminsQuery, AllAdminsQueryVariables>;
export const GetAllServiceForEmployeeDocument = gql`
    query GetAllServiceForEmployee {
  getAllServiceForEmployee {
    _id
    mainCategory
    subCategory
    serviceName
    subService
    subService2
    estimatedTime
    price
    mixVocalTuningBasic
    mixVocalTuningAdvanced
    mixProcessingReverbs
    mixProcessingDelays
    mixProcessingOtherFx
    addOn {
      type
      value
      qty
    }
    deliveryDays
    updatedAt
    createdAt
    projectName
    paid
    assignedTo {
      name
    }
    assignedBy {
      name
    }
    statusType
    setOfRevisions
    inputTrackLimit
    referenceFiles
    revisionFiles {
      file
      description
      revision
    }
    status {
      name
      state
    }
    deliveryFileFormat
    uploadFileFormat
    uploadedFiles
  }
}
    `;

/**
 * __useGetAllServiceForEmployeeQuery__
 *
 * To run a query within a React component, call `useGetAllServiceForEmployeeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllServiceForEmployeeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllServiceForEmployeeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllServiceForEmployeeQuery(baseOptions?: Apollo.QueryHookOptions<GetAllServiceForEmployeeQuery, GetAllServiceForEmployeeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllServiceForEmployeeQuery, GetAllServiceForEmployeeQueryVariables>(GetAllServiceForEmployeeDocument, options);
      }
export function useGetAllServiceForEmployeeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllServiceForEmployeeQuery, GetAllServiceForEmployeeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllServiceForEmployeeQuery, GetAllServiceForEmployeeQueryVariables>(GetAllServiceForEmployeeDocument, options);
        }
export type GetAllServiceForEmployeeQueryHookResult = ReturnType<typeof useGetAllServiceForEmployeeQuery>;
export type GetAllServiceForEmployeeLazyQueryHookResult = ReturnType<typeof useGetAllServiceForEmployeeLazyQuery>;
export type GetAllServiceForEmployeeQueryResult = Apollo.QueryResult<GetAllServiceForEmployeeQuery, GetAllServiceForEmployeeQueryVariables>;
export const AllEmployeeDocument = gql`
    query AllEmployee {
  allEmployee {
    _id
    name
  }
}
    `;

/**
 * __useAllEmployeeQuery__
 *
 * To run a query within a React component, call `useAllEmployeeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllEmployeeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllEmployeeQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllEmployeeQuery(baseOptions?: Apollo.QueryHookOptions<AllEmployeeQuery, AllEmployeeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllEmployeeQuery, AllEmployeeQueryVariables>(AllEmployeeDocument, options);
      }
export function useAllEmployeeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllEmployeeQuery, AllEmployeeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllEmployeeQuery, AllEmployeeQueryVariables>(AllEmployeeDocument, options);
        }
export type AllEmployeeQueryHookResult = ReturnType<typeof useAllEmployeeQuery>;
export type AllEmployeeLazyQueryHookResult = ReturnType<typeof useAllEmployeeLazyQuery>;
export type AllEmployeeQueryResult = Apollo.QueryResult<AllEmployeeQuery, AllEmployeeQueryVariables>;
export const AssignServiceDocument = gql`
    mutation AssignService($adminId: String!, $serviceId: String!) {
  assignService(adminId: $adminId, serviceId: $serviceId)
}
    `;
export type AssignServiceMutationFn = Apollo.MutationFunction<AssignServiceMutation, AssignServiceMutationVariables>;

/**
 * __useAssignServiceMutation__
 *
 * To run a mutation, you first call `useAssignServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignServiceMutation, { data, loading, error }] = useAssignServiceMutation({
 *   variables: {
 *      adminId: // value for 'adminId'
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useAssignServiceMutation(baseOptions?: Apollo.MutationHookOptions<AssignServiceMutation, AssignServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignServiceMutation, AssignServiceMutationVariables>(AssignServiceDocument, options);
      }
export type AssignServiceMutationHookResult = ReturnType<typeof useAssignServiceMutation>;
export type AssignServiceMutationResult = Apollo.MutationResult<AssignServiceMutation>;
export type AssignServiceMutationOptions = Apollo.BaseMutationOptions<AssignServiceMutation, AssignServiceMutationVariables>;
export const AdminLoginDocument = gql`
    query AdminLogin($input: AdminLoginInput!) {
  adminLogin(input: $input)
}
    `;

/**
 * __useAdminLoginQuery__
 *
 * To run a query within a React component, call `useAdminLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminLoginQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminLoginQuery(baseOptions: Apollo.QueryHookOptions<AdminLoginQuery, AdminLoginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminLoginQuery, AdminLoginQueryVariables>(AdminLoginDocument, options);
      }
export function useAdminLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminLoginQuery, AdminLoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminLoginQuery, AdminLoginQueryVariables>(AdminLoginDocument, options);
        }
export type AdminLoginQueryHookResult = ReturnType<typeof useAdminLoginQuery>;
export type AdminLoginLazyQueryHookResult = ReturnType<typeof useAdminLoginLazyQuery>;
export type AdminLoginQueryResult = Apollo.QueryResult<AdminLoginQuery, AdminLoginQueryVariables>;
export const MeAdminDocument = gql`
    query MeAdmin {
  meAdmin
}
    `;

/**
 * __useMeAdminQuery__
 *
 * To run a query within a React component, call `useMeAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeAdminQuery(baseOptions?: Apollo.QueryHookOptions<MeAdminQuery, MeAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeAdminQuery, MeAdminQueryVariables>(MeAdminDocument, options);
      }
export function useMeAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeAdminQuery, MeAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeAdminQuery, MeAdminQueryVariables>(MeAdminDocument, options);
        }
export type MeAdminQueryHookResult = ReturnType<typeof useMeAdminQuery>;
export type MeAdminLazyQueryHookResult = ReturnType<typeof useMeAdminLazyQuery>;
export type MeAdminQueryResult = Apollo.QueryResult<MeAdminQuery, MeAdminQueryVariables>;
export const AddAdminDocument = gql`
    mutation AddAdmin($input: AdminRegisterInput!) {
  addUser(input: $input)
}
    `;
export type AddAdminMutationFn = Apollo.MutationFunction<AddAdminMutation, AddAdminMutationVariables>;

/**
 * __useAddAdminMutation__
 *
 * To run a mutation, you first call `useAddAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAdminMutation, { data, loading, error }] = useAddAdminMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddAdminMutation(baseOptions?: Apollo.MutationHookOptions<AddAdminMutation, AddAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAdminMutation, AddAdminMutationVariables>(AddAdminDocument, options);
      }
export type AddAdminMutationHookResult = ReturnType<typeof useAddAdminMutation>;
export type AddAdminMutationResult = Apollo.MutationResult<AddAdminMutation>;
export type AddAdminMutationOptions = Apollo.BaseMutationOptions<AddAdminMutation, AddAdminMutationVariables>;
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