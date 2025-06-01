'use client';

import { useEffect, useState } from 'react';
import { getAllMapaVerifications, updateMapaVerificationStatus } from '@/lib/actions/mapaverification.actions';
import { Button } from '@/components/ui/button';

interface MapaVerification {
  _id: string;
  fullName: string;
  phone: string;
  parcelNumber: string;
  ad: string;
  consentStatus: string;
  status: 'pending' | 'approved' | 'rejected';
  files: { [key: string]: string };
}

export default function MapaVerificationsPage() {
  const [verifications, setVerifications] = useState<MapaVerification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllMapaVerifications();
      setVerifications(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    await updateMapaVerificationStatus(id, status);
    setVerifications((prev) =>
      prev.map((v) => (v._id === id ? { ...v, status } : v))
    );
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mapa Verification Submissions</h1>
      {verifications.length === 0 && <p>No submissions found.</p>}
      <div className="space-y-6">
        {verifications.map((v) => (
          <div key={v._id} className="border rounded p-4 shadow">
            <p><strong>Name:</strong> {v.fullName}</p>
            <p><strong>Phone:</strong> {v.phone}</p>
            
               <p  className="gap-2 flex items-center">  <strong>Ad Id:</strong> <a
              href={process.env.NEXT_PUBLIC_DOMAIN_URL+"?Ad="+v.ad}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-green-500 underline"
            >
               {v.ad}
            </a></p>
            <p><strong>Parcel Number:</strong> {v.parcelNumber}</p>
            <p><strong>Consent Status:</strong> {v.consentStatus}</p>
            <p><strong>Status:</strong> <span className={`capitalize ${v.status === 'approved' ? 'text-green-600' : v.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{v.status}</span></p>

            <details className="mt-2">
              <summary className="cursor-pointer">View Uploaded Files</summary>
              <ul className="ml-4 mt-2 list-disc">
                {Object.entries(v.files).map(([key, url]) => (
                  <li key={key}>
                    <a href={url} target="_blank" className="text-blue-600 underline">{key}</a>
                  </li>
                ))}
              </ul>
            </details>

            <div className="mt-4 space-x-2">
              <Button onClick={() => handleStatusChange(v._id, 'approved')} disabled={v.status === 'approved'} variant="default">Approve</Button>
              <Button onClick={() => handleStatusChange(v._id, 'rejected')} disabled={v.status === 'rejected'} variant="destructive">Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
