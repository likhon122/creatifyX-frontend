// Export the base API object only (not hooks to avoid duplicates)
export { api } from "@/lib/api";

// Export all RTK Query API hooks from individual services
export * from "./user.api";
export * from "./category.api";
export * from "./plan.api";
export * from "./contact.api";
export * from "./dashboard.api";
export * from "./auth.api";
export * from "./asset.api";
export * from "./subscription.api";
export * from "./review.api";
export * from "./payment.api";

// Export legacy service objects for backward compatibility (using renamed exports)
export { assetService } from "./asset.service";
export { paymentApi } from "./payment.service";
export { subscriptionApi as subscriptionService } from "./subscription.service";
export { reviewApi as reviewService } from "./review.service";

// Note: assetApi, reviewApi, subscriptionApi from .service.ts files are NOT exported here
// because they conflict with RTK Query API names. Import them directly from their .service.ts files.
