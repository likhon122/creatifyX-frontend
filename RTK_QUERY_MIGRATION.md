# RTK Query Migration Guide

## Overview

Your application has been successfully migrated from Axios/Redux Thunk to RTK Query. All API calls now use RTK Query hooks which provide automatic caching, refetching, and state management.

## Key Benefits

- ✅ Automatic caching and cache invalidation
- ✅ Loading and error states handled automatically
- ✅ Request deduplication
- ✅ Optimistic updates support
- ✅ Automatic refetching on focus/reconnect
- ✅ TypeScript support with full type inference

## Setup Complete

- Redux store configured with RTK Query
- ReduxProvider added to layout
- All API services converted to RTK Query endpoints
- Auth token management with automatic retry on 401

## Usage Examples

### 1. Query (GET) - Fetching Data

**Before (Axios):**

```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await assetApi.getAssets();
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**After (RTK Query):**

```tsx
import { useGetAssetsQuery } from "@/services";

const { data, isLoading, isError, error } = useGetAssetsQuery({
  page: 1,
  limit: 10,
  assetType: "image",
});

// Access data directly
const assets = data?.data || [];
```

### 2. Mutation (POST/PUT/PATCH/DELETE) - Modifying Data

**Before (Axios):**

```tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (formData) => {
  setLoading(true);
  try {
    await authApi.login(formData);
    toast.success("Login successful");
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
```

**After (RTK Query):**

```tsx
import { useLoginMutation } from "@/services";

const [login, { isLoading, isError, error }] = useLoginMutation();

const handleSubmit = async (formData) => {
  try {
    await login(formData).unwrap();
    toast.success("Login successful");
  } catch (err) {
    toast.error(err.message);
  }
};
```

### 3. With Filters/Params

```tsx
import { useGetAssetsQuery } from "@/services";

const BrowsePage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    assetType: "image",
    categories: "design,graphics",
  });

  const { data, isLoading, isFetching, refetch } = useGetAssetsQuery(filters);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data?.data.map((asset) => <AssetCard key={asset._id} asset={asset} />)
      )}
    </>
  );
};
```

### 4. Conditional Fetching (Skip)

```tsx
import { useGetUserQuery } from "@/services";

const Profile = ({ userId }) => {
  // Only fetch when userId is available
  const { data } = useGetUserQuery(userId, {
    skip: !userId,
  });
};
```

### 5. Refetching Data

```tsx
import { useGetAssetsQuery } from "@/services";

const { data, refetch } = useGetAssetsQuery();

// Manual refetch
<button onClick={() => refetch()}>Refresh</button>;
```

### 6. Polling (Auto-refetch)

```tsx
import { useGetDashboardQuery } from "@/services";

// Refetch every 30 seconds
const { data } = useGetDashboardQuery(undefined, {
  pollingInterval: 30000,
});
```

### 7. File Upload

```tsx
import { useCreateAssetMutation } from "@/services";

const [uploadAsset, { isLoading }] = useCreateAssetMutation();

const handleUpload = async (formData: FormData) => {
  try {
    const result = await uploadAsset(formData).unwrap();
    toast.success("Asset uploaded successfully");
  } catch (error) {
    toast.error("Upload failed");
  }
};
```

### 8. Optimistic Updates

```tsx
import { useToggleLikeMutation } from "@/services";

const [toggleLike] = useToggleLikeMutation();

const handleLike = async (assetId: string) => {
  try {
    await toggleLike({ assetId }).unwrap();
  } catch (error) {
    // Error will auto-revert optimistic update
  }
};
```

## Available Hooks

### Auth

- `useSignupMutation()`
- `useRegisterUserMutation()`
- `useLoginMutation()`
- `useVerifyOtpMutation()`
- `useLogoutMutation()`
- `useChangePasswordMutation()`
- `useForgotPasswordMutation()`
- `useResetPasswordMutation()`

### User

- `useGetMeQuery()`
- `useGetProfileQuery()`
- `useGetUserQuery(id)`
- `useGetUsersQuery(filters)`
- `useUpdateProfileMutation()`
- `useChangeUserStatusMutation()`

### Asset

- `useGetAssetsQuery(filters)`
- `useGetMyAssetsQuery(filters)`
- `useGetAssetQuery(id)`
- `useCreateAssetMutation()`
- `useUpdateAssetMutation()`
- `useIncrementViewMutation()`
- `useToggleLikeMutation()`
- `useRecordDownloadMutation()`
- `useGetAssetStatsQuery(assetId)`

### Category

- `useGetCategoriesQuery(params)`
- `useGetCategoryQuery(id)`
- `useCreateCategoryMutation()`
- `useUpdateCategoryMutation()`

### Plan

- `useGetPlansQuery()`
- `useCreatePlanMutation()`
- `useUpdatePlanMutation()`

### Subscription

- `useCreateCheckoutMutation()`
- `useVerifyCheckoutMutation()`
- `useGetSubscriptionsQuery(filters)`
- `useGetSubscriptionQuery(id)`
- `useUpdateSubscriptionMutation()`

### Review

- `useGetAssetReviewsQuery({ assetId, page, limit })`
- `useGetReviewQuery(id)`
- `useCreateReviewMutation()`
- `useReplyToReviewMutation()`
- `useDeleteReviewMutation()`

### Payment

- `useCreatePaymentCheckoutMutation()`
- `useVerifyPaymentSessionMutation()`
- `useGetPaymentHistoryQuery(filters)`
- `useCheckPurchaseQuery(assetId)`

### Dashboard

- `useGetAuthorAnalyticsQuery()`
- `useGetAdminAnalyticsQuery()`
- `useBackfillEarningsMutation()`

### Contact

- `useGetContactStatsQuery()`
- `useGetContactsQuery(filters)`
- `useGetContactQuery(id)`
- `useCreateContactMutation()`
- `useReplyToContactMutation()`
- `useUpdateContactStatusMutation()`
- `useDeleteContactMutation()`

## Common Patterns

### Loading States

```tsx
const { data, isLoading, isFetching, isSuccess, isError } = useGetAssetsQuery();

// isLoading: First time loading
// isFetching: Loading (including background refetch)
// isSuccess: Successfully loaded
// isError: Error occurred
```

### Error Handling

```tsx
const { error, isError } = useGetAssetsQuery();

if (isError) {
  console.error(error);
  // error.status - HTTP status code
  // error.data - Error response data
}
```

### Cache Invalidation

Caches are automatically invalidated using tags. When you create/update/delete, related queries refetch automatically.

## Migration Notes

1. **Old service files kept**: Original `.service.ts` files are preserved as reference
2. **New API files**: New `.api.ts` files contain RTK Query endpoints
3. **Automatic refetching**: Data refetches automatically on related mutations
4. **No manual state management**: Loading, error, data states handled by RTK Query
5. **Type safety**: Full TypeScript support with inference

## Next Steps

1. Update your components to use RTK Query hooks
2. Remove manual state management (useState for loading/error/data)
3. Remove useEffect for data fetching
4. Leverage automatic cache invalidation
5. Consider removing old `.service.ts` files once migration is complete
