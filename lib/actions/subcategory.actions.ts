"use server"

import { CreateBookmarkParams, CreateCategoryParams, CreatePackagesParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Subcategory from "../database/models/subcategory.model"
import Category from "../database/models/category.model"

const populateAd = (query: any) => {
  return query
    .populate({ path: 'category', model: Category, select: '_id name imageUrl' })
}

export const createSubCategory = async (categoryId: string, subcategoryName: string, imageUrl: any, fields: any) => {
  try {
    await connectToDatabase();

    const conditions = { subcategory: subcategoryName };
    const check = await Subcategory.findOne(conditions);  // Use findOne to find a single matching document
    if (check) throw new Error('Category exist')
    const Category = new Subcategory({
      category: categoryId,
      subcategory: subcategoryName,
      imageUrl: imageUrl,
      fields: fields,
    });
    const response = await Category.save();

    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    handleError(error)
  }
}
export async function updateCategory(_id: string, categoryId: string, subcategoryName: string, imageUrl: any, oldurl: any, editFields: any) {
  try {
    await connectToDatabase()
    const updatedCat = await Subcategory.findByIdAndUpdate(
      _id,
      {
        category: categoryId,
        subcategory: subcategoryName,
        imageUrl: imageUrl,
        fields: editFields,
      },
      { new: true }
    )
    if (oldurl) {
      const url = new URL(oldurl);
      const filename = url.pathname.split('/').pop();
      try {
        if (filename) {
          const utapi = new UTApi();
          await utapi.deleteFiles(filename);
        }
      } catch {

      }
    }
    return JSON.parse(JSON.stringify(updatedCat))
  } catch (error) {
    handleError(error)
  }
}
export const getallcategories = async () => {
  try {
    await connectToDatabase();


    const category = await populateAd(Subcategory.find());

    if (!category) throw new Error('category not found')
    //console.log(category)
    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    handleError(error)
  }
}
export const getselectedsubcategories = async (categoryId: string) => {
  try {
    await connectToDatabase();
    const conditions = categoryId ? { category: categoryId } : {};
    const category = await populateAd(Subcategory.find(conditions));

    if (!category) throw new Error('category not found')
    // console.log(category)
    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    handleError(error)
  }
}
export const getAllSubCategories = async () => {
  try {
    await connectToDatabase();

    const subcategories = await Subcategory.aggregate([
      {
        $lookup: {
          from: "dynamicads",
          let: { subcategoryName: "$subcategory" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$data.subcategory", "$$subcategoryName"] }, // Match subcategory
                    { $eq: ["$adstatus", "Active"] } // Match active ads
                  ]
                }
              }
            }
          ],
          as: "dynamicads"
        }
      },
      {
        $addFields: {
          adCount: { $size: "$dynamicads" } // Count active ads
        }
      },
      {
        $project: {
          dynamicads: 0 // Exclude dynamicAds field from the output
        }
      }
    ]);

    // Populate category names for each subcategory
    const populatedSubcategories = await Subcategory.populate(subcategories, {
      path: "category",
      model: Category,
      select: "name imageUrl"
    });

    console.log(populatedSubcategories);
    return JSON.parse(JSON.stringify(populatedSubcategories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    handleError(error);
  }
};

// DELETE
export async function deleteCategory(categoryId: string, iconUrl: string) {
  try {
    await connectToDatabase()

    const deletedCategory = await Subcategory.findByIdAndDelete(categoryId)

    // Delete image from uploadthing
    // if (deletedBookmark) revalidatePath(path)
    try {
      if (iconUrl) {
        const utapi = new UTApi();
        await utapi.deleteFiles(iconUrl);
      }
    } catch {

    }
  } catch (error) {
    handleError(error)
  }
}

export const getcategory = async (name: string, subcategory: string) => {
  try {
    await connectToDatabase();
    const conditions = { $and: [{ name: name }, { subcategory: subcategory }] };

    const category = await Subcategory.find(conditions);
    if (!category) throw new Error('category not found')

    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    handleError(error)
  }
}

export const removenegotiable = async () => {
  try {
    await connectToDatabase();

    const feedback = await Subcategory.updateMany(
      {},
      { $pull: { fields: { name: "negotiable" } } }
    );
    if (!feedback) throw new Error('category not found')

    return JSON.parse(JSON.stringify(feedback))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE



