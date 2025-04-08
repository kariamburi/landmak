'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/packages.model'
import Event from '@/lib/database/models/ad.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams, UpdateUserSetingsParams, UpdateUserToken } from '@/types'
import Verify from '../database/models/verifies.model'
import Verifies from '../database/models/verifies.model'


export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}
export async function createUserr(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user, { verified: [{ accountverified: false, verifieddate: Date() }] },)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}
export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')

    // Fetch verification fee
    const verifyData = await Verifies.findOne() // adjust if you have a different criteria
    const fee = verifyData?.fee || 500
    console.log(fee);
    return JSON.parse(JSON.stringify({ ...user.toObject(), fee }))



    //  return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUserStatus(_id: string, status: string) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdabused = await User.findByIdAndUpdate(
      _id,
      { status }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    // revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdabused));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
export async function updateUserToken(userId: string, currentToken: string) {
  try {
    await connectToDatabase();

    // Find the user by ID
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if the FCM token already exists
    if (existingUser.token !== currentToken) {
      // Update the user's FCM token
      existingUser.token = currentToken;
      // Save the updated user data
      const updatedUser = await existingUser.save();

      if (!updatedUser) throw new Error("User update failed");

      return JSON.parse(JSON.stringify(updatedUser));
    }

    // If the token already exists, return the existing user data
    return JSON.parse(JSON.stringify(existingUser));
  } catch (error) {
    handleError(error);
  }
}
export async function updateUserFromSettings({ user, path }: UpdateUserSetingsParams) {
  try {
    await connectToDatabase()
    //console.log(user);
    const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
// USE CREDITS
export async function updateVerification(userId: string) {
  try {
    await connectToDatabase();
    //console.log("update userId: "+userId+" Date:"+Date());
    const updatedUserVerifiction = await User.findOneAndUpdate(
      { _id: userId },
      { verified: [{ accountverified: true, verifieddate: Date() }] },
      { new: true }
    )
    if (!updatedUserVerifiction) throw new Error("User Verification update failed");

    return JSON.parse(JSON.stringify(updatedUserVerifiction));
  } catch (error) {
    handleError(error);
  }
}
export async function getAllUsers(limit: number, page: number) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit;
    // Fetch filtered orders with pagination
    const user = await User.find()
      .skip(skipAmount)
      .limit(limit);
    // Get the count of documents that match the conditions
    const AdCount = await User.countDocuments();
    //console.log({ data: JSON.parse(JSON.stringify(user)), totalPages: Math.ceil(AdCount / limit) })
    return { data: JSON.parse(JSON.stringify(user)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
