import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Tags} from "../utils/enum";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/',
        prepareHeaders(headers) {
            return headers
        }
    }),
    tagTypes: [Tags.CAR_INVENTORY, Tags.CUSTOMER, Tags.RENTAL, Tags.BRAND_OPTION, Tags.MODEL_OPTION, Tags.PAYMENT, Tags.CUSTOMER_DETAIL, Tags.VEHICLE],
    endpoints(builder) {
        return {
            fetchCustomers: builder.query({
                query(query) {
                    return `/customer/?page=${query.page}&size=${query.size}&search=${query.search}`
                },
                providesTags: [Tags.CUSTOMER],
            }),
            authorizeUser: builder.query({
                query(token) {
                    return {
                        headers: {
                            Authorization: "Bearer " + token
                        },
                        url: '/auth/current-user/'
                    }
                }
            }),
            fetchVehicles: builder.query({
                query(query) {
                    return `/vehicle`
                },
                providesTags: [Tags.VEHICLE]
            }),
            fetchCarInventory: builder.query({
                query(query) {
                    if (query.search && query.search.length > 0) {
                        return `/car-inventory?page=${query.page}&size=${query.size}&search=${query.search}`
                    } else {
                        return `/car-inventory?page=${query.page}&size=${query.size}`
                    }
                },
                providesTags: [Tags.CAR_INVENTORY],
            }),
            createBrand: builder.mutation({
                query(data) {
                    return {
                        url: '/vehicle/brand',
                        method: 'POST',
                        body: { name: data.name}
                    }
                },
                invalidatesTags: [Tags.BRAND_OPTION, Tags.VEHICLE],
            }),
            createModel: builder.mutation({
                query(data) {
                    return {
                        url: `/vehicle/model/${data.id}`,
                        method: 'POST',
                        body: { name: data.name }
                    }
                },
                invalidatesTags: [Tags.MODEL_OPTION, Tags.VEHICLE],
            }),
            createYear: builder.mutation({
                query(data) {
                    return {
                        url: `/vehicle/year/${data.id}`,
                        method: 'POST',
                        body: { name: data.name }
                    }
                },
                invalidatesTags: [Tags.VEHICLE]
            }),
            createCarInventory: builder.mutation({
                query(data) {
                    return {
                        url: `/car-inventory`,
                        method: 'POST',
                        body: data
                    }
                },
                invalidatesTags: [Tags.CAR_INVENTORY],
            }),
            createCustomer: builder.mutation({
                query(data) {
                    return {
                        url: '/customer',
                        method: 'POST',
                        body: data
                    }
                },
                invalidatesTags: [Tags.CUSTOMER],
            }),
            updateCarInventory: builder.mutation({
               query(body) {
                   return {
                       url: `/car-inventory/${body.id}`,
                       method: 'PUT',
                       body: body.data
                   }
               },
                invalidatesTags: [Tags.CAR_INVENTORY, Tags.RENTAL],
            }),
            updateCustomer: builder.mutation({
                query(body) {
                    return {
                        url: `/customer/${body.id}`,
                        method: 'PUT',
                        body: body.data
                    }
                },
                invalidatesTags: [Tags.CUSTOMER, Tags.CUSTOMER_DETAIL],
            }),
            createRental: builder.mutation({
                query(data) {
                    return {
                        url: `/rental`,
                        method: 'POST',
                        body: data
                    }
                },
                invalidatesTags: [Tags.RENTAL, Tags.CUSTOMER_DETAIL],
            }),
            fetchActiveDailyRental: builder.query({
                query(query) {
                    return `/rental-active-daily?page=${query.page}&size=${query.size}&search=${query.search}`
                },
                providesTags: [Tags.RENTAL],
            }),
            fetchActiveMonthlyRental: builder.query({
                query(query) {
                    return `/rental-active-monthly?page=${query.page}&size=${query.size}&search=${query.search}`
                },
                providesTags: [Tags.RENTAL],
            }),
            fetchInActiveDailyRental: builder.query({
                query(query) {
                    return `/rental-inactive-daily?page=${query.page}&size=${query.size}&search=${query.search}`
                },
                providesTags: [Tags.RENTAL],
            }),
            fetchInActiveMonthlyRental: builder.query({
                query(query) {
                    return `/rental-inactive-monthly?page=${query.page}&size=${query.size}&search=${query.search}`
                },
                providesTags: [Tags.RENTAL],
            }),
            createPayment: builder.mutation({
                query(data) {
                    return {
                        url: `/payment`,
                        method: 'POST',
                        body: data
                    }
                },
                invalidatesTags: [Tags.PAYMENT, Tags.RENTAL]
            }),
            fetchPayment: builder.query({
                query({ params, page, size }) {
                    return `/payment/${params}?page=${page}&size=${size}`
                },
                providesTags: [Tags.PAYMENT]
            }),
            fetchPaymentSum: builder.query({
                query({ params }) {
                    return `/payment-sum/${params}`
                },
                providesTags: [Tags.PAYMENT]
            }),
            fetchRentalByCustomer: builder.query({
                query({ params, page, size }) {
                    return `/customer-rental/${params}?page=${page}&size=${size}`
                },
                providesTags: [Tags.CUSTOMER_DETAIL, Tags.RENTAL]
            }),
            fetchInActiveRentalByCustomer: builder.query({
                query({ params, page, size }) {
                    return `/customer-inactive-rental/${params}?page=${page}&size=${size}`
                },
                providesTags: [Tags.CUSTOMER_DETAIL, Tags.RENTAL]
            }),
            fetchCustomerAndItsRentalCount: builder.query({
                query({ params }) {
                    return `/customer-rental-count/${params}`
                },
                providesTags: [Tags.CUSTOMER_DETAIL]
            }),
            createCloseRental: builder.mutation({
                query({ params, data }) {
                    return {
                        url: `/rental/${params}`,
                        method: 'POST',
                        body: data
                    }
                },
                invalidatesTags: [Tags.PAYMENT, Tags.RENTAL, Tags.CAR_INVENTORY]
            }),
            fetchBrandOption: builder.query({
                query(arg) {
                    return `/vehicle/brand-options`
                },
                providesTags: [Tags.BRAND_OPTION],
            }),
            fetchModelOption: builder.query({
                query(arg) {
                    return `/vehicle/model-options`
                },
                providesTags: [Tags.MODEL_OPTION],
            }),
            fetchRentalById: builder.query({
                query(params) {
                    return `/rental/${params}`
                },
                providesTags: [Tags.RENTAL]
            }),
            editRentalById: builder.mutation({
                query(params) {
                    return {
                        url: `/rental/${params.id}`,
                        method: 'PUT',
                        body: {
                            vehicleId: params.data,
                            tariff: params.tariff
                        }
                    }
                },
                invalidatesTags: [Tags.RENTAL, Tags.CAR_INVENTORY]
            }),
            updateVehicle: builder.mutation({
                query(params) {
                    return {
                        url: `/vehicle/${params.id}`,
                        method: 'PUT',
                        body: {
                            name: params.data,
                        }
                    }
                },
                invalidatesTags: [Tags.VEHICLE, Tags.CAR_INVENTORY, Tags.MODEL_OPTION, Tags.BRAND_OPTION]
            }),
            createExpense: builder.mutation({
                query(data) {
                    return {
                        url: `/expense`,
                        method: 'POST',
                        body: data
                    }
                }
            }),
            rentalDailyIncremental: builder.mutation({
                query() {
                    return {
                        url: `/rental-daily-incremental`,
                        method: 'PUT'
                    }
                },
                invalidatesTags: [Tags.RENTAL]
            }),

            rentalMonthlyIncremental: builder.mutation({
                query(arg) {
                    return {
                        url: '/rental-monthly-incremental',
                        method: 'PUT'
                    }
                },
                invalidatesTags: [Tags.RENTAL]
            }),

            deleteRentalById: builder.mutation({
                query(rentalId){
                    return {
                        url: `/rental/${rentalId}`,
                        method: "DELETE"
                    }
                },
                invalidatesTags: [Tags.RENTAL],
            })
        }
    }
})

export const {
    useFetchCustomersQuery,
    useAuthorizeUserQuery,
    useFetchVehiclesQuery,
    useFetchCarInventoryQuery,
    useCreateBrandMutation,
    useCreateModelMutation,
    useCreateYearMutation,
    useCreateCarInventoryMutation,
    useCreateCustomerMutation,
    useUpdateCarInventoryMutation,
    useRentalDailyIncrementalMutation,
    useRentalMonthlyIncrementalMutation,
    useUpdateCustomerMutation,
    useCreateRentalMutation,
    useFetchActiveDailyRentalQuery,
    useFetchActiveMonthlyRentalQuery,
    useFetchInActiveDailyRentalQuery,
    useFetchInActiveMonthlyRentalQuery,
    useCreatePaymentMutation,
    useFetchPaymentQuery,
    useFetchPaymentSumQuery,
    useFetchRentalByCustomerQuery,
    useFetchCustomerAndItsRentalCountQuery,
    useCreateCloseRentalMutation,
    useFetchInActiveRentalByCustomerQuery,
    useFetchBrandOptionQuery,
    useFetchModelOptionQuery,
    useFetchRentalByIdQuery,
    useEditRentalByIdMutation,
    useUpdateVehicleMutation,
    useCreateExpenseMutation,
    useDeleteRentalByIdMutation
} = apiSlice;
