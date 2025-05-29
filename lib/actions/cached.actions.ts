import { cache } from "react";
import { getAllCategories } from "./category.actions";
import { getAllSubCategories } from "./subcategory.actions";
import { getAllPackages } from "./packages.actions";
import { getAdsCountAllRegion } from "./dynamicAd.actions";

export const getAllCategoriesCached = cache(async () => {
    return getAllCategories();
});

export const getAllSubCategoriesCached = cache(async () => {
    return getAllSubCategories();
});

export const getAllPackagesCached = cache(async () => {
    return getAllPackages();
});

export const getAdsCountAllRegionCached = cache(async () => {
    return getAdsCountAllRegion();
});
