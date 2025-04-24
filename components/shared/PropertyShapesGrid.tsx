import { SoldStatus } from "@/lib/actions/dynamicAd.actions";
import React, { useState } from "react";
import { X } from "lucide-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ScrollArea } from "../ui/scroll-area";

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
  userId: string;
  organizerId: string;
};

const PropertyShapesGrid: React.FC<Props> = ({ shapes, _id, userId, organizerId }) => {
  const [shapeList, setShapeList] = useState<Shape[]>(shapes);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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
      if (!shapes || shapes.length === 0) {
        console.warn("Initial shapes are invalid or empty");
        return;
      }
      const response = await SoldStatus(_id, updatedShapeList);
      if (!response) throw new Error("Failed to update status in MongoDB");
      
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const updatedShapeList = shapeList.filter((_, i) => i !== deleteIndex);
    setShapeList(updatedShapeList);
    setDeleteIndex(null);

    try {
      const response = await SoldStatus(_id, updatedShapeList);
      if (!response) throw new Error("Failed to update shapes in MongoDB after deletion");
    } catch (error) {
      console.error("Error deleting shape:", error);
    }
  };
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className="p-2 border mt-2 rounded-lg bg-white w-full">
      <p className="font-font bg-green-100 text-green-800 px-3 py-1 rounded-md inline-block mb-4 shadow-sm">
        Available Property Layouts
      </p>
      <ScrollArea className="max-h-[450px] overflow-y-auto flex p-0 bg-white rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
        {shapeList.map((shape, index) => (
          <div
            key={index}
            onClick={() => isAdCreator ? toggleStatus(index) : null}
            className="relative h-18 rounded-lg cursor-pointer border border-gray-300 shadow-md"
            style={{
              backgroundColor: shape.fillColor,
              borderColor: shape.strokeColor,
            }}
          >
            <div className="absolute top-2 left-1 text-xs font-semibold text-black bg-white/70 px-2 py-0.5 rounded">
              {shape.label}
            </div>
            <div className="absolute bottom-2 left-1 text-xs text-white bg-black/40 px-2 py-0.5 rounded">
              {capitalizeFirstLetter(shape.status)}
            </div>

            {isAdCreator && (
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteIndex(index);
                    }}
                    className="absolute top-2 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 max-w-md w-[90%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6">
                    <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                      Confirm Deletion
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mt-2 text-sm text-gray-700">
                      Are you sure you want to delete this shape? This action cannot be undone.
                    </AlertDialog.Description>

                    <div className="mt-4 flex justify-end gap-3">
                      <AlertDialog.Cancel asChild>
                        <button className="px-4 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100">
                          Cancel
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          onClick={confirmDelete}
                          className="px-4 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            )}
          </div>
        ))}
      </div>
      </ScrollArea>
    </div>
  );
};

export default PropertyShapesGrid;
