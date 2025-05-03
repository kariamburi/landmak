// ====== USER PARAMS

export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  email: string
  photo: string
  status: string
  businessname?: string
  aboutbusiness?: string
  businessaddress?: string
  latitude?: string
  longitude?: string
  businesshours?: Businesshours[]
  businessworkingdays?: string[]
  phone?: string
  whatsapp?: string
  website?: string
  facebook?: string
  twitter?: string
  instagram?: string
  tiktok?: string
  verified: Verified[]
  imageUrl?: string
  fcmToken?: string
}
export interface Businesshours {
  openHour: string
  openMinute: string
  closeHour: string
  closeMinute: string
}
export interface Verified {
  accountverified: boolean
  verifieddate: Date
}
export type UpdateUserParams = {
  status: string
  firstName: string
  lastName: string
  photo: string

}
export type UpdateUserToken = {
  fcmToken: string
}
export type UpdateUserSetingsParams = {
  user: {
    _id: string
    lastName: string
    photo: string
    businessname?: string
    aboutbusiness?: string
    businessaddress?: string
    latitude?: string
    longitude?: string
    businesshours?: Businesshours[]
    businessworkingdays?: string[]
    phone?: string
    whatsapp?: string
    website?: string
    facebook?: string
    twitter?: string
    instagram?: string
    tiktok?: string
    // verified?:Verified[]
    imageUrl?: string
  }
  path: string
}
// ====== Ad PARAMS
export type CreateAdShopParams = {
  userId: string
  subcategory: string
  category: string
  planId: string
  plan: string
  pricePack: number
  periodPack: string
  formData: any
  priority: number
  expirely: Date
  adstatus: string
  path: string
}

// ====== Ad PARAMS
export type CreateAdParams = {
  userId: string
  planId: string
  pricePack: number;
  periodPack: string;
  ad: {
    title: string
    description: string
    latitude: string
    longitude: string
    address: string
    enableMap: boolean
    imageUrls: string[]
    negotiable: boolean
    youtube?: string
    phone: string
    subcategory: string
    views: string
    categoryId: string
    price: number
    make?: string
    vehiclemodel?: string
    vehicleyear?: string
    vehiclecolor?: string//Black,Blue,Gray,Silver,White,Beige,Brown,Burgundy,Gold,Green,Ivory,Matt Black,Off white,Orange, Pearl, Pink,Purple ,Red,Teal,Yellow,Others
    vehicleinteriorColor?: string
    vehiclecondition?: string//Brand New, Foreign Used, Local Used
    vehiclesecordCondition?: string//After crash,Engine Issue,First Owner,First registration, Gear issue,Need body repair,Need body repainting, Need repair,Original parts,Unpainted,Wiring problem, No fault
    vehicleTransmissions?: string
    vehiclemileage?: string
    vehiclekeyfeatures?: string[]
    vehiclechassis?: string//VIN Chassis Number
    vehicleregistered?: string//yes,no
    vehicleexchangeposible?: string//yes,no
    vehicleFuelTypes?: string//petrol,disel,Electricity
    vehicleBodyTypes?: string
    vehicleSeats?: string
    vehicleEngineSizesCC?: string
    Types?: string
    bedrooms?: string
    bathrooms?: string
    furnishing?: string
    amenities?: string[]
    toilets?: string
    parking?: string
    status?: string
    area?: string
    landuse?: string
    propertysecurity?: string
    floors?: string
    estatename?: string
    houseclass?: string
    listedby?: string
    fee?: string
    geometry: {
      type: string
      coordinates: number[]
    }
    priority: number
    expirely: Date
    adstatus: string
  }
  path: string
}

export type UpdateAdParams = {
  userId: string
  planId: string
  ad: {
    _id: string
    title: string
    imageUrls: string[]
    description: string
    latitude: string
    longitude: string
    address: string
    enableMap: boolean
    negotiable: boolean
    youtube?: string
    phone: string
    subcategory: string
    views: string
    categoryId: string
    price: number
    make?: string
    vehiclemodel?: string
    vehicleyear?: string
    vehiclecolor?: string//Black,Blue,Gray,Silver,White,Beige,Brown,Burgundy,Gold,Green,Ivory,Matt Black,Off white,Orange, Pearl, Pink,Purple ,Red,Teal,Yellow,Others
    vehicleinteriorColor?: string
    vehiclecondition?: string//Brand New, Foreign Used, Local Used
    vehiclesecordCondition?: string//After crash,Engine Issue,First Owner,First registration, Gear issue,Need body repair,Need body repainting, Need repair,Original parts,Unpainted,Wiring problem, No fault
    vehicleTransmissions?: string
    vehiclemileage?: string
    vehiclekeyfeatures?: string[]
    vehiclechassis?: string//VIN Chassis Number
    vehicleregistered?: string//yes,no
    vehicleexchangeposible?: string//yes,no
    vehicleFuelTypes?: string//petrol,disel,Electricity
    vehicleBodyTypes?: string
    vehicleSeats?: string
    vehicleEngineSizesCC?: string
    Types?: string
    bedrooms?: string
    bathrooms?: string
    furnishing?: string
    amenities?: string[]
    toilets?: string
    parking?: string
    status?: string
    area?: string
    landuse?: string
    propertysecurity?: string
    floors?: string
    estatename?: string
    houseclass?: string
    listedby?: string
    fee?: string
    geometry: {
      type: string
      coordinates: number[]
    }

  }
  path: string
}

//==========Reported
export type CreateReportedParams = {
  report: {
    userId: string
    adId: string
    reason: string
    description: string
  }
  path: string
}
export type DeleteReportedParams = {
  _id: string
  path: string
}

//==========Bookmark
export type CreateBookmarkParams = {
  bookmark: {
    userBId: string
    adId: string
  }
  path: string
}
export type DeleteBookmarkParams = {
  _id: string
  path: string
}
// ====== PACKAGES
export type CreatePackagesParams = {
  pack: {
    name: string
    description: string
    imageUrl: string
    features: Feature[]
    price: Price[]
    color: string
    priority: number;
    list: number;

  }
  path: string
}




export interface Feature {
  title: string;
  checked: boolean;
}
export interface Price {
  period: string;
  amount: number;
}
export type UpdatePackagesParams = {
  pack: {
    _id: string
    name: string
    description: string
    features: Feature[]
    price: Price[]
    imageUrl: string
    color: string
    priority: number;
    list: number;

  }
  path: string
}
export type DeletePackagesParams = {
  packageId: string
  packageIcon: string
  path: string
}
export type DeleteAdParams = {
  adId: string
  deleteImages: string[]
  path: string
}
export type GetAlldynamicAdParams = {
  limit: number
  page: number
  queryObject: any
}

export type GetAllAdsParams = {
  query: string
  category: string
  subcategory: string
  sortby: string
  make: string
  vehiclemodel: string
  yearfrom: string
  vehiclecolor: string
  vehiclecondition: string
  vehicleTransmissions: string
  vehicleFuelTypes: string
  vehicleBodyTypes: string
  vehicleregistered: string
  vehiclesecordCondition: string
  vehicleexchangeposible: string
  vehicleEngineSizesCC: string
  vehicleSeats: string
  vehicleyear: string
  Types?: string
  bedrooms?: string
  bathrooms?: string
  furnishing?: string
  amenities?: string[]
  toilets?: string
  parking?: string
  status?: string
  area?: string
  landuse?: string
  propertysecurity?: string
  floors?: string
  estatename?: string
  houseclass?: string
  longitude: string
  latitude: string
  address: string
  membership: string
  yearto: string
  Price: string
  limit: number
  page: number

}

export type GetAdsByUserParams = {
  userId: string
  limit?: number
  page: number
  sortby: string;
  myshop: boolean;

}
export type deleteImageParams = {
  deleteImage: string
  path: string
}

export type GetRelatedAdsBySubCategoryParams = {
  subcategory: string
  adId: string
  limit?: number
  page: number | string
}

export type GetRelatedAdsByCategoryParams = {
  categoryId: string
  subcategory: string
  adId: string
  limit?: number
  page: number | string
}

export type Ad = {
  _id: string
  title: string
  description: string
  price: number
  imageUrls: string[]
  latitude: string
  longitude: string
  address: string
  enableMap: boolean
  negotiable: boolean
  youtube?: string
  phone: string
  subcategory: string
  views: string
  make: string
  vehiclemodel: string
  vehicleyear?: string
  vehiclecolor?: string//Black,Blue,Gray,Silver,White,Beige,Brown,Burgundy,Gold,Green,Ivory,Matt Black,Off white,Orange, Pearl, Pink,Purple ,Red,Teal,Yellow,Others
  vehicleinteriorColor?: string
  vehiclecondition?: string//Brand New, Foreign Used, Local Used
  vehiclesecordCondition?: string//After crash,Engine Issue,First Owner,First registration, Gear issue,Need body repair,Need body repainting, Need repair,Original parts,Unpainted,Wiring problem, No fault
  vehicleTransmissions?: string
  vehiclemileage?: string
  vehiclekeyfeatures?: string[]
  vehiclechassis?: string//VIN Chassis Number
  vehicleregistered?: string//yes,no
  vehicleexchangeposible?: string//yes,no
  vehicleFuelTypes?: string//petrol,disel,Electricity
  vehicleBodyTypes?: string
  vehicleSeats?: string
  vehicleEngineSizesCC?: string
  Types?: string
  bedrooms?: string
  bathrooms?: string
  furnishing?: string
  amenities?: string[]
  toilets?: string
  parking?: string
  status?: string
  area?: string
  landuse?: string
  propertysecurity?: string
  floors?: string
  estatename?: string
  houseclass?: string
  listedby?: string
  fee?: string
  geometry: {
    type: string
    coordinates: number[]
  }
  organizer: {
    _id: string
    firstName: string
    lastName: string
    photo: string
    email: string
    businessname?: string
    aboutbusiness?: string
    businessaddress?: string
    latitude?: string
    longitude?: string
    businesshours?: Businesshours[]
    businessworkingdays?: string[]
    phone?: string
    whatsapp?: string
    website?: string
    facebook?: string
    twitter?: string
    instagram?: string
    tiktok?: string
    verified?: Verified[]
    imageUrl?: string
  }
  category: {
    _id: string
    name: string
  }
  plan: {
    _id: string
    plan: string
    color: string
    imageUrl: string
  }
  priority: number
  expirely: Date
  adstatus: string
  inquiries: string
  whatsapp: string
  shared: string
  bookmarked: string
  abused: string
}
export interface Subcategory {
  title: string;
}
// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  formData: any
  path: string
}
export type UpdateCategoryParams = {
  formData: any
  _id: string
  deleteUrl: boolean
  oldurl: string
  path: string
}


export type catego = {
  _id: string
  name: string
  subcategory: Subcategory[]
  imageUrl: string
}
export type DeleteCategoryParams = {
  categoryId: string
  categoryImage: string
  path: string
}

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  adTitle: string
  AdId: string
  price: number
  isFree: boolean
  buyerId: string
}

export type CreateOrderParams = {
  stripeId: string
  AdId: string
  buyerId: string
  totalAmount: string
  createdAt: Date
}

export type GetOrdersByAdParams = {
  adId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}
export type UrlQueryParamsWithMultipleUpdates = {
  params: string
  updates: Record<string, string>
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
// ====== TRANSACTION PARAMS
export type CheckoutTransactionParams = {
  plan: string;
  planId: string;
  period: string;
  amount: number;
  buyerId: string;
  status: string;
  //phone: string;
  //firstName: string;
  //middleName: string;
  //lastName: string;
  //email: string;
};

export type CreateTransactionParams = {
  orderTrackingId: string;
  amount: number;
  planId: string;
  plan: string;
  period: string;
  merchantId: string;
  buyerId: string;
  createdAt: Date;
  status: string;
  //phone: string;
  //firstName: string;
  //middleName: string;
  //lastName: string;
  // email: string;
};
// ====== TRANSACTION status
export type TransactionStatusParams = {
  orderTrackingId: string;
  plan: string;
  planId: string;
  period: string;
  amount: number;
  buyerId: string;
  status: string;
  //phone: string;
  //: string;
  //middleName: string;
  //lastName: string;
  //email: string;

};
export type UpdateVideoParams = {
  _id: string; // object File
  youtube: string;
  path: string;

};
export type UpdateViewsParams = {
  _id: string; // object File
  views: string;
  path: string;

};
export type UpdateCallsParams = {
  _id: string; // object File
  calls: string;
  path: string;

};
export type UpdateWhatsappParams = {
  _id: string; // object File
  whatsapp: string;
  path: string;

};
export type UpdateInquiriesParams = {
  _id: string; // object File
  inquiries: string;
  path: string;

};
export type UpdateShareParams = {
  _id: string; // object File
  shared: string;
  path: string;

};
export type UpdateAbuseParams = {
  _id: string; // object File
  abused: string;
  path: string;

};
export type UpdateStatusParams = {
  _id: string; // object File
  adstatus: string;
  path: string;

};
export type UpdateBookmarkedParams = {
  _id: string; // object File
  bookmarked: string;
  path: string;
};
export type CreateVerifiesParams = {
  verifies: {
    fee: string
  }
  path: string
}
export type UpdateVerifiesParams = {
  verifies: {
    _id: string
    fee: string
  }
  path: string
}

