import { Card, CardContent } from "@/components/ui/card";
import { IUser } from "@/types/database";
import { MapPin, Phone, QrCode } from "lucide-react";

interface DonorCardProps {
  donor: IUser;
}

export function DonorCard({ donor }: DonorCardProps) {
  return (
    <Card className="bg-gradient-to-br from-emergency-600 to-emergency-700 text-white border-none shadow-xl overflow-hidden">
      <CardContent className="p-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
        </div>

        {/* Content */}
        <div className="relative space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-emergency-100">Digital Donor Card</p>
              <h3 className="text-2xl font-bold mt-1">{donor.name}</h3>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <QrCode className="h-12 w-12 text-emergency-600" />
            </div>
          </div>

          {/* Blood Group - Prominent */}
          <div className="flex items-center gap-3 py-4">
            <div className="text-left">
              <p className="text-sm text-emergency-100">Blood Group</p>
              <div className="text-6xl font-bold mt-1">{donor.bloodGroup}</div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emergency-500">
            <div>
              <p className="text-xs text-emergency-100">Phone</p>
              <p className="text-sm font-medium flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" />
                {donor.phone.slice(-4)}****
              </p>
            </div>
            <div>
              <p className="text-xs text-emergency-100">Location</p>
              <p className="text-sm font-medium flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {donor.location.thana}
              </p>
            </div>
            <div>
              <p className="text-xs text-emergency-100">Total Donations</p>
              <p className="text-2xl font-bold mt-1">{donor.totalDonations}</p>
            </div>
            <div>
              <p className="text-xs text-emergency-100">Donor ID</p>
              <p className="text-sm font-mono mt-1">BD{donor._id ? String(donor._id).slice(-6) : 'N/A'}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-emergency-500">
            <p className="text-xs text-emergency-100">Scan to Verify</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
