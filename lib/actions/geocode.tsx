// lib/geocode.ts
export const getAddressFromLatLng_ = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLEAPIKEY}`
    );
    const data = await response.json();
    if (data.status === "OK") {
      return data.results[0]?.formatted_address || null;
    } else {
      console.error("Geocoding error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};
export const getAddressFromLatLng = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLEAPIKEY}`
    );
    const data = await response.json();

    if (data.status === "OK") {
      const components = data.results[0]?.address_components || [];

      let neighborhood = "";
      let sublocality = "";
      let city = "";
      let county = "";
      let country = "";

      components.forEach((comp: any) => {
        if (comp.types.includes("neighborhood")) {
          neighborhood = comp.long_name;
        } else if (comp.types.includes("sublocality") || comp.types.includes("sublocality_level_1")) {
          sublocality = comp.long_name;
        } else if (comp.types.includes("locality")) {
          city = comp.long_name;
        } else if (comp.types.includes("administrative_area_level_2")) {
          county = comp.long_name;
        } else if (comp.types.includes("country")) {
          country = comp.long_name;
        }
      });

      // Build full address
      const parts = [neighborhood, sublocality, city || county, country].filter(Boolean);
      return parts.join(", ");
    } else {
      console.error("Geocoding error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};
