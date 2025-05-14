"use server"

import { CreateLoanParams, CreateReportedParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Ad from "../database/models/ad.model"
import User from "../database/models/user.model"
import Reported from "../database/models/reported.model"
import DynamicAd from "../database/models/dynamicAd.model"
import Loan from "../database/models/loans.model"
const populateAd = (query: any) => {
  return query
    .populate({ path: 'userId', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified' })
    .populate({
      path: 'adId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt'
    });
};
export const createLoan = async ({ loan, path }: CreateLoanParams) => {
  try {
    await connectToDatabase();
    const conditions = { $and: [{ adId: loan.adId }, { userId: loan.userId }] };
    const reportResponse = await Loan.findOne(conditions);  // Use findOne to find a single matching document

    let newLoan = {}
    let response = "You have aleardy requested this property financing!"
    if (!reportResponse) {
      newLoan = await Loan.create({ ...loan });
      response = "Property Financing Requested submitted"
    }

    revalidatePath(path)
    return response;
  } catch (error) {
    handleError(error)
  }
}

// GET ONE Ad BY ID
export async function getLoanById(_id: string) {
  try {
    await connectToDatabase()

    const response = await populateAd(Loan.findById(_id));

    if (!response) throw new Error('Reported not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}
export async function getallLaons(limit = 16, page = 1) {
  try {
    await connectToDatabase();
    const conditions = {}
    const skipAmount = (Number(page) - 1) * limit
    const response = await populateAd(Loan.find(conditions)
      .skip(skipAmount)
      .limit(limit));
    const AdCount = await Loan.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(response)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
export async function getByUserIdLaons(_id: string, limit = 16, page = 1) {
  try {
    await connectToDatabase();
    const conditions = { userId: _id }
    const skipAmount = (Number(page) - 1) * limit
    const response = await populateAd(Loan.find(conditions)
      .skip(skipAmount)
      .limit(limit));
    const AdCount = await Loan.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(response)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
export async function getallPendingLaons() {
  try {
    await connectToDatabase();
    const conditions = { status: 'Pending' }
    const AdNo = await Loan.countDocuments(conditions)
    return { adCount: AdNo }
  } catch (error) {
    handleError(error)
  }
}
// UPDATE



// Function to delete a bookmark
export const deleteLoan = async (_id: string) => {
  try {
    await connectToDatabase();

    const result = await Loan.findByIdAndDelete(_id); // Use findByIdAndDelete

    if (!result) {
      throw new Error("Loan not found");
    }

    return "Loan deleted successfully";
  } catch (error) {
    handleError(error); // Assuming handleError logs or throws
    throw error; // Optionally re-throw to handle at a higher level
  }
};