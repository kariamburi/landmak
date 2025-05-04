import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import QRCode from 'qrcode';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
const CopyShareAdLink = ({ _id, titleId }: { _id: string, titleId:string }) => {
  const [copied, setCopied] = useState(false);

const adUrl =process.env.NEXT_PUBLIC_DOMAIN_URL+"?"+titleId+"="+_id;
  const handleCopy = () => {
    navigator.clipboard.writeText(adUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this "+titleId+"!",
          url: adUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };
const saveQRcode = async () => {
  
    try {
      const qrDataURL = await QRCode.toDataURL(adUrl);
  
      // Create download link
      const link = document.createElement('a');
      link.href = qrDataURL;
      link.download = 'mapa-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }

  }
  return (
    <div className="w-full flex gap-1 items-center justify-between">
    {/* <Button onClick={handleCopy} variant="outline" className="flex items-center gap-1">
        <Copy /> {copied ? "Copied!" : "Copy Link"}
      </Button>
      <Button onClick={saveQRcode} variant="outline" className="flex items-center gap-1">
        <QrCode2OutlinedIcon /> QRcode
      </Button>
      <Button onClick={handleShare} variant="outline" className="flex items-center gap-1">
        <Share2 /> Share
      </Button> */} 
     <div onClick={handleCopy} className="flex cursor-pointer p-2 border rounded-sm items-center gap-1 hover:bg-green-100">
        <Copy /> {copied ? "Copied!" : "Copy Link"}
      </div>
      <div onClick={saveQRcode} className="flex cursor-pointer p-2 border rounded-sm items-center gap-1 hover:bg-green-100">
        <QrCode2OutlinedIcon /> QRcode
      </div>
      <div onClick={handleShare} className="flex cursor-pointer p-2 border rounded-sm items-center gap-1 hover:bg-green-100">
        <Share2 /> Share
      </div> 
    </div>
  );
};

export default CopyShareAdLink;
