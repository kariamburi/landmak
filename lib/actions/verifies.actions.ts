"use server"

import { CreatePackagesParams, CreateVerifiesParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams, UpdateVerifiesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Verify from "../database/models/verifies.model"
import Verifies from "../database/models/verifies.model"



export const createVerifies = async ({ verifies, path }: CreateVerifiesParams) => {
  try {
    await connectToDatabase();

    const newVerifies = await Verifies.create({ ...verifies });
    revalidatePath(path)
    return JSON.parse(JSON.stringify(newVerifies));
  } catch (error) {
    handleError(error)
  }
}
export async function updateVerifiesFee(fee: string, _id: string) {
  try {
    await connectToDatabase()
    const updatedV = await Verifies.findByIdAndUpdate(
      _id,
      { fee },
      { new: true }
    )


    return JSON.parse(JSON.stringify(updatedV))
  } catch (error) {
    handleError(error)
  }
}
// UPDATE

export async function updateVerifies({ verifies, path }: UpdateVerifiesParams) {
  try {
    await connectToDatabase()
    const updatedV = await Verifies.findByIdAndUpdate(
      verifies._id,
      { ...verifies },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedV))
  } catch (error) {
    handleError(error)
  }
}
export const getVerfiesfee = async (_id: string) => {
  try {
    await connectToDatabase();

    const verifies = await Verifies.findById(_id);

    return JSON.parse(JSON.stringify(verifies));
  } catch (error) {
    handleError(error)
  }
}
export const getVerifyfee = async () => {
  try {
    await connectToDatabase();

    const verifies = await Verifies.findOne();
    // console.log(verifies)
    return JSON.parse(JSON.stringify(verifies));
  } catch (error) {
    handleError(error)
  }
}

