'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createLandDispute } from '@/lib/actions/landdispute.actions';
import SendChat from './SendChat';
import { sendEmail } from '@/lib/actions/sendEmail';
import { debounce } from "lodash";
import { useUploadThing } from '@/lib/uploadthing';
interface ReportDisputeProps {
    userId:string;
    userName:string;
    userImage:string;
    ad:any
  isOpen: boolean;
  onClose: () => void;
}
const LandDisputeReportForm: React.FC<ReportDisputeProps> = ({ ad, isOpen,userId, userImage, userName, onClose }) => {
  const [formData, setFormData] = useState({
    parcel: '',
    type: 'disputed',
    description: '',
    evidence: null as File | null,
    contact: '',
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { NotifyUser } = SendChat(); // Get the sendMessage function
  const { startUpload } = useUploadThing("imageUploader");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as any;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, evidence: files?.[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(false);

  try {
    // TODO: If needed, upload evidence first to get the evidence URL.
    let evidenceUrl = '';

    // Upload the evidence file if present
    if (formData.evidence) {
      const uploadedImages:any = await startUpload([formData.evidence]);
      if (uploadedImages && uploadedImages.length > 0) {
        evidenceUrl = uploadedImages[0].url;
      }
    }


    const response = await createLandDispute({
      report: {
        parcel: formData.parcel,
        type: formData.type,
        description: formData.description,
        contact: formData.anonymous ? '' : formData.contact,
        anonymous: formData.anonymous,
        evidenceUrl: evidenceUrl || undefined,
        ad: ad._id,
      },
      path: '/disputes',
    });
if (ad.organizer?.token && ad.organizer?.notifications?.fcm) {
  const disputeMessage = `Your property "${ad.data.title}" has been reported for dispute.`;
  const debouncedNotifyUser = debounce(NotifyUser, 1000); // debounce to prevent spam
  const Name = formData.anonymous ? 'Reported anonymously' : userName;
  debouncedNotifyUser(ad, userId, Name, disputeMessage);
}

if (ad.organizer?.notifications?.email) {
  const adTitle = ad.data.title;
  const adUrl = `https://mapa.co.ke/?Ad=${ad._id}`;
  const recipientEmail = ad.organizer.email;

  //const emailMessagee = `A dispute has been filed regarding your property titled "${adTitle}". Please review the details.`;
const emailMessage = `
A dispute has been filed on your property "${adTitle}" (Parcel: ${formData.parcel}).

Type: ${formData.type}
Description: ${formData.description}

Visit: ${adUrl}

${formData.anonymous ? 'Reported anonymously' : `Reported by ${userName}`}
`;
  await sendEmail(
    recipientEmail,
    emailMessage,
    adTitle,
    adUrl,
    formData.anonymous ? 'Reported anonymously' : userName,
    formData.anonymous ? '/avator.png' : userImage
  );
}
    setSuccess(true);
    setFormData({
      parcel: '',
      type: 'disputed',
      description: '',
      evidence: null,
      contact: '',
      anonymous: false,
    });
  } catch (err) {
    console.error('Submission failed', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
     
      <DialogContent className="w-full lg:max-w-xl bg-[#e4ebeb] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Report Land Dispute</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Parcel / LR Number</label>
            <input
              name="parcel"
              value={formData.parcel}
              onChange={handleChange}
              required
             className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4"
              placeholder="e.g. KJD/12345"
            />
          </div>

          <div>
            <label>Type of Dispute</label>
            <select  className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="type" value={formData.type} onChange={handleChange} required>
              <option value="court-case">Court Case</option>
              <option value="double-allocation">Double Allocation</option>
              <option value="succession">Succession Issue</option>
              <option value="fraud">Fraudulent Sale</option>
              <option value="boundary">Boundary Dispute</option>
              <option value="disputed">General Dispute</option>
            </select>
          </div>

          <div>
            <label>Description of the Dispute</label>
            <textarea
              name="description"
              rows={4}
              onChange={handleChange}
              value={formData.description}
              required
              className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4"
              placeholder="Brief explanation of the dispute, history, involved parties, etc."
            />
          </div>

          <div>
            <label>Upload Evidence (optional)</label>
            <input  className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" type="file" name="evidence" onChange={handleChange} />
          </div>

          <div>
            <label>Contact Information (optional)</label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4"
              placeholder="Phone or email (optional)"
              disabled={formData.anonymous}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleChange} />
              Report Anonymously
            </label>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Dispute Report'}
          </Button>

          {success && <p className="text-green-600">Dispute submitted successfully!</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LandDisputeReportForm;

