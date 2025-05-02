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

    // console.log(populatedSubcategories);
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
const originalSubcategoryId = '679ce9921bf247a8de8f8958';

// New subcategories with new names and category IDs 

const newSubcategories = [
  { name: 'Real Estate Agents', categoryId: '68144ba68d7305e36767a573' },
  { name: 'Surveyors / Valuers', categoryId: '68144ba68d7305e36767a573' },
  { name: 'Property Managers', categoryId: '68144ba68d7305e36767a573' },
  { name: 'Legal Services (Title, Deed, Lease)', categoryId: '68144ba68d7305e36767a573' },
  { name: 'Building Contractors', categoryId: '68144ba68d7305e36767a573' },
  { name: 'Interior Designers', categoryId: '68144ba68d7305e36767a573' },
  { name: 'Mortgage & Financing Services', categoryId: '68144ba68d7305e36767a573' },
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

// UPDATE



