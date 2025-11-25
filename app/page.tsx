import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { stats } from "@/lib/mock-data";
import { Droplet, Heart, Phone, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency-50 via-white to-trust-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Title */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Droplet className="h-12 w-12 md:h-16 md:w-16 text-emergency-600" fill="currentColor" />
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
                BloodBridge
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Emergency Blood Logistics for Bangladesh
            </p>
          </div>

          {/* Emergency CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/seeker">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 bg-emergency-600 hover:bg-emergency-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="mr-2 h-5 w-5" />
                Need Blood Now
              </Button>
            </Link>
            <Link href="/donor">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-trust-600 text-trust-700 hover:bg-trust-50 font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Heart className="mr-2 h-5 w-5" />
                Become a Donor
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <p className="text-sm text-gray-500 mb-4">Trusted by thousands across Bangladesh</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} value={stats.totalDonors.toLocaleString()} label="Donors" />
              <StatCard icon={Droplet} value={stats.activeDonors.toLocaleString()} label="Active Now" />
              <StatCard icon={Heart} value={stats.requestsFulfilled.toLocaleString()} label="Fulfilled" />
              <StatCard icon={Shield} value={stats.livesImpacted.toLocaleString()} label="Lives Saved" />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            How BloodBridge Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ProcessStep 
              number="1"
              title="Post Request"
              description="Seekers post emergency blood requests with hospital details and prescription"
              color="emergency"
            />
            <ProcessStep 
              number="2"
              title="Smart Matching"
              description="Eligible donors nearby are matched based on blood group and location"
              color="cooldown"
            />
            <ProcessStep 
              number="3"
              title="Secure Connect"
              description="Chat first, then phone reveal only after donor accepts. Mission mode tracking."
              color="trust"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Built for Emergencies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard 
              icon="🚨"
              title="999-Style Emergency"
              description="Fast, clear, minimal. Zero clutter. Every second counts."
            />
            <FeatureCard 
              icon="🛡️"
              title="Anti-Dalal Protection"
              description="Trust scores, verification, and report system to prevent fraud."
            />
            <FeatureCard 
              icon="⏱️"
              title="Smart Cooldown"
              description="90/120 day automatic cooldown keeps donors safe and healthy."
            />
            <FeatureCard 
              icon="🎯"
              title="Priority for Rare Blood"
              description="Negative blood groups get automatic priority and wider search."
            />
            <FeatureCard 
              icon="📍"
              title="Mission Mode Tracking"
              description="Uber-style status updates: Accepted → Leaving → At Hospital → Done."
            />
            <FeatureCard 
              icon="🏆"
              title="Donor Recognition"
              description="Badges and history to celebrate life-saving contributions."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            BloodBridge - Emergency Blood Logistics Platform
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with Next.js 16.0.3 | React 19 | Tailwind CSS 3.4
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/components" className="text-gray-400 hover:text-white text-sm">
              Components
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4 text-center">
        <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </CardContent>
    </Card>
  );
}

function ProcessStep({ number, title, description, color }: { number: string; title: string; description: string; color: "emergency" | "cooldown" | "trust" }) {
  const colorClasses = {
    emergency: "bg-emergency-100 text-emergency-700 border-emergency-300",
    cooldown: "bg-cooldown-100 text-cooldown-700 border-cooldown-300",
    trust: "bg-trust-100 text-trust-700 border-trust-300",
  };

  return (
    <div className="text-center space-y-3">
      <div className={`w-16 h-16 rounded-full ${colorClasses[color]} border-2 flex items-center justify-center mx-auto text-2xl font-bold`}>
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-3">
        <div className="text-4xl">{icon}</div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
