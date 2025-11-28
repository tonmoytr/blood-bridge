"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Activity,
  ArrowRight,
  Droplet,
  Heart,
  MapPin,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BloodBridgeRedesign() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-500 selection:text-white overflow-x-hidden">
      
      {/* --- GLOBAL ANIMATIONS --- */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 2s; }
        .animate-heartbeat { animation: heartbeat 1.5s infinite; }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrollY > 20 ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-white/60 backdrop-blur-sm py-6"
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 group-hover:animate-ping"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Droplet size={20} fill="currentColor" className="text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                BloodBridge
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
  <Link href="/signin">
    <Button variant="ghost" className="text-slate-700 hover:text-red-600 font-medium">
      Sign In
    </Button>
  </Link>
  <Link href="/signup">
    <Button className="bg-red-600 text-white hover:bg-red-700 border-none shadow-lg font-semibold rounded-full px-6">
      Sign Up
    </Button>
  </Link>
</div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[105vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50 rounded-b-[4rem] shadow-2xl z-20">
        
        {/* Background Fluid Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-rose-100 rounded-full blur-[120px]"></div>
          
          {/* Interactive Cells */}
          <div 
            className="absolute w-32 h-32 bg-gradient-to-br from-red-200 to-red-300 rounded-full blur-xl opacity-60 transition-transform duration-100 ease-out"
            style={{ 
              transform: `translate(${mousePos.x / 15}px, ${mousePos.y / 15}px)`,
              top: '20%', left: '30%' 
            }}
          />
          <div 
            className="absolute w-24 h-24 bg-red-200 rounded-full blur-md opacity-50 animate-float"
            style={{ top: '60%', left: '15%' }}
          />
          <div 
            className="absolute w-40 h-40 bg-red-300 rounded-full blur-2xl opacity-40 animate-float-delayed"
            style={{ top: '40%', right: '20%' }}
          />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 backdrop-blur-sm mb-4 animate-fade-in-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium text-red-700">Urgent: O- Blood needed in Dhaka</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
              <span className="block bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">Bridging Hope</span>
              <span className="block text-red-600 italic relative">
                to Life
                <svg className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[200px]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" className="text-red-500/50" />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A digital lifeline connecting verified donors with patients in critical need. 
              One tap, one connection, infinite impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/donor">
                <Button className="h-14 px-8 rounded-full bg-red-600 hover:bg-red-500 text-white text-lg font-semibold shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:scale-105 transition-all group">
                  Donate Now
                  <Heart className="ml-2 h-5 w-5 group-hover:animate-heartbeat" fill="currentColor" />
                </Button>
              </Link>
              <Link href="/seeker">
                <Button variant="outline" className="h-14 px-8 rounded-full border-gray-300 bg-white text-gray-900 hover:bg-gray-50 text-lg font-medium hover:border-red-500 transition-all">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Request Blood
                </Button>
              </Link>
            </div>

            {/* Real-time Stats Overlay */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 opacity-80">
              {[
                { l: "Active Donors", v: "24,502" },
                { l: "Lives Saved", v: "12,300+" },
                { l: "Avg. Response", v: "15 mins" },
                { l: "Cities Covered", v: "45" },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 backdrop-blur-sm hover:border-red-300 hover:shadow-lg transition-all">
                  <div className="text-2xl font-bold text-gray-900">{stat.v}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce text-gray-400">
          <ArrowRight className="rotate-90" />
        </div>
      </section>

      {/* --- LIVE ACTIVITY TICKER --- */}
      <div className="bg-red-600 text-white overflow-hidden py-4 relative z-30 -mt-12 mx-4 md:mx-12 rounded-xl shadow-2xl rotate-1 border-4 border-white/10 backdrop-blur-sm">
        <div className="flex whitespace-nowrap" style={{ animation: 'ticker 30s linear infinite' }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4">
              <span className="flex items-center gap-2 font-medium text-lg">
                <CheckCircleIcon />
                <span className="font-bold">Sarah R.</span> just donated 450ml
              </span>
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
              <span className="flex items-center gap-2 font-medium text-red-100 text-lg">
                <Activity size={18} />
                New Request: A+ Needed in Gulshan
              </span>
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
            </div>
          ))}
        </div>
      </div>

      {/* --- MISSION / APP PREVIEW SECTION --- */}
      <section id="mission" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-20">
            
            {/* Visual - App Interface Mockup */}
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-pink-100 rounded-full filter blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              
              <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden h-full w-full bg-white relative">
                  
                  {/* App UI Mock */}
                  <div className="bg-red-600 h-40 p-6 text-white rounded-b-3xl relative z-10">
                    <div className="flex justify-between items-center pt-8">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Users size={20} />
                      </div>
                      <div className="w-10 h-10 bg-white/20 rounded-full overflow-hidden flex items-center justify-center">
                         <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold text-xs">YOU</div>
                      </div>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold">Find a Donor</h3>
                  </div>

                  {/* Map/Cards UI */}
                  <div className="p-4 space-y-4 -mt-6 relative z-20">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${item * 0.2}s` }}>
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                          {item === 1 ? 'A+' : item === 2 ? 'O-' : 'B+'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">Donor #{item}24</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {item * 0.8}km away
                          </p>
                        </div>
                        <Button size="sm" className="rounded-full h-8 w-8 p-0 bg-green-500 hover:bg-green-600">
                          <Smartphone size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Floating Action Button */}
                  <div className="absolute bottom-6 right-6 w-14 h-14 bg-red-600 rounded-full shadow-lg flex items-center justify-center text-white animate-bounce">
                    <Droplet fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-1/2 space-y-8">
              <div className="inline-block">
                <Badge variant="outline" className="px-4 py-1 border-red-200 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                  Our Technology
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Intelligent Matching. <br />
                <span className="text-red-600">Zero Delays.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Traditional blood search is chaotic. BloodBridge uses geolocation and AI matching to instantly alert the nearest compatible donors. No more frantic calls—just seamless connection.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: ShieldCheck, title: "Verified Donors", desc: "100% ID verified community" },
                  { icon: Smartphone, title: "Instant Alerts", desc: "Push notifications for urgency" },
                  { icon: MapPin, title: "Live Tracking", desc: "Real-time donor location" },
                  { icon: Users, title: "Privacy First", desc: "Secure contact protocols" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600 mt-1">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How We Save Lives</h2>
            <p className="text-gray-600">Three simple steps to becoming a hero in someone's story.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Request", text: "Patient raises a request with blood type & location details.", icon: Activity },
              { step: "02", title: "Match", text: "Our algorithm alerts the nearest eligible donors instantly.", icon: Users },
              { step: "03", title: "Connect", text: "Donor accepts and navigates to the hospital securely.", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="group relative p-1 rounded-2xl bg-gradient-to-b from-red-100 to-transparent hover:from-red-200 transition-all duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-full bg-white p-8 rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl font-bold font-serif text-gray-900 select-none">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <item.icon className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA / FOOTER --- */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-none overflow-hidden relative rounded-3xl shadow-2xl transform transition-transform hover:scale-[1.01] duration-500">
             <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-20 gap-10">
               <div className="space-y-6 text-center md:text-left">
                 <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                   Ready to make a <br/> difference?
                 </h2>
                 <p className="text-red-100 text-lg max-w-md">
                   Join 25,000+ donors who are changing the world, one drop at a time.
                 </p>
               </div>
               
               <div className="flex flex-col gap-4 min-w-[300px]">
                 <div className="bg-white p-2 rounded-full flex shadow-xl transform transition-transform hover:scale-105">
                   <Input 
                     placeholder="Enter your phone number" 
                     className="border-none shadow-none focus-visible:ring-0 text-slate-900 pl-6" 
                   />
                   <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-8">
                     Join
                   </Button>
                 </div>
                 <p className="text-center text-sm text-red-200 opacity-80">
                   Download app for <span className="underline cursor-pointer hover:text-white">iOS</span> or <span className="underline cursor-pointer hover:text-white">Android</span>
                 </p>
               </div>
             </div>
          </Card>

          <footer className="mt-20 border-t border-slate-200 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white">
                  <Droplet size={16} fill="currentColor" />
                </div>
                BloodBridge
              </div>
              <div className="flex gap-6">
                <Link href="/donor" className="hover:text-red-600 transition-colors">Donate</Link>
                <Link href="/seeker" className="hover:text-red-600 transition-colors">Request</Link>
                <Link href="/profile" className="hover:text-red-600 transition-colors">Profile</Link>
              </div>
              <div>
                © 2024 BloodBridge
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center shadow-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-green-900">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  )
}