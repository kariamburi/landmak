"use server"

import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Ad from "../database/models/ad.model"
import User from "../database/models/user.model"
import Reported from "../database/models/reported.model"
import DynamicAd from "../database/models/dynamicAd.model"
import DisputeReport from "../database/models/DisputeReport"
import MapaVerificationSchema from "../database/models/MapaVerificationSchema"


const populateAd = (query: any) => {
  return query
    .populate({ path: 'userId', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified' })
    .populate({
      path: 'adId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt'
    });
};
interface VerificationPayload {
  fullName: string;
  phone: string;
  idNumber: string;
  kraPin: string;
  parcelNumber: string;
  consentStatus: string;
  ad: string;
  files: {
    titleDeed?: string;
    landSearch?: string;
    idCopy?: string;
    kraPinCopy?: string;
    buildingPlans?: string;
    occupationCertificate?: string;
    utilityClearance?: string;
    landRatesClearance?: string;
    shareCertificate?: string;
    siteReport?: string;
  };
}

export const createmapaVerification = async (data: VerificationPayload) => {
  try {
    await connectToDatabase();

    const newVerification = await MapaVerificationSchema.create({
      fullName: data.fullName,
      phone: data.phone,
      idNumber: data.idNumber,
      kraPin: data.kraPin,
      parcelNumber: data.parcelNumber,
      consentStatus: data.consentStatus,
      ad: data.ad,
      files: {
        titleDeed: data.files.titleDeed || '',
        landSearch: data.files.landSearch || '',
        idCopy: data.files.idCopy || '',
        kraPinCopy: data.files.kraPinCopy || '',
        buildingPlans: data.files.buildingPlans || '',
        occupationCertificate: data.files.occupationCertificate || '',
        utilityClearance: data.files.utilityClearance || '',
        landRatesClearance: data.files.landRatesClearance || '',
        shareCertificate: data.files.shareCertificate || '',
        siteReport: data.files.siteReport || '',
      },
    });

    return { success: true, data: newVerification };
  } catch (error) {
    console.error('Error in createmapaVerification:', error);
    return { success: false, error: 'Failed to create verification request.' };
  }
};

// Fetch all submissions
export const getAllMapaVerifications = async () => {
  await connectToDatabase();
  return await MapaVerificationSchema.find().sort({ createdAt: -1 });
};

export const updateMapaVerificationStatus = async (
  id: string,
  status: 'approved' | 'rejected'
) => {
  await connectToDatabase();

  const updatedVerification: any = await MapaVerificationSchema.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean(); // 🔥 lean makes it a plain object

  if (!updatedVerification) {
    throw new Error('Verification request not found');
  }

  await DynamicAd.findByIdAndUpdate(updatedVerification.ad, {
    mapaVerificationStatus: status === 'approved' ? 'verified' : 'rejected',
  });


  return updatedVerification; // ✅ Now this is a plain object
};
