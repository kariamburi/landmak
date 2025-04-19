import { SoldStatus } from "@/lib/actions/dynamicAd.actions";
import React, { useState } from "react";

type Shape = {
  type: string;
  coordinates: { lat: number; lng: number }[];
  label: string;
  area: number;
  strokeColor: string;
  fillColor: string;
  status: "available" | "sold";
};

type Props = {
  shapes: Shape[];
  _id: string;
  userId:string;
  organizerId:string;
};

const PropertyShapesGrid: React.FC<Props> = ({ shapes, _id, userId, organizerId }) => {
  const [shapeList, setShapeList] = useState<Shape[]>(shapes);
const isAdCreator = userId === organizerId;
  const toggleStatus = async (index: number) => {
    const updatedShape = shapeList[index];
    const newStatus: "available" | "sold" = 
      updatedShape.status === "available" ? "sold" : "available";
    const newFillColor = newStatus === "sold" ? "#FF6B6B" : "#C1FFBD";
    const newStrokeColor = newFillColor;
  
    const updatedShapeList: Shape[] = shapeList.map((shape, i) =>
      i === index
        ? {
            ...shape,
            status: newStatus,
            fillColor: newFillColor,
            strokeColor: newStrokeColor,
          }
        : shape
    );
  
    setShapeList(updatedShapeList);
  
    try {
      const response = await SoldStatus(_id, updatedShapeList);
      if (!response) throw new Error("Failed to update status in MongoDB");
      console.log("Shape updated");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {shapeList.map((shape, index) => (
        <div
          key={index}
          onClick={() => isAdCreator ? toggleStatus(index): null}
          className="relative h-28 rounded-lg cursor-pointer border border-gray-300 shadow-md"
          style={{
            backgroundColor: shape.fillColor,
            borderColor: shape.strokeColor,
          }}
        >
          <div className="absolute top-2 left-2 text-xs font-semibold text-black bg-white/70 px-2 py-0.5 rounded">
            {shape.label}
          </div>
          <div className="absolute bottom-2 left-2 text-xs font-medium text-white bg-black/40 px-2 py-0.5 rounded">
            Status: {shape.status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyShapesGrid;
