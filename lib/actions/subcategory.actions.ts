"use server"

import { CreateBookmarkParams, CreateCategoryParams, CreatePackagesParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Subcategory from "../database/models/subcategory.model"
import Category from "../database/models/category.model"
import mongoose from "mongoose"

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
          let: { subcategoryName: "$subcategory", catId: "$category" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$data.subcategory", "$$subcategoryName"] },
                    { $eq: ["$category", "$$catId"] },
                    { $eq: ["$adstatus", "Active"] }
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
          adCount: { $size: "$dynamicads" }
        }
      },
      {
        $project: {
          dynamicads: 0
        }
      }
    ]);

    const populatedSubcategories = await Subcategory.populate(subcategories, {
      path: "category",
      model: Category,
      select: "name imageUrl"
    });

    return JSON.parse(JSON.stringify(populatedSubcategories));
  } catch (error) {
    console.error("Error fetching subcategories:", error);
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

export const migrateFieldOptions = async () => {
  try {
    await connectToDatabase();

    const subcategories = await Subcategory.find({ "fields.name": "property-Type" });

    for (const subcat of subcategories) {
      let updated = false;

      subcat.fields = subcat.fields.map((field: any) => {
        if (field.name === "property-Type" && Array.isArray(field.options)) {
          // Only convert if first option is string
          if (
            field.options.length > 0 &&
            typeof field.options[0] === "string"
          ) {
            field.options = field.options.map((opt: string) => ({
              label: opt.trim(),
              iconUrl: "",
            }));
            updated = true;
          }
        }
        return field;
      });
      if (updated) {
        subcat.markModified('fields');
        await subcat.save();
        console.log(`✅ Updated subcategory: ${subcat._id}`);
      }
    }

    return '✅ Migration complete';
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw new Error("Migration failed");
  }
};


export const reverseFieldOptions = async () => {
  try {
    await connectToDatabase();

    const subcategories = await Subcategory.find({ "fields.name": "property-Type" });

    for (const subcat of subcategories) {
      let updated = false;

      subcat.fields = subcat.fields.map((field: any) => {
        if (
          field.name === "property-Type" &&
          Array.isArray(field.options) &&
          typeof field.options[0] === "object" &&
          field.options[0]?.label
        ) {
          // Convert back to plain strings
          field.options = field.options.map((opt: { label: string }) => opt.label);
          updated = true;
        }
        return field;
      });

      if (updated) {
        subcat.markModified("fields");
        await subcat.save();
        console.log(`🔁 Reversed subcategory: ${subcat._id}`);
      }
    }

    return "🔁 Reverse migration complete";
  } catch (error) {
    console.error("❌ Reverse migration error:", error);
    throw new Error("Reverse migration failed");
  }
};


// Original subcategory ID to clone from
const originalSubcategoryId = '68146886b897ffdf7baa12fd';

// New subcategories with new names and category IDs 

const newSubcategories = [
  { name: 'Warehouse', categoryId: '68144b998d7305e3676767a0' },
  // { name: 'Surveyors / Valuers', categoryId: '68144ba68d7305e36767a573' },
  // { name: 'Property Managers', categoryId: '68144ba68d7305e36767a573' },
  // { name: 'Legal Services (Title, Deed, Lease)', categoryId: '68144ba68d7305e36767a573' },
  //{ name: 'Building Contractors', categoryId: '68144ba68d7305e36767a573' },
  //{ name: 'Interior Designers', categoryId: '68144ba68d7305e36767a573' },
  //{ name: 'Mortgage & Financing Services', categoryId: '68144ba68d7305e36767a573' },
];


export async function duplicateSubcategories() {
  try {
    await connectToDatabase();

    const original = await Subcategory.findById(originalSubcategoryId).lean();
    if (!original) throw new Error('Original subcategory not found');

    for (const { name, categoryId } of newSubcategories) {

      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

      const exists = await Subcategory.findOne({
        subcategory: name,
        category: categoryObjectId,
      });

      if (exists) {
        console.log(`⚠️ Skipped (already exists): ${name}`);
        continue;
      }
      const cloned = {
        ...original,
        _id: new mongoose.Types.ObjectId(),
        subcategory: name,
        category: new mongoose.Types.ObjectId(categoryId),
      };

      if ('__v' in cloned) delete (cloned as any).__v;

      await Subcategory.create(cloned);
      console.log(`✅ Created: ${name}`);


    }

    console.log('✅ All subcategories duplicated successfully!');
  } catch (error) {
    console.error('❌ Duplication error:', error);
  } finally {
    // Optionally disconnect if this runs standalone
    // await mongoose.disconnect();
  }
}


export async function syncSubcategoryImages(baseCategoryId: string) {
  try {
    await connectToDatabase();
    const categoryObjectId = new mongoose.Types.ObjectId(baseCategoryId);

    // Step 1: Find all subcategories with the given category ID
    const baseSubcategories = await Subcategory.find({ category: categoryObjectId });

    for (const baseSub of baseSubcategories) {
      const { subcategory, imageUrl } = baseSub;

      // Step 2: Update other subcategories with the same subcategory name but different category
      await Subcategory.updateMany(
        {
          subcategory,
          category: { $ne: categoryObjectId },
        },
        {
          $set: { imageUrl },
        }
      );
    }

    console.log('✅ Image URLs updated for matching subcategories in different categories.');
  } catch (error) {
    console.error('❌ Duplication error:', error);
  } finally {
    // Optionally disconnect if this runs standalone
    // await mongoose.disconnect();
  }
}

export async function updateSub() {
  try {
    await connectToDatabase();
    const categoryObjectId = new mongoose.Types.ObjectId("6814717bb897ffdf7bac70b5");
    const baseSubcategories = await Subcategory.updateOne(
      { _id: categoryObjectId },
      { $set: { subcategory: "Construction & Technical Services" } }
    )
    console.log('✅ UPDATED.');
  } catch (error) {
    console.error('❌ Duplication error:', error);
  } finally {
    // Optionally disconnect if this runs standalone
    // await mongoose.disconnect();
  }
}
export async function updatethisCategory(_id = '6816164c064246f5e800b2b4', categoryId = '68144b998d7305e3676767a0') {
  try {
    await connectToDatabase()
    const updatedCat = await Subcategory.findByIdAndUpdate(
      _id,
      {
        category: categoryId,
      },
      { new: true }
    )


    return JSON.parse(JSON.stringify(updatedCat))
  } catch (error) {
    handleError(error)
  }
}


