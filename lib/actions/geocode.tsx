// lib/geocode.ts
export const getAddressFromLatLng = async (lat: number, lng: number): Promise<string | null> => {
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
  export const getAddressFromLatLng_ = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLEAPIKEY}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const addressComponents = data.results[0]?.address_components || [];
        let city = "";
        let country = "";
  
        addressComponents.forEach((component: any) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
  
        return `${city}${city && country ? ', ' : ''}${country}` || null;
      } else {
        console.error("Geocoding error:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };
  