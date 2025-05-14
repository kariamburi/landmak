"use server"

import { CreateBookmarkParams, CreatePackagesParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Packages from "../database/models/packages.model"
import Bookmark from "../database/models/bookmark.model"
import DynamicAd from "../database/models/dynamicAd.model"
import User from "../database/models/user.model"


const populateAd = (query: any) => {
  return query.populate({
    path: 'adId',
    model: DynamicAd,
    select:
      '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt',
    populate: {
      path: 'organizer',
      model: User, // or whatever model the organizer refers to
      select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token notifications',
    },
  });
};


export const createBookmark = async ({ bookmark, path }: CreateBookmarkParams) => {
  try {
    await connectToDatabase();
    //  const conditions = { adId: bookmark.adId };
    const conditions = { $and: [{ adId: bookmark.adId }, { userBId: bookmark.userBId }] };
    const book = await Bookmark.findOne(conditions);  // Use findOne to find a single matching document

    let newBookmark = {}
    let response = "Ad aleardy Saved to Bookmark"
    if (!book) {
      newBookmark = await Bookmark.create({ ...bookmark });
      response = "Ad Saved to Bookmark"
    }

    revalidatePath(path)
    return response;
  } catch (error) {
    handleError(error)
  }
}

// GET ONE Ad BY ID
export async function getBookmarkById(_id: string) {
  try {
    await connectToDatabase()

    const bookmark = await Bookmark.findById(_id)

    if (!bookmark) throw new Error('Bookmark not found')

    return JSON.parse(JSON.stringify(bookmark))
  } catch (error) {
    handleError(error)
  }
}
export async function getallBookmarkByuserId(userId: string, limit = 16, page = 1) {
  try {
    await connectToDatabase();
    const conditions = { userBId: userId }
    const skipAmount = (Number(page) - 1) * limit
    // const bookmark = await Bookmark.find(conditions);
    const bookmark = await populateAd(Bookmark.find(conditions)
      .skip(skipAmount)
      .limit(limit));
    const AdCount = await Bookmark.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(bookmark)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// UPDATE

// DELETE
export async function deletePackage({ _id, path }: DeleteBookmarkParams) {
  try {
    await connectToDatabase()

    const deletedBookmark = await Bookmark.findByIdAndDelete(_id)
    // Delete image from uploadthing
    if (deletedBookmark) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}


// Function to delete a bookmark
export const deleteBookmark = async ({ bookmark, path }: CreateBookmarkParams) => {
  try {
    await connectToDatabase();
    //const conditions = { adId: bookmark.adId };
    const conditions = { $and: [{ adId: bookmark.adId }, { userBId: bookmark.userBId }] };
    const book = await Bookmark.findOne(conditions); // Find the matching bookmark

    let response = "Bookmark not found";
    if (book) {
      await Bookmark.deleteOne(conditions); // Delete the bookmark if it exists
      response = "Bookmark deleted successfully";
    }

    revalidatePath(path); // Revalidate the path to update cache
    return response;
  } catch (error) {
    handleError(error); // Handle any errors
  }
};