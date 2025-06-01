'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { fetchAllDisputes, updateDisputeStatus } from '@/lib/actions/landdispute.actions';
import { DisputeBadge } from './DisputeBadge';
import { Badge } from "@/components/ui/badge"
interface Dispute {
  _id: string;
  parcel: string;
  type: string;
  description: string;
  contact?: string;
  anonymous: boolean;
  evidenceUrl?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  confidence: 'reported' | 'suspected' | 'verified';
  createdAt: string;
}

const AdminDisputeManager = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
 const [loadingDisputes, setLoadingDisputes] = useState(false);

  useEffect(() => {
    const loadDisputes = async () => {
        setLoadingDisputes(true);
      const result = await fetchAllDisputes(); // You must implement this in your actions
      setDisputes(result);
      setLoadingDisputes(false);
    };
    loadDisputes();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Dispute['status']) => {
    setLoading(true);
    await updateDisputeStatus(id, newStatus);
    setDisputes((prev) =>
      prev.map((dispute) =>
        dispute._id === id ? { ...dispute, status: newStatus } : dispute
      )
    );
    setLoading(false);
  };
 if (loadingDisputes) return <p>Loading land disputes...</p>;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Land Disputes</h2>
        {disputes.length === 0 && <p>No dispute found.</p>}
      <div className="grid gap-4">
        {disputes.map((dispute) => (
          <div key={dispute._id} className="p-4 border rounded shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Parcel: {dispute.parcel}</h3>
                <p className="text-sm text-gray-600">Type: {dispute.type}</p>
                <p className="text-sm">{dispute.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Reported on {new Date(dispute.createdAt).toLocaleString()}
                </p>
                {dispute.contact && !dispute.anonymous && (
                  <p className="text-sm mt-2">Contact: {dispute.contact}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="capitalize">
                  {dispute.status}
                </Badge>

                <div className="flex gap-1">
                  {['pending', 'reviewed', 'dismissed'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      disabled={dispute.status === status || loading}
                      onClick={() => handleStatusChange(dispute._id, status as Dispute['status'])}
                    >
                      {status}
                    </Button>
                  ))}
                </div>

                {dispute.evidenceUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View Evidence
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <Image
                        src={dispute.evidenceUrl}
                        alt="Evidence"
                        width={600}
                        height={400}
                        className="rounded object-contain max-h-[80vh] w-full"
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDisputeManager;
