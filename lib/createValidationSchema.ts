import * as z from "zod";

interface Field {
  name: string;
  type: "text" | "number" | "money" | "select" | "radio" | "checkbox" | "textarea" | "multi-select" | "autocomplete" | "phone"
  | "year" | "youtube-link" | "budget" | "price" | "rentprice" | "priceper" | "bulkprice"
  | "delivery" | "gps" | "location" | "propertyarea" | "virtualTourLink" | "notify" | "serviceprice" | "related-autocompletes";
  required?: boolean;
  options?: string[];
}
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const tiktokRegex = /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/;
const trustedDomains = [
  "matterport.com",
  "tourwizard.net",
  "kuula.co",
  "cloudpano.com",
  "teliportme.com",
  "goiguide.com",
  "my360tours.com",
  "panoee.com",
  "vieweet.com",
  "sketchfab.com"
];

function isTrustedVirtualTourUrl(url: any) {
  try {
    const { hostname } = new URL(url);
    return trustedDomains.some((domain) => hostname.endsWith(domain));
  } catch {
    return false; // Invalid URL
  }
}

export const createValidationSchema = (fields: Field[], category: string) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  schemaShape["category"] = z.string().nonempty(`Category is required`);
  schemaShape["subcategory"] = z.string().nonempty(`Sub Category is required`);

  if (category === "Buyer Requests" || category === "Services" || category === "Seeking Work CVs" || category === "Jobs") {
    schemaShape["imageUrls"] = z.array(z.string()).min(1, "At least 1 image is required");
  } else {
    schemaShape["imageUrls"] = z.array(z.string()).min(3, "At least 3 images are required");
  }
  schemaShape["region"] = z.string().nonempty(`Region is required`);
  schemaShape["area"] = z.string().nonempty(`Area is required`);
  // Helper function to check if a field exists in the fields array
  const fieldExists = (name: string) => fields.some((field) => field.name === name);
  // Conditionally add validation for "mode" and "make"
  if (fieldExists("make-model")) {
    schemaShape["make"] = z.string().nonempty(`Make is required`);
  }
  if (fieldExists("make-model")) {
    schemaShape["model"] = z.string().nonempty(`Model is required`);
  }
  const deliveryItemSchema = z.object({
    name: z.string().nonempty(),
    region: z.array(z.string()).nonempty(),
    chargeFee: z.string(),
    costFrom: z.string(),
    costTo: z.string(),
    daysFrom: z.string(),
    daysTo: z.string()
  });

  const deliverySchema = z.array(deliveryItemSchema);
  //if (fieldExists("rentprice")) {
  // schemaShape["period"] = z.string().nonempty(`Period is required`);
  //}

  //if (fieldExists("rentprice")) {
  // schemaShape["price"] = z.union([z.string(), z.number()])
  // .transform((value) =>
  //   typeof value === "string" ? parseFloat(value) : value
  //)
  // .refine((value) => !isNaN(value), {
  //   message: `Price must be a valid number`,
  // });
  //}

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny; // Declare variable

    switch (field.type) {
      case "text":
        fieldSchema = field.required
          ? z.string().nonempty(`${field.name} is required`)
          : z.string().optional();
        break;

      case "number":
        fieldSchema = field.required
          ? z
            .union([z.string(), z.number()])
            .transform((value) =>
              typeof value === "string" ? parseFloat(value) : value
            )
            .refine((value) => !isNaN(value), {
              message: `${field.name} must be a valid number`,
            })
          : z.number().optional();
        break;
      case "money":
        fieldSchema = field.required
          ? z
            .union([z.string(), z.number()])
            .transform((value) => {
              if (typeof value === "string") {
                // Remove commas before converting to float
                const numericValue = parseFloat(value.replace(/,/g, ""));
                return numericValue;
              }
              return value;
            })
            .refine((value) => !isNaN(value), {
              message: `${field.name} must be a valid number`,
            })
          : z
            .union([z.string(), z.number()])
            .transform((value) => {
              if (typeof value === "string") {
                return parseFloat(value.replace(/,/g, ""));
              }
              return value;
            })
            .optional();
        break;
      case "budget":
        fieldSchema = field.required
          ? z
            .union([z.string(), z.number()])
            .transform((value) => {
              if (typeof value === "string") {
                // Remove commas before converting to float
                const numericValue = parseFloat(value.replace(/,/g, ""));
                return numericValue;
              }
              return value;
            })
            .refine((value) => !isNaN(value), {
              message: `${field.name} must be a valid number`,
            })
          : z
            .union([z.string(), z.number()])
            .transform((value) => {
              if (typeof value === "string") {
                return parseFloat(value.replace(/,/g, ""));
              }
              return value;
            })
            .optional();
        break;
      case "location":
        fieldSchema = field.required
          ? z.array(z.string()).optional()
          : z.array(z.string()).optional();
        break;
      case "price":
        fieldSchema = field.required
          ? z
            .union([z.string(), z.number()])
            .transform((value) =>
              typeof value === "string" ? parseFloat(value) : value
            )
            .refine((value) => !isNaN(value), {
              message: `${field.name} must be a valid number`,
            })
          : z.number().optional();
        break;
      case "rentprice":
        fieldSchema = field.required
          ? z
            .union([z.string(), z.number()])
            .transform((value) =>
              typeof value === "string" ? parseFloat(value) : value
            )
            .refine((value) => !isNaN(value), {
              message: `${field.name} must be a valid number`,
            })
          : z.number().optional();
        break;
      case "serviceprice":
        fieldSchema = field.required
          ? z.string().optional()
          : z.string().optional();
        break;
      case "priceper":
        fieldSchema = field.required
          ? z
            .union([z.string(), z.number()])
            .transform((value) =>
              typeof value === "string" ? parseFloat(value) : value
            )
            .refine((value) => !isNaN(value), {
              message: `${field.name} must be a valid number`,
            })
          : z.number().optional();
        break;
      case "bulkprice":
        fieldSchema = field.required
          ? z
            .union([z.string(), z.number()])
            .transform((value) =>
              typeof value === "string" ? parseFloat(value) : value
            )
            .refine((value) => !isNaN(value), {
              message: `${field.name} must be a valid number`,
            })
          : z.number().optional();
        break;
      case "delivery":
        fieldSchema = field.required
          ? z.array(deliveryItemSchema).nonempty(`${field.name} is required`)
          : z.array(deliveryItemSchema).optional();
        break;
      case "phone":
        fieldSchema = field.required
          ? z.string().nonempty(`${field.name} is required`)
          : z.string().optional();
        break;
      case "notify":
        fieldSchema = field.required
          ? z.string().optional()
          : z.string().optional();
        break;
      case "year":
        fieldSchema = field.required
          ? z.string().nonempty(`${field.name} is required`)
          : z.string().optional();
        break;

      case "autocomplete":
        fieldSchema = field.required
          ? z.string().nonempty(`${field.name} is required`)
          : z.string().optional();
        break;

      case "related-autocompletes":
        fieldSchema = field.required
          ? z.string().optional() // Adjust based on your logic
          : z.string().optional();
        break;

      case "select":
        fieldSchema = field.required
          ? z.string().nonempty(`${field.name} is required`)
          : z.string().optional();
        break;

      case "multi-select":
        fieldSchema = field.required
          ? z.array(z.string())
          : z.array(z.string()).optional();
        break;
      case "gps":
        fieldSchema = field.required
          ? z.array(z.string()).optional()
          : z.array(z.string()).optional();
        break;
      case "propertyarea":
        fieldSchema = field.required
          ? z.array(z.string()).optional()
          : z.array(z.string()).optional();
        break;
      case "radio":
        fieldSchema = field.required
          ? z.string().nonempty(`${field.name} is required`)
          : z.string().optional();
        break;

      case "checkbox":
        fieldSchema = field.required
          ? z.boolean().refine((val) => val === true, {
            message: `${field.name} must be checked`,
          })
          : z.boolean().optional();
        break;

      case "textarea":
        fieldSchema = field.required
          ? z.string().nonempty(`${field.name} is required`)
          : z.string().optional();
        break;

      case "youtube-link":
        fieldSchema = field.required
          ? z
            .string()
            .refine((value) => value === "" || youtubeRegex.test(value) || tiktokRegex.test(value), {
              message: "Invalid YouTube or TikTok URL",
            })
          : z
            .string()
            .refine((value) => value === "" || youtubeRegex.test(value) || tiktokRegex.test(value), {
              message: "Invalid YouTube or TikTok URL",
            })
            .optional();
        break;
      case "virtualTourLink":
        fieldSchema = field.required
          ? z
            .string()
            .url({ message: "Invalid URL format" })
            .refine((url) => isTrustedVirtualTourUrl(url), {
              message: "URL must be from a trusted 3D virtual tour platform e.g kuula.co, cloudpano.com, teliportme.com",
            })
          : z
            .string()
            .url({ message: "Invalid URL format" })
            .refine((url) => isTrustedVirtualTourUrl(url), {
              message: "URL must be from a trusted 3D virtual tour platform e.g kuula.co, cloudpano.com, teliportme.com",
            })
            .optional();
        break;

      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    schemaShape[field.name] = fieldSchema; // Ensure fieldSchema is always assigned
  });

  return z.object(schemaShape);
};
