"use server"

import { CreatePackagesParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Packages from "../database/models/packages.model"



export const createPackage = async ({ pack, path }: CreatePackagesParams) => {
  try {
    await connectToDatabase();

    const newPackage = await Packages.create({ ...pack });
    revalidatePath(path)
    return JSON.parse(JSON.stringify(newPackage));
  } catch (error) {
    handleError(error)
  }
}
// GET ONE Ad BY ID
export async function getPackageById(packageId: string) {
  try {
    await connectToDatabase()

    const pack = await Packages.findById(packageId)

    if (!pack) throw new Error('Package not found')

    return JSON.parse(JSON.stringify(pack))
  } catch (error) {
    handleError(error)
  }
}
export const getAllPackages = async () => {
  try {
    await connectToDatabase();

    const packages = await Packages.find().sort({ priority: 1 }); // 1 for ascending

    return JSON.parse(JSON.stringify(packages));
  } catch (error) {
    handleError(error)
  }
}
// UPDATE
export async function updatePackage({ pack, path }: UpdatePackagesParams) {
  try {
    await connectToDatabase()
    const updatedPack = await Packages.findByIdAndUpdate(
      pack._id,
      { ...pack },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedPack))
  } catch (error) {
    handleError(error)
  }
}
// DELETE
export async function deletePackage({ packageId, packageIcon, path }: DeletePackagesParams) {
  try {
    await connectToDatabase()

    const deletedAd = await Packages.findByIdAndDelete(packageId)
    // Delete image from uploadthing
    const url = new URL(packageIcon);
    const filename = url.pathname.split('/').pop();
    if (filename) {
      const utapi = new UTApi();
      await utapi.deleteFiles(filename);
    }
    if (deletedAd) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}


