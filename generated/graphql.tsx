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
  main: Scalars['Boolean'];
  qty?: Maybe<Scalars['Float']>;
  type: Scalars['String'];
  value?: Maybe<Scalars['Float']>;
};

export type AddOnInput = {
  main: Scalars['Boolean'];
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

export type DashboardContent = {
  __typename?: 'DashboardContent';
  _id: Scalars['ID'];
  active: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  createdBy: Admin;
  image: Scalars['String'];
  lastUpdatedBy: Admin;
  updatedAt: Scalars['DateTime'];
};

export type DashboardContentInput = {
  image: Scalars['String'];
};

export type DashboardInterfaceClass = {
  __typename?: 'DashboardInterfaceClass';
  data: Scalars['Float'];
  label: Scalars['String'];
};

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
  uploadRevisionFiles: Scalars['Boolean'];
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


export type MutationUploadRevisionFilesArgs = {
  fileUrl: Scalars['String'];
  revisionNumber: Scalars['Float'];
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

export type PaymentConfig = {
  __typename?: 'PaymentConfig';
  _id: Scalars['ID'];
  active: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  lastUpdatedBy?: Maybe<Admin>;
  type?: Maybe<PaymentConfigEnum>;
  updatedAt: Scalars['DateTime'];
  value: Scalars['Float'];
};

/** Enum For Type of Payment Configs */
export enum PaymentConfigEnum {
  Gst = 'gst'
}

export type PaymentConfigInput = {
  active: Scalars['Boolean'];
  lastUpdatedBy?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<PaymentConfigEnum>;
  value: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  activeDashboardContent: Array<DashboardContent>;
  addAddOnExportsFile: Scalars['Boolean'];
  addDashboardContent: DashboardContent;
  addDeliverFiles: Scalars['Boolean'];
  addPaymentConfig: Scalars['Boolean'];
  addRevisionNotesByMaster: Scalars['Boolean'];
  addWorkingFile: Scalars['Boolean'];
  adminLogin: Scalars['Boolean'];
  adminLogout: Scalars['Boolean'];
  allAdmins: Array<Admin>;
  allDashboardContent: Array<DashboardContent>;
  allEmployee: Array<Admin>;
  approveProject: Scalars['Boolean'];
  completeAccount: Scalars['Boolean'];
  confirmUpload: Scalars['Boolean'];
  dashboardMet: Array<DashboardInterfaceClass>;
  finalizeMultipartUpload?: Maybe<Scalars['String']>;
  getAllPayment: Array<Payment>;
  getAllPaymentConfig: Array<PaymentConfig>;
  getAllService: Array<Services>;
  getAllServiceForEmployee: Array<UserServices>;
  getAllServiceForMaster: Array<UserServices>;
  getAllUser: Array<User>;
  getContentUploadUrl: Scalars['String'];
  getGstStatus: Scalars['Boolean'];
  getMultipartPreSignedUrls: Array<MultipartSignedUrlResponse>;
  getS3SignedURL: Scalars['String'];
  getServiceDetails: Array<Services>;
  getUserServiceDetailsById?: Maybe<UserServices>;
  initFileUpload: FileUploadResponse;
  initiatePayment: Scalars['String'];
  login: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  markCompleted: Scalars['Boolean'];
  me: User;
  meAdmin?: Maybe<Admin>;
  register: Scalars['Boolean'];
  removeService: Scalars['Boolean'];
  requestReupload: Scalars['Boolean'];
  requestRevision: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  toggleDashboardContent: DashboardContent;
  updateDashboardContent: Scalars['Boolean'];
  updateFreeUser: Scalars['Boolean'];
  updatePaymentConfig: Scalars['Boolean'];
  updatePorjectName: Scalars['Boolean'];
  uploadFilesForService: Scalars['Boolean'];
  verifyUser: Scalars['Boolean'];
};


export type QueryAddAddOnExportsFileArgs = {
  serviceId: Scalars['String'];
  url: Scalars['String'];
};


export type QueryAddDashboardContentArgs = {
  input: DashboardContentInput;
};


export type QueryAddDeliverFilesArgs = {
  serviceId: Scalars['String'];
  url: Scalars['String'];
};


export type QueryAddPaymentConfigArgs = {
  input: PaymentConfigInput;
};


export type QueryAddRevisionNotesByMasterArgs = {
  note: Scalars['String'];
  serviceId: Scalars['String'];
};


export type QueryAddWorkingFileArgs = {
  serviceId: Scalars['String'];
  url: Scalars['String'];
};


export type QueryAdminLoginArgs = {
  input: AdminLoginInput;
};


export type QueryApproveProjectArgs = {
  serviceId: Scalars['String'];
};


export type QueryCompleteAccountArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type QueryConfirmUploadArgs = {
  deliveryDays: Scalars['Float'];
  serviceId: Scalars['String'];
};


export type QueryFinalizeMultipartUploadArgs = {
  input: FinalMultipartUploadInput;
};


export type QueryGetContentUploadUrlArgs = {
  fileName: Scalars['String'];
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
  service: UserServicesInput;
};


export type QueryLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};


export type QueryMarkCompletedArgs = {
  serviceId: Scalars['String'];
};


export type QueryRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  password: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};


export type QueryRemoveServiceArgs = {
  serviceId: Scalars['String'];
};


export type QueryRequestReuploadArgs = {
  reuploadNote: Scalars['String'];
  serviceId: Scalars['String'];
};


export type QueryRequestRevisionArgs = {
  description: Scalars['String'];
  revisionForNumber: Scalars['Float'];
  revisionNumber: Scalars['Float'];
  serviceId: Scalars['String'];
};


export type QueryResetPasswordArgs = {
  id: Scalars['String'];
  password: Scalars['String'];
};


export type QueryToggleDashboardContentArgs = {
  id: Scalars['String'];
};


export type QueryUpdateDashboardContentArgs = {
  id: Scalars['String'];
  input: DashboardContentInput;
};


export type QueryUpdateFreeUserArgs = {
  free: Scalars['Boolean'];
  id: Scalars['String'];
};


export type QueryUpdatePaymentConfigArgs = {
  gst: Scalars['Boolean'];
};


export type QueryUpdatePorjectNameArgs = {
  projectName: Scalars['String'];
  serviceId: Scalars['String'];
};


export type QueryUploadFilesForServiceArgs = {
  isReupload?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  referenceUploadedFiles?: InputMaybe<Array<Scalars['String']>>;
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
  revisionFor: Scalars['Float'];
  revisionTime?: Maybe<Scalars['DateTime']>;
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
  serviceName?: InputMaybe<Scalars['String']>;
  subCategory: Scalars['String'];
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
  free?: Maybe<Scalars['Boolean']>;
  lastLoggedIn?: Maybe<Scalars['DateTime']>;
  lastLoggedOut?: Maybe<Scalars['DateTime']>;
  lastUpdatedBy?: Maybe<Admin>;
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
  Underreviewinternal = 'underreviewinternal',
  Workinprogress = 'workinprogress'
}

export type UserServices = {
  __typename?: 'UserServices';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  addOnExportsBusStems: Scalars['Boolean'];
  addOnExportsFile?: Maybe<Scalars['String']>;
  addOnExportsMultitrack: Scalars['Boolean'];
  addOnExtraRevision: Scalars['Boolean'];
  assignedBy?: Maybe<Admin>;
  assignedTime?: Maybe<Scalars['DateTime']>;
  assignedTo?: Maybe<Admin>;
  completionDate?: Maybe<Scalars['DateTime']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  deliveredFiles?: Maybe<Array<Scalars['String']>>;
  deliveryDays?: Maybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  estDeliveryDate?: Maybe<Scalars['DateTime']>;
  estimatedTime?: Maybe<Scalars['Float']>;
  inputTrackLimit?: Maybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  masterProjectApprovalTime?: Maybe<Scalars['DateTime']>;
  maxFileDuration?: Maybe<Scalars['Float']>;
  mixProcessingDelays?: Maybe<Scalars['String']>;
  mixProcessingOtherFx?: Maybe<Scalars['String']>;
  mixProcessingReverbs?: Maybe<Scalars['String']>;
  mixVocalTuningAdvanced?: Maybe<Scalars['String']>;
  mixVocalTuningBasic?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  numberOfReferenceFileUploads?: Maybe<Scalars['Float']>;
  numberOfRevisionsByMaster?: Maybe<Scalars['Float']>;
  paid: Scalars['Boolean'];
  paidAt?: Maybe<Scalars['DateTime']>;
  price: Scalars['Float'];
  projectName?: Maybe<Scalars['String']>;
  referenceFiles: Array<Scalars['String']>;
  requestReuploadCounter?: Maybe<Scalars['Float']>;
  reupload?: Maybe<Scalars['DateTime']>;
  reuploadNote?: Maybe<Scalars['String']>;
  revisionFiles: Array<RevisionFiles>;
  revisionNotesByMaster?: Maybe<Scalars['String']>;
  revisionTimeByMaster?: Maybe<Scalars['DateTime']>;
  revisionsDelivery?: Maybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: Maybe<Scalars['Float']>;
  status: Array<ServiceStatusObject>;
  statusType: UserServiceStatus;
  subCategory: Scalars['String'];
  subService?: Maybe<Scalars['String']>;
  subService2?: Maybe<Scalars['String']>;
  submissionDate?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
  uploadedFiles: Array<Scalars['String']>;
  wrokingFile?: Maybe<Scalars['String']>;
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

export type ServicesFragment = { __typename?: 'UserServices', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, estimatedTime?: number | null, price: number, mixVocalTuningBasic?: string | null, mixVocalTuningAdvanced?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, deliveryDays?: number | null, updatedAt?: any | null, createdAt?: any | null, projectName?: string | null, paid: boolean, statusType: UserServiceStatus, setOfRevisions?: number | null, inputTrackLimit?: number | null, referenceFiles: Array<string>, deliveryFileFormat: Array<string>, uploadFileFormat: Array<string>, uploadedFiles: Array<string>, reupload?: any | null, notes?: string | null, submissionDate?: any | null, estDeliveryDate?: any | null, assignedTime?: any | null, deliveredFiles?: Array<string> | null, revisionNotesByMaster?: string | null, revisionTimeByMaster?: any | null, numberOfRevisionsByMaster?: number | null, masterProjectApprovalTime?: any | null, completionDate?: any | null, addOnExportsBusStems: boolean, addOnExportsFile?: string | null, addOnExportsMultitrack: boolean, addOnExtraRevision: boolean, paidAt?: any | null, wrokingFile?: string | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null, qty?: number | null, main: boolean }>, assignedTo?: { __typename?: 'Admin', _id?: string | null, name?: string | null } | null, assignedBy?: { __typename?: 'Admin', _id?: string | null, name?: string | null } | null, revisionFiles: Array<{ __typename?: 'RevisionFiles', file?: string | null, description?: string | null, revision: number, revisionFor: number, revisionTime?: any | null }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> };

export type GetAllServiceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllServiceQuery = { __typename?: 'Query', getAllService: Array<{ __typename?: 'Services', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuningBasic?: string | null, mixVocalTuningAdvanced?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, createdAt?: any | null, updatedAt?: any | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null, qty?: number | null, main: boolean }> }> };

export type GetAllUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserQuery = { __typename?: 'Query', getAllUser: Array<{ __typename?: 'User', _id: string, name?: string | null, email: string, number?: string | null, free?: boolean | null, lastLoggedIn?: any | null, lastLoggedOut?: any | null, accountVerified: boolean, createdAt: any, updatedAt: any, services: Array<{ __typename?: 'UserServices', _id: string, statusType: UserServiceStatus, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> }> }> };

export type GetAllPaymentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPaymentQuery = { __typename?: 'Query', getAllPayment: Array<{ __typename?: 'Payment', _id: string, email: string, orderId?: string | null, paymentId?: string | null, paymentLinkId?: string | null, signature?: string | null, userServiceId?: string | null, amount: number, status?: string | null, createdAt: any, updatedAt: any }> };

export type AllAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllAdminsQuery = { __typename?: 'Query', allAdmins: Array<{ __typename?: 'Admin', _id?: string | null, name?: string | null, email?: string | null, type?: AdminRole | null, createdAt?: any | null, updatedAt?: any | null, createdBy?: { __typename?: 'Admin', name?: string | null } | null }> };

export type GetAllServiceForEmployeeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllServiceForEmployeeQuery = { __typename?: 'Query', getAllServiceForEmployee: Array<{ __typename?: 'UserServices', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, estimatedTime?: number | null, price: number, mixVocalTuningBasic?: string | null, mixVocalTuningAdvanced?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, deliveryDays?: number | null, updatedAt?: any | null, createdAt?: any | null, projectName?: string | null, paid: boolean, statusType: UserServiceStatus, setOfRevisions?: number | null, inputTrackLimit?: number | null, referenceFiles: Array<string>, deliveryFileFormat: Array<string>, uploadFileFormat: Array<string>, uploadedFiles: Array<string>, reupload?: any | null, notes?: string | null, submissionDate?: any | null, estDeliveryDate?: any | null, assignedTime?: any | null, deliveredFiles?: Array<string> | null, revisionNotesByMaster?: string | null, revisionTimeByMaster?: any | null, numberOfRevisionsByMaster?: number | null, masterProjectApprovalTime?: any | null, completionDate?: any | null, addOnExportsBusStems: boolean, addOnExportsFile?: string | null, addOnExportsMultitrack: boolean, addOnExtraRevision: boolean, paidAt?: any | null, wrokingFile?: string | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null, qty?: number | null, main: boolean }>, assignedTo?: { __typename?: 'Admin', _id?: string | null, name?: string | null } | null, assignedBy?: { __typename?: 'Admin', _id?: string | null, name?: string | null } | null, revisionFiles: Array<{ __typename?: 'RevisionFiles', file?: string | null, description?: string | null, revision: number, revisionFor: number, revisionTime?: any | null }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> }> };

export type GetAllServiceForMasterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllServiceForMasterQuery = { __typename?: 'Query', getAllServiceForMaster: Array<{ __typename?: 'UserServices', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, estimatedTime?: number | null, price: number, mixVocalTuningBasic?: string | null, mixVocalTuningAdvanced?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, deliveryDays?: number | null, updatedAt?: any | null, createdAt?: any | null, projectName?: string | null, paid: boolean, statusType: UserServiceStatus, setOfRevisions?: number | null, inputTrackLimit?: number | null, referenceFiles: Array<string>, deliveryFileFormat: Array<string>, uploadFileFormat: Array<string>, uploadedFiles: Array<string>, reupload?: any | null, notes?: string | null, submissionDate?: any | null, estDeliveryDate?: any | null, assignedTime?: any | null, deliveredFiles?: Array<string> | null, revisionNotesByMaster?: string | null, revisionTimeByMaster?: any | null, numberOfRevisionsByMaster?: number | null, masterProjectApprovalTime?: any | null, completionDate?: any | null, addOnExportsBusStems: boolean, addOnExportsFile?: string | null, addOnExportsMultitrack: boolean, addOnExtraRevision: boolean, paidAt?: any | null, wrokingFile?: string | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null, qty?: number | null, main: boolean }>, assignedTo?: { __typename?: 'Admin', _id?: string | null, name?: string | null } | null, assignedBy?: { __typename?: 'Admin', _id?: string | null, name?: string | null } | null, revisionFiles: Array<{ __typename?: 'RevisionFiles', file?: string | null, description?: string | null, revision: number, revisionFor: number, revisionTime?: any | null }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> }> };

export type AllEmployeeQueryVariables = Exact<{ [key: string]: never; }>;


export type AllEmployeeQuery = { __typename?: 'Query', allEmployee: Array<{ __typename?: 'Admin', _id?: string | null, name?: string | null }> };

export type AllDashboardContentQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDashboardContentQuery = { __typename?: 'Query', allDashboardContent: Array<{ __typename?: 'DashboardContent', _id: string, image: string, active: boolean, createdAt: any, updatedAt: any, lastUpdatedBy: { __typename?: 'Admin', name?: string | null }, createdBy: { __typename?: 'Admin', name?: string | null } }> };

export type AddDashboardContentQueryVariables = Exact<{
  input: DashboardContentInput;
}>;


export type AddDashboardContentQuery = { __typename?: 'Query', addDashboardContent: { __typename?: 'DashboardContent', _id: string, image: string, active: boolean, createdAt: any, updatedAt: any, lastUpdatedBy: { __typename?: 'Admin', name?: string | null }, createdBy: { __typename?: 'Admin', name?: string | null } } };

export type AssignServiceMutationVariables = Exact<{
  adminId: Scalars['String'];
  serviceId: Scalars['String'];
}>;


export type AssignServiceMutation = { __typename?: 'Mutation', assignService: boolean };

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = { __typename?: 'Query', dashboardMet: Array<{ __typename?: 'DashboardInterfaceClass', label: string, data: number }> };

export type GetS3SignedUrlQueryVariables = Exact<{
  fileName: Scalars['String'];
}>;


export type GetS3SignedUrlQuery = { __typename?: 'Query', getS3SignedURL: string };

export type InitFileUploadQueryVariables = Exact<{
  fileName: Scalars['String'];
}>;


export type InitFileUploadQuery = { __typename?: 'Query', initFileUpload: { __typename?: 'FileUploadResponse', fileId?: string | null, fileKey?: string | null } };

export type GetMultipartPreSignedUrlsQueryVariables = Exact<{
  parts: Scalars['Float'];
  fileKey: Scalars['String'];
  fileId: Scalars['String'];
}>;


export type GetMultipartPreSignedUrlsQuery = { __typename?: 'Query', getMultipartPreSignedUrls: Array<{ __typename?: 'MultipartSignedUrlResponse', signedUrl?: string | null, PartNumber?: number | null }> };

export type ApproveProjectQueryVariables = Exact<{
  serviceId: Scalars['String'];
}>;


export type ApproveProjectQuery = { __typename?: 'Query', approveProject: boolean };

export type AddDeliveryFilesQueryVariables = Exact<{
  url: Scalars['String'];
  serviceId: Scalars['String'];
}>;


export type AddDeliveryFilesQuery = { __typename?: 'Query', addDeliverFiles: boolean };

export type FinalizeMultipartUploadQueryVariables = Exact<{
  input: FinalMultipartUploadInput;
}>;


export type FinalizeMultipartUploadQuery = { __typename?: 'Query', finalizeMultipartUpload?: string | null };

export type ConfirmUploadQueryVariables = Exact<{
  deliveryDays: Scalars['Float'];
  serviceId: Scalars['String'];
}>;


export type ConfirmUploadQuery = { __typename?: 'Query', confirmUpload: boolean };

export type RequestReuploadQueryVariables = Exact<{
  reuploadNote: Scalars['String'];
  serviceId: Scalars['String'];
}>;


export type RequestReuploadQuery = { __typename?: 'Query', requestReupload: boolean };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', adminLogout: boolean };

export type AdminLoginQueryVariables = Exact<{
  input: AdminLoginInput;
}>;


export type AdminLoginQuery = { __typename?: 'Query', adminLogin: boolean };

export type MeAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type MeAdminQuery = { __typename?: 'Query', meAdmin?: { __typename?: 'Admin', _id?: string | null, name?: string | null, type?: AdminRole | null } | null };

export type AddAdminMutationVariables = Exact<{
  input: AdminRegisterInput;
}>;


export type AddAdminMutation = { __typename?: 'Mutation', addUser: string };

export type UploadRevisionFilesMutationVariables = Exact<{
  revisionNumber: Scalars['Float'];
  fileUrl: Scalars['String'];
  serviceId: Scalars['String'];
}>;


export type UploadRevisionFilesMutation = { __typename?: 'Mutation', uploadRevisionFiles: boolean };

export type AddServiceMutationVariables = Exact<{
  input: Array<ServicesInput> | ServicesInput;
}>;


export type AddServiceMutation = { __typename?: 'Mutation', addService: boolean };

export type GetContentUploadUrlQueryVariables = Exact<{
  fileName: Scalars['String'];
}>;


export type GetContentUploadUrlQuery = { __typename?: 'Query', getContentUploadUrl: string };

export type ResetPasswordQueryVariables = Exact<{
  password: Scalars['String'];
  resetPasswordId: Scalars['String'];
}>;


export type ResetPasswordQuery = { __typename?: 'Query', resetPassword: boolean };

export type AddRevisionNotesByMasterQueryVariables = Exact<{
  note: Scalars['String'];
  serviceId: Scalars['String'];
}>;


export type AddRevisionNotesByMasterQuery = { __typename?: 'Query', addRevisionNotesByMaster: boolean };

export type GetAllPaymentConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPaymentConfigQuery = { __typename?: 'Query', getAllPaymentConfig: Array<{ __typename?: 'PaymentConfig', _id: string, type?: PaymentConfigEnum | null, value: number, active: boolean, updatedAt: any, lastUpdatedBy?: { __typename?: 'Admin', name?: string | null } | null }> };

export type UpdatePaymentConfigQueryVariables = Exact<{
  gst: Scalars['Boolean'];
}>;


export type UpdatePaymentConfigQuery = { __typename?: 'Query', updatePaymentConfig: boolean };

export type UpdateFreeUserQueryVariables = Exact<{
  free: Scalars['Boolean'];
  updateFreeUserId: Scalars['String'];
}>;


export type UpdateFreeUserQuery = { __typename?: 'Query', updateFreeUser: boolean };

export const ServicesFragmentDoc = gql`
    fragment services on UserServices {
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
    main
  }
  deliveryDays
  updatedAt
  createdAt
  projectName
  paid
  assignedTo {
    _id
    name
  }
  assignedBy {
    _id
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
    revisionFor
    revisionTime
  }
  status {
    name
    state
  }
  deliveryFileFormat
  uploadFileFormat
  uploadedFiles
  reupload
  notes
  submissionDate
  estDeliveryDate
  assignedTime
  deliveredFiles
  revisionNotesByMaster
  revisionTimeByMaster
  numberOfRevisionsByMaster
  masterProjectApprovalTime
  completionDate
  addOnExportsBusStems
  addOnExportsFile
  addOnExportsMultitrack
  addOnExtraRevision
  paidAt
  wrokingFile
}
    `;
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
      main
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
    free
    services {
      _id
      statusType
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
    ...services
  }
}
    ${ServicesFragmentDoc}`;

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
export const GetAllServiceForMasterDocument = gql`
    query GetAllServiceForMaster {
  getAllServiceForMaster {
    ...services
  }
}
    ${ServicesFragmentDoc}`;

/**
 * __useGetAllServiceForMasterQuery__
 *
 * To run a query within a React component, call `useGetAllServiceForMasterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllServiceForMasterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllServiceForMasterQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllServiceForMasterQuery(baseOptions?: Apollo.QueryHookOptions<GetAllServiceForMasterQuery, GetAllServiceForMasterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllServiceForMasterQuery, GetAllServiceForMasterQueryVariables>(GetAllServiceForMasterDocument, options);
      }
export function useGetAllServiceForMasterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllServiceForMasterQuery, GetAllServiceForMasterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllServiceForMasterQuery, GetAllServiceForMasterQueryVariables>(GetAllServiceForMasterDocument, options);
        }
export type GetAllServiceForMasterQueryHookResult = ReturnType<typeof useGetAllServiceForMasterQuery>;
export type GetAllServiceForMasterLazyQueryHookResult = ReturnType<typeof useGetAllServiceForMasterLazyQuery>;
export type GetAllServiceForMasterQueryResult = Apollo.QueryResult<GetAllServiceForMasterQuery, GetAllServiceForMasterQueryVariables>;
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
export const AllDashboardContentDocument = gql`
    query AllDashboardContent {
  allDashboardContent {
    _id
    lastUpdatedBy {
      name
    }
    createdBy {
      name
    }
    image
    active
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllDashboardContentQuery__
 *
 * To run a query within a React component, call `useAllDashboardContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllDashboardContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllDashboardContentQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllDashboardContentQuery(baseOptions?: Apollo.QueryHookOptions<AllDashboardContentQuery, AllDashboardContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllDashboardContentQuery, AllDashboardContentQueryVariables>(AllDashboardContentDocument, options);
      }
export function useAllDashboardContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllDashboardContentQuery, AllDashboardContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllDashboardContentQuery, AllDashboardContentQueryVariables>(AllDashboardContentDocument, options);
        }
export type AllDashboardContentQueryHookResult = ReturnType<typeof useAllDashboardContentQuery>;
export type AllDashboardContentLazyQueryHookResult = ReturnType<typeof useAllDashboardContentLazyQuery>;
export type AllDashboardContentQueryResult = Apollo.QueryResult<AllDashboardContentQuery, AllDashboardContentQueryVariables>;
export const AddDashboardContentDocument = gql`
    query AddDashboardContent($input: DashboardContentInput!) {
  addDashboardContent(input: $input) {
    _id
    lastUpdatedBy {
      name
    }
    createdBy {
      name
    }
    image
    active
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAddDashboardContentQuery__
 *
 * To run a query within a React component, call `useAddDashboardContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddDashboardContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddDashboardContentQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddDashboardContentQuery(baseOptions: Apollo.QueryHookOptions<AddDashboardContentQuery, AddDashboardContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddDashboardContentQuery, AddDashboardContentQueryVariables>(AddDashboardContentDocument, options);
      }
export function useAddDashboardContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddDashboardContentQuery, AddDashboardContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddDashboardContentQuery, AddDashboardContentQueryVariables>(AddDashboardContentDocument, options);
        }
export type AddDashboardContentQueryHookResult = ReturnType<typeof useAddDashboardContentQuery>;
export type AddDashboardContentLazyQueryHookResult = ReturnType<typeof useAddDashboardContentLazyQuery>;
export type AddDashboardContentQueryResult = Apollo.QueryResult<AddDashboardContentQuery, AddDashboardContentQueryVariables>;
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
export const DashboardDocument = gql`
    query Dashboard {
  dashboardMet {
    label
    data
  }
}
    `;

/**
 * __useDashboardQuery__
 *
 * To run a query within a React component, call `useDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardQuery({
 *   variables: {
 *   },
 * });
 */
export function useDashboardQuery(baseOptions?: Apollo.QueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
      }
export function useDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
        }
export type DashboardQueryHookResult = ReturnType<typeof useDashboardQuery>;
export type DashboardLazyQueryHookResult = ReturnType<typeof useDashboardLazyQuery>;
export type DashboardQueryResult = Apollo.QueryResult<DashboardQuery, DashboardQueryVariables>;
export const GetS3SignedUrlDocument = gql`
    query GetS3SignedURL($fileName: String!) {
  getS3SignedURL(fileName: $fileName)
}
    `;

/**
 * __useGetS3SignedUrlQuery__
 *
 * To run a query within a React component, call `useGetS3SignedUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetS3SignedUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetS3SignedUrlQuery({
 *   variables: {
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useGetS3SignedUrlQuery(baseOptions: Apollo.QueryHookOptions<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>(GetS3SignedUrlDocument, options);
      }
export function useGetS3SignedUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>(GetS3SignedUrlDocument, options);
        }
export type GetS3SignedUrlQueryHookResult = ReturnType<typeof useGetS3SignedUrlQuery>;
export type GetS3SignedUrlLazyQueryHookResult = ReturnType<typeof useGetS3SignedUrlLazyQuery>;
export type GetS3SignedUrlQueryResult = Apollo.QueryResult<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>;
export const InitFileUploadDocument = gql`
    query InitFileUpload($fileName: String!) {
  initFileUpload(fileName: $fileName) {
    fileId
    fileKey
  }
}
    `;

/**
 * __useInitFileUploadQuery__
 *
 * To run a query within a React component, call `useInitFileUploadQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitFileUploadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitFileUploadQuery({
 *   variables: {
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useInitFileUploadQuery(baseOptions: Apollo.QueryHookOptions<InitFileUploadQuery, InitFileUploadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InitFileUploadQuery, InitFileUploadQueryVariables>(InitFileUploadDocument, options);
      }
export function useInitFileUploadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitFileUploadQuery, InitFileUploadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InitFileUploadQuery, InitFileUploadQueryVariables>(InitFileUploadDocument, options);
        }
export type InitFileUploadQueryHookResult = ReturnType<typeof useInitFileUploadQuery>;
export type InitFileUploadLazyQueryHookResult = ReturnType<typeof useInitFileUploadLazyQuery>;
export type InitFileUploadQueryResult = Apollo.QueryResult<InitFileUploadQuery, InitFileUploadQueryVariables>;
export const GetMultipartPreSignedUrlsDocument = gql`
    query GetMultipartPreSignedUrls($parts: Float!, $fileKey: String!, $fileId: String!) {
  getMultipartPreSignedUrls(parts: $parts, fileKey: $fileKey, fileId: $fileId) {
    signedUrl
    PartNumber
  }
}
    `;

/**
 * __useGetMultipartPreSignedUrlsQuery__
 *
 * To run a query within a React component, call `useGetMultipartPreSignedUrlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMultipartPreSignedUrlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMultipartPreSignedUrlsQuery({
 *   variables: {
 *      parts: // value for 'parts'
 *      fileKey: // value for 'fileKey'
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useGetMultipartPreSignedUrlsQuery(baseOptions: Apollo.QueryHookOptions<GetMultipartPreSignedUrlsQuery, GetMultipartPreSignedUrlsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMultipartPreSignedUrlsQuery, GetMultipartPreSignedUrlsQueryVariables>(GetMultipartPreSignedUrlsDocument, options);
      }
export function useGetMultipartPreSignedUrlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMultipartPreSignedUrlsQuery, GetMultipartPreSignedUrlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMultipartPreSignedUrlsQuery, GetMultipartPreSignedUrlsQueryVariables>(GetMultipartPreSignedUrlsDocument, options);
        }
export type GetMultipartPreSignedUrlsQueryHookResult = ReturnType<typeof useGetMultipartPreSignedUrlsQuery>;
export type GetMultipartPreSignedUrlsLazyQueryHookResult = ReturnType<typeof useGetMultipartPreSignedUrlsLazyQuery>;
export type GetMultipartPreSignedUrlsQueryResult = Apollo.QueryResult<GetMultipartPreSignedUrlsQuery, GetMultipartPreSignedUrlsQueryVariables>;
export const ApproveProjectDocument = gql`
    query ApproveProject($serviceId: String!) {
  approveProject(serviceId: $serviceId)
}
    `;

/**
 * __useApproveProjectQuery__
 *
 * To run a query within a React component, call `useApproveProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useApproveProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApproveProjectQuery({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useApproveProjectQuery(baseOptions: Apollo.QueryHookOptions<ApproveProjectQuery, ApproveProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApproveProjectQuery, ApproveProjectQueryVariables>(ApproveProjectDocument, options);
      }
export function useApproveProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApproveProjectQuery, ApproveProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApproveProjectQuery, ApproveProjectQueryVariables>(ApproveProjectDocument, options);
        }
export type ApproveProjectQueryHookResult = ReturnType<typeof useApproveProjectQuery>;
export type ApproveProjectLazyQueryHookResult = ReturnType<typeof useApproveProjectLazyQuery>;
export type ApproveProjectQueryResult = Apollo.QueryResult<ApproveProjectQuery, ApproveProjectQueryVariables>;
export const AddDeliveryFilesDocument = gql`
    query AddDeliveryFiles($url: String!, $serviceId: String!) {
  addDeliverFiles(url: $url, serviceId: $serviceId)
}
    `;

/**
 * __useAddDeliveryFilesQuery__
 *
 * To run a query within a React component, call `useAddDeliveryFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddDeliveryFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddDeliveryFilesQuery({
 *   variables: {
 *      url: // value for 'url'
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useAddDeliveryFilesQuery(baseOptions: Apollo.QueryHookOptions<AddDeliveryFilesQuery, AddDeliveryFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddDeliveryFilesQuery, AddDeliveryFilesQueryVariables>(AddDeliveryFilesDocument, options);
      }
export function useAddDeliveryFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddDeliveryFilesQuery, AddDeliveryFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddDeliveryFilesQuery, AddDeliveryFilesQueryVariables>(AddDeliveryFilesDocument, options);
        }
export type AddDeliveryFilesQueryHookResult = ReturnType<typeof useAddDeliveryFilesQuery>;
export type AddDeliveryFilesLazyQueryHookResult = ReturnType<typeof useAddDeliveryFilesLazyQuery>;
export type AddDeliveryFilesQueryResult = Apollo.QueryResult<AddDeliveryFilesQuery, AddDeliveryFilesQueryVariables>;
export const FinalizeMultipartUploadDocument = gql`
    query FinalizeMultipartUpload($input: FinalMultipartUploadInput!) {
  finalizeMultipartUpload(input: $input)
}
    `;

/**
 * __useFinalizeMultipartUploadQuery__
 *
 * To run a query within a React component, call `useFinalizeMultipartUploadQuery` and pass it any options that fit your needs.
 * When your component renders, `useFinalizeMultipartUploadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFinalizeMultipartUploadQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFinalizeMultipartUploadQuery(baseOptions: Apollo.QueryHookOptions<FinalizeMultipartUploadQuery, FinalizeMultipartUploadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FinalizeMultipartUploadQuery, FinalizeMultipartUploadQueryVariables>(FinalizeMultipartUploadDocument, options);
      }
export function useFinalizeMultipartUploadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FinalizeMultipartUploadQuery, FinalizeMultipartUploadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FinalizeMultipartUploadQuery, FinalizeMultipartUploadQueryVariables>(FinalizeMultipartUploadDocument, options);
        }
export type FinalizeMultipartUploadQueryHookResult = ReturnType<typeof useFinalizeMultipartUploadQuery>;
export type FinalizeMultipartUploadLazyQueryHookResult = ReturnType<typeof useFinalizeMultipartUploadLazyQuery>;
export type FinalizeMultipartUploadQueryResult = Apollo.QueryResult<FinalizeMultipartUploadQuery, FinalizeMultipartUploadQueryVariables>;
export const ConfirmUploadDocument = gql`
    query ConfirmUpload($deliveryDays: Float!, $serviceId: String!) {
  confirmUpload(deliveryDays: $deliveryDays, serviceId: $serviceId)
}
    `;

/**
 * __useConfirmUploadQuery__
 *
 * To run a query within a React component, call `useConfirmUploadQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfirmUploadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfirmUploadQuery({
 *   variables: {
 *      deliveryDays: // value for 'deliveryDays'
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useConfirmUploadQuery(baseOptions: Apollo.QueryHookOptions<ConfirmUploadQuery, ConfirmUploadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConfirmUploadQuery, ConfirmUploadQueryVariables>(ConfirmUploadDocument, options);
      }
export function useConfirmUploadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConfirmUploadQuery, ConfirmUploadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConfirmUploadQuery, ConfirmUploadQueryVariables>(ConfirmUploadDocument, options);
        }
export type ConfirmUploadQueryHookResult = ReturnType<typeof useConfirmUploadQuery>;
export type ConfirmUploadLazyQueryHookResult = ReturnType<typeof useConfirmUploadLazyQuery>;
export type ConfirmUploadQueryResult = Apollo.QueryResult<ConfirmUploadQuery, ConfirmUploadQueryVariables>;
export const RequestReuploadDocument = gql`
    query RequestReupload($reuploadNote: String!, $serviceId: String!) {
  requestReupload(reuploadNote: $reuploadNote, serviceId: $serviceId)
}
    `;

/**
 * __useRequestReuploadQuery__
 *
 * To run a query within a React component, call `useRequestReuploadQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestReuploadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestReuploadQuery({
 *   variables: {
 *      reuploadNote: // value for 'reuploadNote'
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useRequestReuploadQuery(baseOptions: Apollo.QueryHookOptions<RequestReuploadQuery, RequestReuploadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RequestReuploadQuery, RequestReuploadQueryVariables>(RequestReuploadDocument, options);
      }
export function useRequestReuploadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RequestReuploadQuery, RequestReuploadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RequestReuploadQuery, RequestReuploadQueryVariables>(RequestReuploadDocument, options);
        }
export type RequestReuploadQueryHookResult = ReturnType<typeof useRequestReuploadQuery>;
export type RequestReuploadLazyQueryHookResult = ReturnType<typeof useRequestReuploadLazyQuery>;
export type RequestReuploadQueryResult = Apollo.QueryResult<RequestReuploadQuery, RequestReuploadQueryVariables>;
export const LogoutDocument = gql`
    query Logout {
  adminLogout
}
    `;

/**
 * __useLogoutQuery__
 *
 * To run a query within a React component, call `useLogoutQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogoutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogoutQuery({
 *   variables: {
 *   },
 * });
 */
export function useLogoutQuery(baseOptions?: Apollo.QueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
      }
export function useLogoutLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
        }
export type LogoutQueryHookResult = ReturnType<typeof useLogoutQuery>;
export type LogoutLazyQueryHookResult = ReturnType<typeof useLogoutLazyQuery>;
export type LogoutQueryResult = Apollo.QueryResult<LogoutQuery, LogoutQueryVariables>;
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
  meAdmin {
    _id
    name
    type
  }
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
export const UploadRevisionFilesDocument = gql`
    mutation UploadRevisionFiles($revisionNumber: Float!, $fileUrl: String!, $serviceId: String!) {
  uploadRevisionFiles(
    revisionNumber: $revisionNumber
    fileUrl: $fileUrl
    serviceId: $serviceId
  )
}
    `;
export type UploadRevisionFilesMutationFn = Apollo.MutationFunction<UploadRevisionFilesMutation, UploadRevisionFilesMutationVariables>;

/**
 * __useUploadRevisionFilesMutation__
 *
 * To run a mutation, you first call `useUploadRevisionFilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadRevisionFilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadRevisionFilesMutation, { data, loading, error }] = useUploadRevisionFilesMutation({
 *   variables: {
 *      revisionNumber: // value for 'revisionNumber'
 *      fileUrl: // value for 'fileUrl'
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useUploadRevisionFilesMutation(baseOptions?: Apollo.MutationHookOptions<UploadRevisionFilesMutation, UploadRevisionFilesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadRevisionFilesMutation, UploadRevisionFilesMutationVariables>(UploadRevisionFilesDocument, options);
      }
export type UploadRevisionFilesMutationHookResult = ReturnType<typeof useUploadRevisionFilesMutation>;
export type UploadRevisionFilesMutationResult = Apollo.MutationResult<UploadRevisionFilesMutation>;
export type UploadRevisionFilesMutationOptions = Apollo.BaseMutationOptions<UploadRevisionFilesMutation, UploadRevisionFilesMutationVariables>;
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
export const GetContentUploadUrlDocument = gql`
    query GetContentUploadUrl($fileName: String!) {
  getContentUploadUrl(fileName: $fileName)
}
    `;

/**
 * __useGetContentUploadUrlQuery__
 *
 * To run a query within a React component, call `useGetContentUploadUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContentUploadUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContentUploadUrlQuery({
 *   variables: {
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useGetContentUploadUrlQuery(baseOptions: Apollo.QueryHookOptions<GetContentUploadUrlQuery, GetContentUploadUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetContentUploadUrlQuery, GetContentUploadUrlQueryVariables>(GetContentUploadUrlDocument, options);
      }
export function useGetContentUploadUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetContentUploadUrlQuery, GetContentUploadUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetContentUploadUrlQuery, GetContentUploadUrlQueryVariables>(GetContentUploadUrlDocument, options);
        }
export type GetContentUploadUrlQueryHookResult = ReturnType<typeof useGetContentUploadUrlQuery>;
export type GetContentUploadUrlLazyQueryHookResult = ReturnType<typeof useGetContentUploadUrlLazyQuery>;
export type GetContentUploadUrlQueryResult = Apollo.QueryResult<GetContentUploadUrlQuery, GetContentUploadUrlQueryVariables>;
export const ResetPasswordDocument = gql`
    query ResetPassword($password: String!, $resetPasswordId: String!) {
  resetPassword(password: $password, id: $resetPasswordId)
}
    `;

/**
 * __useResetPasswordQuery__
 *
 * To run a query within a React component, call `useResetPasswordQuery` and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResetPasswordQuery({
 *   variables: {
 *      password: // value for 'password'
 *      resetPasswordId: // value for 'resetPasswordId'
 *   },
 * });
 */
export function useResetPasswordQuery(baseOptions: Apollo.QueryHookOptions<ResetPasswordQuery, ResetPasswordQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResetPasswordQuery, ResetPasswordQueryVariables>(ResetPasswordDocument, options);
      }
export function useResetPasswordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResetPasswordQuery, ResetPasswordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResetPasswordQuery, ResetPasswordQueryVariables>(ResetPasswordDocument, options);
        }
export type ResetPasswordQueryHookResult = ReturnType<typeof useResetPasswordQuery>;
export type ResetPasswordLazyQueryHookResult = ReturnType<typeof useResetPasswordLazyQuery>;
export type ResetPasswordQueryResult = Apollo.QueryResult<ResetPasswordQuery, ResetPasswordQueryVariables>;
export const AddRevisionNotesByMasterDocument = gql`
    query AddRevisionNotesByMaster($note: String!, $serviceId: String!) {
  addRevisionNotesByMaster(note: $note, serviceId: $serviceId)
}
    `;

/**
 * __useAddRevisionNotesByMasterQuery__
 *
 * To run a query within a React component, call `useAddRevisionNotesByMasterQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddRevisionNotesByMasterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddRevisionNotesByMasterQuery({
 *   variables: {
 *      note: // value for 'note'
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useAddRevisionNotesByMasterQuery(baseOptions: Apollo.QueryHookOptions<AddRevisionNotesByMasterQuery, AddRevisionNotesByMasterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddRevisionNotesByMasterQuery, AddRevisionNotesByMasterQueryVariables>(AddRevisionNotesByMasterDocument, options);
      }
export function useAddRevisionNotesByMasterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddRevisionNotesByMasterQuery, AddRevisionNotesByMasterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddRevisionNotesByMasterQuery, AddRevisionNotesByMasterQueryVariables>(AddRevisionNotesByMasterDocument, options);
        }
export type AddRevisionNotesByMasterQueryHookResult = ReturnType<typeof useAddRevisionNotesByMasterQuery>;
export type AddRevisionNotesByMasterLazyQueryHookResult = ReturnType<typeof useAddRevisionNotesByMasterLazyQuery>;
export type AddRevisionNotesByMasterQueryResult = Apollo.QueryResult<AddRevisionNotesByMasterQuery, AddRevisionNotesByMasterQueryVariables>;
export const GetAllPaymentConfigDocument = gql`
    query GetAllPaymentConfig {
  getAllPaymentConfig {
    _id
    type
    value
    active
    lastUpdatedBy {
      name
    }
    updatedAt
  }
}
    `;

/**
 * __useGetAllPaymentConfigQuery__
 *
 * To run a query within a React component, call `useGetAllPaymentConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPaymentConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPaymentConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPaymentConfigQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPaymentConfigQuery, GetAllPaymentConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPaymentConfigQuery, GetAllPaymentConfigQueryVariables>(GetAllPaymentConfigDocument, options);
      }
export function useGetAllPaymentConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPaymentConfigQuery, GetAllPaymentConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPaymentConfigQuery, GetAllPaymentConfigQueryVariables>(GetAllPaymentConfigDocument, options);
        }
export type GetAllPaymentConfigQueryHookResult = ReturnType<typeof useGetAllPaymentConfigQuery>;
export type GetAllPaymentConfigLazyQueryHookResult = ReturnType<typeof useGetAllPaymentConfigLazyQuery>;
export type GetAllPaymentConfigQueryResult = Apollo.QueryResult<GetAllPaymentConfigQuery, GetAllPaymentConfigQueryVariables>;
export const UpdatePaymentConfigDocument = gql`
    query UpdatePaymentConfig($gst: Boolean!) {
  updatePaymentConfig(gst: $gst)
}
    `;

/**
 * __useUpdatePaymentConfigQuery__
 *
 * To run a query within a React component, call `useUpdatePaymentConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpdatePaymentConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdatePaymentConfigQuery({
 *   variables: {
 *      gst: // value for 'gst'
 *   },
 * });
 */
export function useUpdatePaymentConfigQuery(baseOptions: Apollo.QueryHookOptions<UpdatePaymentConfigQuery, UpdatePaymentConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpdatePaymentConfigQuery, UpdatePaymentConfigQueryVariables>(UpdatePaymentConfigDocument, options);
      }
export function useUpdatePaymentConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpdatePaymentConfigQuery, UpdatePaymentConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpdatePaymentConfigQuery, UpdatePaymentConfigQueryVariables>(UpdatePaymentConfigDocument, options);
        }
export type UpdatePaymentConfigQueryHookResult = ReturnType<typeof useUpdatePaymentConfigQuery>;
export type UpdatePaymentConfigLazyQueryHookResult = ReturnType<typeof useUpdatePaymentConfigLazyQuery>;
export type UpdatePaymentConfigQueryResult = Apollo.QueryResult<UpdatePaymentConfigQuery, UpdatePaymentConfigQueryVariables>;
export const UpdateFreeUserDocument = gql`
    query UpdateFreeUser($free: Boolean!, $updateFreeUserId: String!) {
  updateFreeUser(free: $free, id: $updateFreeUserId)
}
    `;

/**
 * __useUpdateFreeUserQuery__
 *
 * To run a query within a React component, call `useUpdateFreeUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpdateFreeUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdateFreeUserQuery({
 *   variables: {
 *      free: // value for 'free'
 *      updateFreeUserId: // value for 'updateFreeUserId'
 *   },
 * });
 */
export function useUpdateFreeUserQuery(baseOptions: Apollo.QueryHookOptions<UpdateFreeUserQuery, UpdateFreeUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpdateFreeUserQuery, UpdateFreeUserQueryVariables>(UpdateFreeUserDocument, options);
      }
export function useUpdateFreeUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpdateFreeUserQuery, UpdateFreeUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpdateFreeUserQuery, UpdateFreeUserQueryVariables>(UpdateFreeUserDocument, options);
        }
export type UpdateFreeUserQueryHookResult = ReturnType<typeof useUpdateFreeUserQuery>;
export type UpdateFreeUserLazyQueryHookResult = ReturnType<typeof useUpdateFreeUserLazyQuery>;
export type UpdateFreeUserQueryResult = Apollo.QueryResult<UpdateFreeUserQuery, UpdateFreeUserQueryVariables>;