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
  