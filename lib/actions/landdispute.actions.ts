"use server"

import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Ad from "../database/models/ad.model"
import User from "../database/models/user.model"
import Reported from "../database/models/reported.model"
import DynamicAd from "../database/models/dynamicAd.model"
import DisputeReport from "../database/models/DisputeReport"


const populateAd = (query: any) => {
  return query
    .populate({ path: 'userId', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified' })
    .populate({
      path: 'adId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt'
    });
};
interface CreateReportedParams {
  report: {
    parcel: string;
    type: string;
    description: string;
    contact?: string;
    anonymous: boolean;
    evidenceUrl?: string;
    ad: string; // optional link to DynamicAd._id
  };
  path: string;
}


export const createLandDispute = async ({ report, path }: CreateReportedParams) => {
  try {
    await connectToDatabase();

    // Prevent duplicate report with same description on same ad
    const existingReport = await DisputeReport.findOne({
      ad: report.ad,
      description: report.description,
    });

    let response = 'You have already reported this land dispute.';

    if (!existingReport) {
      // Create new dispute report
      const newReport = await DisputeReport.create({
        ...report,
        ad: report.ad,
        status: 'pending',
        confidence: 'reported',
      });

      // Update the ad with dispute info
      await DynamicAd.findByIdAndUpdate(report.ad, {
        $set: { disputeStatus: 'reported' },
        $addToSet: { disputeReports: newReport._id },
      });

      response = 'Land dispute reported successfully.';
    }

    revalidatePath(path);
    return response;
  } catch (error) {
    handleError(error);
    return 'An error occurred while reporting the dispute.';
  }
};

// GET ONE Ad BY ID
export async function getLandDisputeById(_id: string) {
  try {
    await connectToDatabase()

    const response = await DisputeReport.findById(_id)

    if (!response) throw new Error('Reported not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}
export async function getallLandDispute(limit = 16, page = 1) {
  try {
    await connectToDatabase();
    const conditions = {}
    const skipAmount = (Number(page) - 1) * limit
    const response = await populateAd(Reported.find(conditions)
      .skip(skipAmount)
      .limit(limit));
    const AdCount = await Reported.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(response)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// UPDATE



export const fetchAllDisputes = async () => {
  await connectToDatabase();
  const disputes = await DisputeReport.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(disputes));
};

export const updateDisputeStatus = async (
  reportId: string,
  newStatus: 'pending' | 'reviewed' | 'dismissed'
) => {
  await connectToDatabase();

  // Step 1: Update the specific report
  const updatedReport = await DisputeReport.findByIdAndUpdate(reportId, { status: newStatus }, { new: true });

  if (!updatedReport) return;

  // Step 2: Check related ad’s overall dispute status
  const relatedReports = await DisputeReport.find({ ad: updatedReport.ad });

  // Determine new ad-level status
  let adDisputeStatus: 'none' | 'reported' | 'suspected' | 'verified' = 'none';

  const statuses = relatedReports.map(r => r.status);

  if (statuses.includes('pending')) {
    adDisputeStatus = 'reported';
  } else if (statuses.includes('reviewed')) {
    adDisputeStatus = 'suspected';
  } else if (statuses.every(status => status === 'dismissed')) {
    adDisputeStatus = 'none';
  }

  // Step 3: Update the ad’s dispute status
  await DynamicAd.findByIdAndUpdate(updatedReport.ad, {
    disputeStatus: adDisputeStatus,
  });
};