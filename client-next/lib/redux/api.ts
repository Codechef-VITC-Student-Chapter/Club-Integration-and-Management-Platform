import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  // Auth types
  UserSignUpInfo,
  UserLoginInfo,
  AuthResponse,
  SetNewPassInfo,

  // User types
  GetUserResponse,
  GetUserContributionsResponse,
  GetLeadUserRequestsResponse,
  UploadMembersHandlesInfo,
  MakeUserLeadResponse,

  // Club types
  ClubInfoResponse,
  AllClubMembersResponse,
  AllClubDepartmentsResponse,

  // Department types
  DepartmentInfoResponse,
  DepartmentLeadsResponse,

  // Contribution types
  CreateContributionInfo,
  ContributionUpdateInfo,
  ContributionStatusInfo,
  AddContributionIDUserInfo,
  AddContributionResponse,
  MessageResponse,
} from "../../types/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Club", "Department", "Contribution"],
  endpoints: (builder) => ({
    // Auth Routes
    signup: builder.mutation<AuthResponse, UserSignUpInfo>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation<AuthResponse, UserLoginInfo>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    sendOTP: builder.query<MessageResponse, string>({
      query: (regNumber) => `/auth/send/otp/${regNumber}`,
    }),

    setNewPassword: builder.mutation<MessageResponse, SetNewPassInfo>({
      query: (passwordData) => ({
        url: "/auth/set/pass",
        method: "PATCH",
        body: passwordData,
      }),
    }),

    // User Routes
    getUserInfo: builder.query<GetUserResponse, string>({
      query: (userId) => `/user/info/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    getUserContributions: builder.query<GetUserContributionsResponse, string>({
      query: (userId) => `/user/contributions/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "Contribution", id: "LIST" },
        { type: "User", id: userId },
      ],
    }),

    getLeadUserRequests: builder.query<GetLeadUserRequestsResponse, string>({
      query: (userId) => `/user/lead/requests/${userId}`,
      providesTags: [{ type: "Contribution", id: "REQUESTS" }],
    }),

    uploadClubMembersHandles: builder.mutation<
      MessageResponse,
      UploadMembersHandlesInfo
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("lead_user_id", data.lead_user_id);
        formData.append("csv_file", data.csv_file);

        return {
          url: "/user/lead/upload/handles",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Club Routes
    getClubInfo: builder.query<ClubInfoResponse, string>({
      query: (clubId) => `/club/info/${clubId}`,
      providesTags: (result, error, clubId) => [{ type: "Club", id: clubId }],
    }),

    getAllClubMembers: builder.query<AllClubMembersResponse, string>({
      query: (clubId) => `/club/info/all/members/${clubId}`,
      providesTags: (result, error, clubId) => [
        { type: "User", id: "LIST" },
        { type: "Club", id: clubId },
      ],
    }),

    getAllClubDepartments: builder.query<AllClubDepartmentsResponse, string>({
      query: (clubId) => `/club/info/all/departments/${clubId}`,
      providesTags: (result, error, clubId) => [
        { type: "Department", id: "LIST" },
        { type: "Club", id: clubId },
      ],
    }),

    // Department Routes
    getDepartmentInfo: builder.query<DepartmentInfoResponse, string>({
      query: (deptId) => `/department/info/${deptId}`,
      providesTags: (result, error, deptId) => [
        { type: "Department", id: deptId },
      ],
    }),

    getDepartmentLeads: builder.query<DepartmentLeadsResponse, string>({
      query: (deptId) => `/department/leads/${deptId}`,
      providesTags: (result, error, deptId) => [
        { type: "Department", id: deptId },
      ],
    }),

    // Contribution Routes
    addContribution: builder.mutation<
      AddContributionResponse,
      CreateContributionInfo
    >({
      query: (contributionData) => ({
        url: "/contribution/add",
        method: "POST",
        body: contributionData,
      }),
      invalidatesTags: [
        { type: "Contribution", id: "LIST" },
        { type: "User", id: "LIST" },
      ],
    }),

    updateContributionDetails: builder.mutation<
      MessageResponse,
      ContributionUpdateInfo
    >({
      query: (updateData) => ({
        url: "/contribution/update/details",
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: (result, error, { cont_id }) => [
        { type: "Contribution", id: cont_id },
        { type: "Contribution", id: "LIST" },
      ],
    }),

    updateContributionStatus: builder.mutation<
      MessageResponse,
      ContributionStatusInfo
    >({
      query: (statusData) => ({
        url: "/contribution/update/status",
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: [
        { type: "Contribution", id: "LIST" },
        { type: "Contribution", id: "REQUESTS" },
      ],
    }),

    addContributionToUser: builder.mutation<
      MessageResponse,
      AddContributionIDUserInfo
    >({
      query: (data) => ({
        url: "/contribution/add/id/user",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { user_id }) => [
        { type: "User", id: user_id },
        { type: "Contribution", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth hooks
  useSignupMutation,
  useLoginMutation,
  useLazySendOTPQuery,
  useSetNewPasswordMutation,

  // User hooks
  useGetUserInfoQuery,
  useGetUserContributionsQuery,
  useGetLeadUserRequestsQuery,
  useUploadClubMembersHandlesMutation,

  // Club hooks
  useGetClubInfoQuery,
  useGetAllClubMembersQuery,
  useGetAllClubDepartmentsQuery,

  // Department hooks
  useGetDepartmentInfoQuery,
  useGetDepartmentLeadsQuery,

  // Contribution hooks
  useAddContributionMutation,
  useUpdateContributionDetailsMutation,
  useUpdateContributionStatusMutation,
  useAddContributionToUserMutation,
} = api;
