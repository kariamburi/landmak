// components/MapaVerificationForm.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUploadThing } from '@/lib/uploadthing';
import { createmapaVerification } from '@/lib/actions/mapaverification.actions';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
interface Props {
    userId:string;
    userName:string;
    userImage:string;
    ad:any;

}
const MapaVerificationForm: React.FC<Props> = ({ ad, userId, userImage, userName }) => {
const { startUpload } = useUploadThing("imageUploader");
const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    idNumber: '',
    kraPin: '',
    parcelNumber: '',
    consentStatus: 'not-applicable',
    ad: ad._id || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formElement = e.target as HTMLFormElement;
    const formDataToSend = new FormData(formElement);

    const fileUploadFields = [
      'titleDeed',
      'landSearch',
      'idCopy',
      'kraPinCopy',
      'buildingPlans',
      'occupationCertificate',
      'utilityClearance',
      'landRatesClearance',
      'shareCertificate',
      'siteReport',
    ];

    const uploadedFiles: { [key: string]: string } = {};

    for (const field of fileUploadFields) {
      const file = formDataToSend.get(field) as File;
      if (file && file.size > 0) {
        const res = await startUpload([file]);
        if (res && res[0]?.url) {
          uploadedFiles[field] = res[0].url;
        }
      }
    }
console.log(uploadedFiles);
    const payload = {
      ...formData,
      files: uploadedFiles,
    };
alert("ceating");
    const result = await createmapaVerification(payload);

   if (result.success) {
  formElement.reset(); // reset file inputs
  setFormData({
    fullName: '',
    phone: '',
    idNumber: '',
    kraPin: '',
    parcelNumber: '',
    consentStatus: 'not-applicable',
    ad: ad._id || '',
  });
} else {
      console.error('Submission failed');
      alert('Something went wrong.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit form.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog>
      <DialogTrigger asChild>
      
          <div className="mt-2 flex cursor-pointer rounded w-full text-xs p-2 text-gray-600 border border-gray-600 bg-gray-100 hover:bg-gray-200 justify-center items-center gap-1">
                  <VerifiedOutlinedIcon className="w-4 h-4 mr-2" />
                  Verify this Property
                </div>
      </DialogTrigger>
      <DialogContent className="w-full bg-[#e4ebeb] max-h-[90vh] lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <h1 className="text-xl font-bold mb-4 text-center">Mapa Verified Badge Application</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Full Name</label>
            <input name="fullName" onChange={handleChange} value={formData.fullName} required className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" />
          </div>

          <div>
            <label>Phone Number</label>
            <input name="phone" onChange={handleChange} value={formData.phone} required className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" />
          </div>

          <div>
            <label>ID Number</label>
            <input name="idNumber" onChange={handleChange} value={formData.idNumber} required className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" />
          </div>

          <div>
            <label>KRA PIN</label>
            <input name="kraPin" onChange={handleChange} value={formData.kraPin} required className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" />
          </div>

          <div>
            <label>Parcel / LR Number</label>
            <input name="parcelNumber" onChange={handleChange} value={formData.parcelNumber} required className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" />
          </div>

          <div>
            <label>Upload Title Deed</label>
 <div className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4">
            <input type="file" name="titleDeed" required />
            </div>
          </div>

          <div>
            <label>Upload Recent Land Search Certificate</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="landSearch" required />
          </div>

          <div>
            <label>Upload ID Copy (Front & Back)</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="idCopy" required />
          </div>

          <div>
            <label>Upload KRA PIN Certificate</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="kraPinCopy" required />
          </div>

          <div>
            <label>Do you have spousal or LCB consent? (if required)</label>
            <select name="consentStatus" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" value={formData.consentStatus} onChange={handleChange}>
              <option value="not-applicable">Not Applicable</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <hr />
          <h2 className="text-lg font-semibold">Additional for Built Property (House, Apartment)</h2>

          <div>
            <label>Upload Approved Building Plans</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="buildingPlans" />
          </div>

          <div>
            <label>Upload Occupation Certificate</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="occupationCertificate" />
          </div>

          <div>
            <label>Upload Utility Bill Clearance (Water, Electricity)</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="utilityClearance" />
          </div>

          <div>
            <label>Upload County Land Rates Clearance</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="landRatesClearance" />
          </div>

          <div>
            <label>If apartment/flat: Upload Share Certificate or Sectional Title</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="shareCertificate" />
          </div>

          <div>
            <label>Optional: Upload Site Visit/Surveyor Report</label>
            <input type="file" className="w-full text-base bg-white dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4" name="siteReport" />
          </div>

       <Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Processing...' : 'Apply for Mapa Verified Badge'}
</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MapaVerificationForm;
