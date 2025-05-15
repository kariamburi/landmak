import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface GetDirectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: string; // Could be coordinates or an address string
}

export function GetDirectionsDialog({
  open,
  onOpenChange,
  destination,
}: GetDirectionsDialogProps) {
  const handleAccept = () => {
    //const encodedDestination = encodeURIComponent(destination);
    const googleMapsUrl = destination;
    window.open(googleMapsUrl, "_blank");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>📍 Redirect to Google Maps</AlertDialogTitle>
          <AlertDialogDescription>
            This will open Google Maps to navigate to the property location.
            Do you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept}>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
