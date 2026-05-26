import React, { useState, useEffect } from "react";
import { Route, Switch, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, PlaySquare, Shield, Clock, Zap, Send, CheckCircle2, Youtube, ChevronRight, Phone, Star, User, X, LogOut, MessageSquare
} from "lucide-react";
import { SiVisa, SiMastercard, SiApplepay } from "react-icons/si";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function YtLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 90 63" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="63" rx="14" fill="#FF0000"/>
      <polygon points="36,18 36,45 62,31.5" fill="white"/>
    </svg>
  );
}

type UserType = { name: string; phone: string };
type ReviewItem = { user: string; date: string; text: string; stars: number };

const UserContext = React.createContext<{
  user: UserType | null;
  setUser: (u: UserType | null) => void;
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
}>({ user: null, setUser: () => {}, showLogin: false, setShowLogin: () => {} });

const INITIAL_REVIEWS: ReviewItem[] = [
  { user: "استغفرالله. .", date: "2026/03/30", stars: 5, text: "انصح بالتعامل معهم في قمة الأخلاق لو فيه أكثر من 5 نجوم أعطيتهم وزيادة" },
  { user: "مؤيد علي 1", date: "2026/03/30", stars: 5, text: "صدق ثقه والله يرزقهم 💐 اشتركت يوتيوب عندهم" },
  { user: "محمد مسفر الأحمري", date: "2026/03/30", stars: 5, text: "مضمون الله يوفقهم سرعة في الاستجابه ومحترمين انصح بالتعامل معاهم" },
  { user: "user 48 9646390", date: "2026/03/28", stars: 5, text: "أشتركت معهم في يوتيوب بريميوم وافي وصادق وأنصح بالتعامل معه" },
  { user: "12yasser34", date: "2026/03/27", stars: 5, text: "جدا حلوه انصحكم اشترو منهم ترونهم ثقه عمياء" },
  { user: "aarar12", date: "2026/03/23", stars: 5, text: "رجال أمين وثقه وسريع وتعامله راقي" },
  { user: "wash", date: "2026/03/20", stars: 5, text: "جميل وأكثر متجر أشتري منه" },
  { user: "oplopl", date: "2026/03/19", stars: 5, text: "أفضل وأرخص متجر تعاملت معه وسريع بالتسليم" },
  { user: "فهد عبدالله زايد العتيبي", date: "2026/03/15", stars: 5, text: "ثقه ألف وشكراً له" },
  { user: "user 64 52039", date: "2026/03/02", stars: 5, text: "متجر ثقه وعوضوني على التأخير" },
  { user: "abookhhlid", date: "2026/02/28", stars: 5, text: "رجل بمعنى الكلمة ومصداقية ولا أروع" },
  { user: "عبد العزيز 100110", date: "2026/02/26", stars: 5, text: "مصداقية عالية وفقهم الله" },
  { user: "user 11 19807", date: "2026/02/23", stars: 5, text: "ثقه وسرعة فالرد والتسليم" },
  { user: "أبو أحمد 9812", date: "2026/02/22", stars: 5, text: "تعامل وسرعة وثقه" },
  { user: "ixmh_9", date: "2026/02/17", stars: 5, text: "يوتيوب بريميوم، متعاون وسريع ومصداقية" },
  { user: "rultaz", date: "2026/02/10", stars: 5, text: "جيد جداً يعطيهم العافية" },
  { user: "ابو محمد 2594", date: "2026/01/17", stars: 5, text: "ثقه وسرعه" },
  { user: "user 61 52879", date: "2026/01/15", stars: 5, text: "سرعة اشتراك وأرخص سعر" },
  { user: "hmoody.11", date: "2026/01/14", stars: 5, text: "صادقين وأسعارهم رخيصة" },
  { user: "ابونايف1992", date: "2026/01/13", stars: 5, text: "سريعين بالرد وقيمة الاشتراك ممتازة" },
  { user: "hm91-", date: "2026/01/13", stars: 5, text: "اشتراك يوتيوب سريع وتعامل مميز وضمان" },
  { user: "ناصر الدوسـري", date: "2026/01/11", stars: 5, text: "يوتيوب بريميوم، سرعة ورد وضمان وسعر ممتاز" },
];

const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: "الاسم الكامل مطلوب" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  phone: z.string().min(8, { message: "رقم الجوال مطلوب" }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;


function Navbar() {
  const { user, setUser, setShowLogin } = React.useContext(UserContext);
  return (
    <nav className="border-b sticky top-0 z-50" style={{background: "rgba(15,8,4,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(224,90,20,0.18)"}}>
       <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between relative">
         <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
            <Link href="/"><span className="hover:text-[#e05a14] transition-colors text-muted-foreground cursor-pointer">الرئيسية</span></Link>
            <a href="#reviews"><span className="hover:text-[#e05a14] transition-colors text-muted-foreground cursor-pointer">التقييمات</span></a>
            <Link href="/support"><span className="hover:text-[#e05a14] transition-colors text-muted-foreground cursor-pointer">دعم فني</span></Link>
         </div>

         <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
           <img src="/logo.png" alt="3YN" className="h-12 w-auto object-contain transition-transform hover:scale-105" style={{filter: "drop-shadow(0 0 8px rgba(224,90,20,0.55))"}} />
         </Link>

         <div className="flex items-center gap-3">
            <button className="text-foreground hover:text-[#e05a14] transition-colors" data-testid="button-search">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[80px]">{user.name}</span>
                <button
                  onClick={() => setUser(null)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                style={{background: "rgba(224,90,20,0.15)", border: "1px solid rgba(224,90,20,0.35)", color: "#e05a14"}}
              >
                <User className="w-3.5 h-3.5" />
                دخول
              </button>
            )}
         </div>
       </div>
    </nav>
  );
}

function LoginModal() {
  const { showLogin, setShowLogin, setUser } = React.useContext(UserContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    setUser({ name: name.trim(), phone: phone.trim() });
    setShowLogin(false);
    setName("");
    setPhone("");
  }

  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLogin(false)}
        >
          <div className="absolute inset-0" style={{background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)"}} />
          <motion.div
            className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl"
            style={{background: "rgba(20,10,5,0.98)", border: "1px solid rgba(224,90,20,0.3)"}}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{background: "rgba(224,90,20,0.15)", border: "1px solid rgba(224,90,20,0.3)"}}>
                <User className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-black" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>تسجيل الدخول</h2>
              <p className="text-muted-foreground text-sm mt-1">اختياري — لإضافة تقييمك</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">الاسم</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="اسمك"
                  required
                  minLength={2}
                  className="w-full h-11 rounded-lg px-4 text-sm text-white placeholder:text-muted-foreground outline-none transition-colors"
                  style={{background: "rgba(15,8,4,0.9)", border: "1px solid rgba(139,58,10,0.4)"}}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">رقم الجوال <span className="text-muted-foreground font-normal">(اختياري)</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="w-full h-11 rounded-lg px-4 text-sm text-white placeholder:text-muted-foreground outline-none transition-colors text-right"
                  style={{background: "rgba(15,8,4,0.9)", border: "1px solid rgba(139,58,10,0.4)"}}
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 mt-2"
                style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", boxShadow: "0 0 20px rgba(224,90,20,0.35)"}}
              >
                دخول
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          disabled={!onChange}
        >
          <Star
            className="w-4 h-4"
            fill={(hovered || value) >= i ? "#e05a14" : "none"}
            stroke={(hovered || value) >= i ? "#e05a14" : "#6b6b6b"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ reviews, setReviews }: { reviews: ReviewItem[]; setReviews: (r: ReviewItem[]) => void }) {
  const { user, setShowLogin } = React.useContext(UserContext);
  const [newText, setNewText] = useState("");
  const [newStars, setNewStars] = useState(5);
  const [showForm, setShowForm] = useState(false);

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user || newText.trim().length < 3) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
    setReviews([{ user: user.name, date: dateStr, text: newText.trim(), stars: newStars }, ...reviews]);
    setNewText("");
    setNewStars(5);
    setShowForm(false);
  }

  const avg = reviews.length ? (reviews.reduce((a,r) => a + r.stars, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <section id="reviews" className="py-16" dir="rtl" style={{background: "rgba(10,5,2,0.6)"}}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6" style={{borderColor: "rgba(224,90,20,0.2)"}}>
          <div>
            <h2 className="text-2xl md:text-3xl font-black" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>آراء العملاء</h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5" fill="#e05a14" stroke="#e05a14" />)}
              </div>
              <span className="text-2xl font-black text-white">{avg}</span>
              <span className="text-muted-foreground text-sm">({reviews.length} تقييم)</span>
            </div>
          </div>
          <button
            onClick={() => { if (!user) { setShowLogin(true); } else { setShowForm(v => !v); } }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 self-start md:self-auto"
            style={{background: "rgba(224,90,20,0.15)", border: "1px solid rgba(224,90,20,0.35)", color: "#e05a14"}}
          >
            <MessageSquare className="w-4 h-4" />
            {user ? "أضف تقييمك" : "سجل دخول لإضافة تقييم"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <form onSubmit={submitReview} className="rounded-2xl p-6 space-y-4" style={{background: "rgba(20,10,5,0.9)", border: "1px solid rgba(224,90,20,0.25)"}}>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground">تقييمك كـ <span className="text-primary">{user.name}</span></p>
                  <StarRating value={newStars} onChange={setNewStars} />
                </div>
                <textarea
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  placeholder="شاركنا رأيك..."
                  required
                  minLength={3}
                  rows={3}
                  className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground outline-none resize-none"
                  style={{background: "rgba(15,8,4,0.9)", border: "1px solid rgba(139,58,10,0.4)"}}
                />
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">إلغاء</button>
                  <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white text-sm transition-all hover:-translate-y-0.5" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", boxShadow: "0 0 15px rgba(224,90,20,0.3)"}}>نشر التقييم</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.6) }}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{background: "rgba(20,10,5,0.8)", border: "1px solid rgba(139,58,10,0.2)", backdropFilter: "blur(10px)"}}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)"}}>
                    {r.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground leading-tight">{r.user}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <StarRating value={r.stars} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-white pt-16 pb-8 mt-auto" style={{background: "rgba(15,8,4,0.97)", borderTop: "1px solid rgba(224,90,20,0.2)"}}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-zinc-400">
          <div>
            <div className="mb-5">
              <img src="/logo.png" alt="3YN" className="h-16 w-auto object-contain" style={{filter: "drop-shadow(0 0 10px rgba(224,90,20,0.4))"}} />
            </div>
            <p className="text-sm leading-relaxed mb-6">
              متجرك الأول المعتمد لبيع اشتراكات اليوتيوب بريميوم بأفضل الأسعار وأسرع وقت تفعيل. خدمة عملاء على مدار الساعة لخدمتكم وتلبية احتياجاتكم.
            </p>
          </div>

          <div className="md:px-8">
             <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-3 after:right-0 after:w-1/2 after:h-0.5 after:bg-primary pb-1">روابط مهمة</h4>
             <ul className="space-y-4 text-sm mt-4">
               <li><Link href="/policy/returns" className="hover:text-[#e05a14] transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full">سياسة الاسترداد والإسترجاع</Link></li>
               <li><Link href="/policy/terms" className="hover:text-[#e05a14] transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full">الشروط والأحكام</Link></li>
               <li><Link href="/policy/privacy" className="hover:text-[#e05a14] transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full">سياسة الخصوصية</Link></li>
               <li><Link href="/about" className="hover:text-[#e05a14] transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full">من نحن</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-3 after:right-0 after:w-1/2 after:h-0.5 after:bg-primary pb-1">تواصل معنا</h4>
             <ul className="space-y-5 text-sm mt-4">
               <li>
                 <a href="https://wa.me/966500708427" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25d366] transition-colors">
                   <svg className="w-5 h-5" fill="#25d366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.845L.057 23.571a.75.75 0 00.919.921l5.796-1.44A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.628 0 12 0zm0 21.75a9.74 9.74 0 01-4.964-1.358l-.354-.21-3.674.913.942-3.585-.232-.369A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                   <span dir="ltr">0500708427</span>
                 </a>
               </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} متجر عين</p>
          <div className="flex gap-4 items-center">
             <SiVisa className="w-10 h-10 opacity-50 hover:opacity-100 transition-opacity" />
             <SiMastercard className="w-10 h-10 opacity-50 hover:opacity-100 transition-opacity" />
             <SiApplepay className="w-12 h-10 opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function ProductDetail() {
  const handlePay = () => {
    window.location.href = "/#order";
  };

  return (
    <div dir="rtl" className="min-h-screen font-sans text-foreground overflow-x-hidden flex flex-col bg-transparent">

      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 max-w-6xl py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 p-3 rounded-lg" style={{background: "rgba(20,10,5,0.8)", backdropFilter: "blur(10px)"}}>
          <Link href="/"><span className="hover:text-primary cursor-pointer transition-colors">الرئيسية</span></Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <Link href="/#products"><span className="hover:text-primary cursor-pointer transition-colors">يوتيوب بريميوم</span></Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="text-foreground font-medium">اشتراك يوتيوب بريميوم | على ايميلك</span>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Left Column - Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="h-[400px] rounded-2xl relative flex flex-col items-center justify-center overflow-hidden shadow-2xl border"
            style={{background: "linear-gradient(135deg, #0d0805, #302b63, #24243e)", borderColor: "rgba(224,90,20,0.2)"}}
          >
            <div className="absolute inset-0 opacity-40" style={{backgroundImage: "radial-gradient(circle at 25% 75%, #e05a14 0%, transparent 55%), radial-gradient(circle at 75% 25%, #8b3a0a 0%, transparent 55%)"}} />
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px"}} />
            <Youtube className="w-28 h-28 mb-4 relative z-10" fill="#FF0000" style={{color: "#FF0000", filter: "drop-shadow(0 0 30px rgba(255,0,0,0.8)) drop-shadow(0 0 60px rgba(255,0,0,0.4))"}} />
            <span className="text-white font-black text-3xl tracking-tight relative z-10" style={{textShadow: "0 0 30px rgba(224,90,20,0.9), 0 2px 8px rgba(0,0,0,0.5)"}}>يوتيوب بريميوم</span>
            <Badge className="absolute bottom-6 right-6 bg-white text-red-700 hover:bg-white/90 font-bold text-lg px-4 py-1">
              <span className="line-through opacity-60 ml-1">29</span> 4 ر.س
            </Badge>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-6 p-8 rounded-2xl"
            style={{background: "rgba(20,10,5,0.8)", border: "1px solid rgba(139,58,10,0.2)", backdropFilter: "blur(10px)"}}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-foreground leading-tight" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>اشتراك يوتيوب بريميوم | على ايميلك</h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                <span className="text-green-500 font-medium text-sm">متوفر في المخزون</span>
              </div>
            </div>
            
            <div className="border-y py-4 flex items-baseline gap-3" style={{borderColor: "rgba(224,90,20,0.2)"}}>
              <span className="text-4xl font-black text-primary">4 <span className="text-xl font-bold text-primary/70">ر.س</span></span>
              <span className="text-xl font-bold text-zinc-500 line-through">29 ر.س</span>
            </div>
            
            <Button onClick={handlePay} className="w-full h-14 text-lg font-bold rounded-xl transition-all hover:-translate-y-0.5" style={{boxShadow: "0 0 20px rgba(224,90,20,0.4)"}} data-testid="button-pay-now">
              ادفع الآن
            </Button>
            
            <div className="pt-2">
              <Link href="/">
                <span className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm font-medium">
                  العودة للمتجر
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Info Sections */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Section 1 */}
          <Card className="shadow-sm" style={{background: "rgba(20,10,5,0.8)", border: "1px solid rgba(139,58,10,0.2)", backdropFilter: "blur(10px)"}}>
            <CardContent className="p-6 md:p-8 space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                <PlaySquare className="w-6 h-6 text-primary" />
                مميزات اشتراك يوتيوب بريميوم YouTube Premium
              </h3>
              <ul className="space-y-3 mt-4 text-muted-foreground font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  تحميل مقاطع الفيديو ومشاهدة بدون إنترنت
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  بدون أي إعلانات
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  يمكنك تشغيل الفيديوهات في الخلفية
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="shadow-sm" style={{background: "rgba(20,10,5,0.8)", border: "1px solid rgba(139,58,10,0.2)", backdropFilter: "blur(10px)"}}>
            <CardContent className="p-6 md:p-8 space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                <Shield className="w-6 h-6 text-primary" />
                لماذا متجر عين؟
              </h3>
              <ul className="space-y-3 mt-4 text-muted-foreground font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  توفير أكثر من 50% من سعر الإشتراك
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ما يحتاج تجديد تلقائي
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  إشتراكك آمن و رسمي 100%
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  تفعيل على ايميلك مباشر بدون ما نطلب كلمة المرور
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  خدمة عملاء 24/7 فورية عبر واتساب
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="shadow-sm" style={{background: "rgba(20,10,5,0.8)", border: "1px solid rgba(139,58,10,0.2)", backdropFilter: "blur(10px)"}}>
            <CardContent className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                <Zap className="w-6 h-6 text-primary" />
                خطوات التفعيل بعد الشراء
              </h3>
              
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-accent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-zinc-900 text-primary shadow-[0_0_10px_rgba(224,90,20,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">1</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl" style={{background: "rgba(20,10,5,0.5)", border: "1px solid rgba(224,90,20,0.15)"}}>
                    <p className="text-foreground font-medium">اطلب اشتراكك — يتوفر على متجرنا إشتراك يوتيوب بريميوم لمدة شهر واحد بسعر 4 ر.س فقط</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-zinc-900 text-primary shadow-[0_0_10px_rgba(224,90,20,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">2</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl" style={{background: "rgba(20,10,5,0.5)", border: "1px solid rgba(224,90,20,0.15)"}}>
                    <p className="text-foreground font-medium">راح توصلك رسالة رسمية من جوجل تطلب منك الإنضمام لمجموعة تابعة لنا للإشتراك في اليوتيوب</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-zinc-900 text-primary shadow-[0_0_10px_rgba(224,90,20,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">3</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl" style={{background: "rgba(20,10,5,0.5)", border: "1px solid rgba(224,90,20,0.15)"}}>
                    <p className="text-foreground font-medium">ما عليك غير تقبل الدعوة واستمتع باشتراكك مدفوع وما يحتاج أي خطوات ثانية</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl p-4 flex items-center gap-3 mt-6" style={{background: "rgba(139,58,10,0.15)", border: "1px solid rgba(139,58,10,0.3)", color: "#e9d5ff"}}>
                <Clock className="w-6 h-6 shrink-0 text-accent" />
                <p className="font-bold text-sm md:text-base">سرعة التفعيل مابين 10 دقائق الى 30 دقيقة من إتمام الطلب إن شاء الله</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="shadow-sm" style={{background: "rgba(30,20,10,0.8)", border: "1px solid rgba(217,119,6,0.3)", backdropFilter: "blur(10px)"}}>
            <CardContent className="p-6 md:p-8 space-y-4">
              <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                ملاحظات هامة
              </h3>
              <ul className="space-y-3 mt-4 text-amber-200/80 font-medium list-disc list-inside px-4">
                <li>لا يمكنك تغير الى عائله جديده الا مره واحده كل 12 شهر</li>
                <li className="leading-relaxed">المهلة المحددة لقبول الدعوة هي 24 ساعة من وقت ارسال الدعوة (يعني ضروري تقبل دعوة الإنضمام خلال 24 ساعة) بعد انتهاء المهلة ما يحقلك طلب دعوة جديد أو تعديل أو إسترجاع تكلفة الطلب إلا في حال يوجد سبب حقيقي.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="sticky bottom-0 left-0 right-0 p-4 border-t z-40 md:hidden flex justify-center" style={{background: "rgba(10, 10, 20, 0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(224,90,20,0.2)"}}>
        <Button onClick={handlePay} className="w-full max-w-sm h-14 text-lg font-bold rounded-xl" style={{boxShadow: "0 0 20px rgba(224,90,20,0.4)"}} data-testid="button-pay-now-mobile">
          ادفع الآن
        </Button>
      </div>

      <Footer />
    </div>
  );
}

function Home({ reviews, setReviews }: { reviews: ReviewItem[]; setReviews: (r: ReviewItem[]) => void }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(data: OrderFormValues) {
    const msg = encodeURIComponent(
      `مرحباً، أرغب في الاشتراك في يوتيوب بريميوم 🎬\n\n` +
      `الاسم: ${data.fullName}\n` +
      `الجوال: ${data.phone}\n` +
      `البريد الإلكتروني: ${data.email}\n` +
      `الباقة: اشتراك شهر واحد — 4 ر.س`
    );
    window.open(`https://wa.me/966500708427?text=${msg}`, "_blank");
    toast({
      title: "جاري التحويل لواتساب...",
      description: "سيتم تفعيل اشتراكك بعد تأكيد الطلب.",
      variant: "default",
    });
    form.reset();
  }

  return (
    <div dir="rtl" className="min-h-screen font-sans text-foreground overflow-x-hidden flex flex-col bg-transparent">

      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="py-6 md:py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border"
              style={{background: "linear-gradient(135deg, #0d0805, #302b63, #24243e)", boxShadow: "0 0 40px rgba(224,90,20,0.15)", borderColor: "rgba(224,90,20,0.3)"}}
            >
              <div className="absolute inset-0 opacity-40" style={{backgroundImage: "radial-gradient(circle at 25% 75%, #e05a14 0%, transparent 55%), radial-gradient(circle at 75% 25%, #8b3a0a 0%, transparent 55%)"}} />
              {/* Pattern Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
              
              <div className="flex-1 space-y-6 z-10">
                <div className="text-xs md:text-sm font-bold bg-white/10 inline-block px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/20">
                  يوتيوب بريميوم
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.2] drop-shadow-sm text-white">
                  وجهتك الافضل لإشتراكات اليوتيوب
                </h1>
                <ul className="space-y-4 text-white/95 font-medium mt-6 text-lg">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#e05a14]" style={{filter: "drop-shadow(0 0 5px rgba(224,90,20,0.5))"}} /> اشتراكات اصلية 100%</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#e05a14]" style={{filter: "drop-shadow(0 0 5px rgba(224,90,20,0.5))"}} /> ضمان دائم على طول فترة الاشتراك</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#e05a14]" style={{filter: "drop-shadow(0 0 5px rgba(224,90,20,0.5))"}} /> دعم 24 ساعة للعملاء</li>
                </ul>
                
                <div className="pt-6 flex items-center gap-6 text-white/90">
                  <SiVisa className="w-12 h-12 opacity-80 hover:opacity-100 transition-opacity" />
                  <SiMastercard className="w-12 h-12 opacity-80 hover:opacity-100 transition-opacity" />
                  <SiApplepay className="w-14 h-14 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="w-full md:w-1/3 max-w-xs z-10 hidden md:block">
                <motion.div 
                  initial={{ rotate: -5, scale: 0.95 }}
                  animate={{ rotate: -2, scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-3 shadow-2xl"
                >
                  <div className="bg-black/90 rounded-[1.5rem] aspect-[9/18] p-4 flex flex-col relative overflow-hidden shadow-inner border border-zinc-800">
                     <div className="flex justify-between items-center mb-6">
                       <Youtube className="w-8 h-8 text-primary" style={{filter: "drop-shadow(0 0 8px rgba(224,90,20,0.6))"}} />
                       <div className="w-8 h-8 bg-zinc-800 rounded-full" />
                     </div>
                     <div className="bg-zinc-800 w-full h-36 rounded-xl mb-4" />
                     <div className="space-y-3 mb-6">
                       <div className="bg-zinc-800 w-3/4 h-3 rounded" />
                       <div className="bg-zinc-800 w-1/2 h-2 rounded" />
                     </div>
                     <div className="bg-zinc-800 w-full h-32 rounded-xl" />
                     
                     <div className="absolute bottom-6 left-6 right-6 text-white text-center py-2.5 rounded-xl font-bold text-sm tracking-widest" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", boxShadow: "0 0 20px rgba(224,90,20,0.5)"}}>
                       PREMIUM
                     </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-12 flex justify-between items-end border-b pb-4" style={{borderColor: "rgba(224,90,20,0.2)"}}>
              <h2 className="text-2xl md:text-3xl font-black text-foreground" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>اشتراك يوتيوب بريميوم</h2>
            </div>

            <div className="flex justify-center">
              {[
                { id: 1, title: "اشتراك يوتيوب بريميوم | على ايميلك", price: "4.00", oldPrice: "29.00" }
              ].map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card 
                    className="overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.02] group cursor-pointer w-full max-w-sm"
                    style={{background: "rgba(20,10,5,0.8)", border: "1px solid rgba(139,58,10,0.3)", backdropFilter: "blur(10px)"}}
                    onClick={() => setLocation("/product")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = "1px solid rgba(224,90,20,0.5)";
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(224,90,20,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = "1px solid rgba(139,58,10,0.3)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    data-testid={`card-product-${p.id}`}
                  >
                    <div className="h-48 relative flex flex-col items-center justify-center overflow-hidden" style={{background: "linear-gradient(135deg, #0d0805, #302b63, #24243e)"}}>
                       <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(circle at 20% 80%, #e05a14 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b3a0a 0%, transparent 50%)"}} />
                       <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md rounded px-2.5 py-1 text-[10px] text-white/90 font-bold border border-white/20">
                         رقمي
                       </div>
                       <div className="relative z-10 flex flex-col items-center group-hover:scale-110 transition-transform duration-300">
                         <Youtube className="w-16 h-16 drop-shadow-2xl" style={{color: "#FF0000", filter: "drop-shadow(0 0 18px rgba(255,0,0,0.8))"}} fill="#FF0000" />
                         <span className="text-white font-black text-xl tracking-tight mt-1" style={{textShadow: "0 0 20px rgba(139,58,10,0.8)"}}>يوتيوب بريميوم</span>
                       </div>
                    </div>
                    <CardContent className="p-6 flex flex-col relative z-10 bg-transparent">
                      <h3 className="font-bold text-lg mb-6 text-foreground h-14 leading-tight">{p.title}</h3>
                      <div className="flex flex-col gap-1">
                        <span className="text-zinc-500 text-sm line-through">{p.oldPrice} ر.س</span>
                        <span className="text-3xl font-black text-primary">{p.price} <span className="text-sm font-bold text-primary/70">ر.س</span></span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="py-8 border-y" style={{background: "rgba(10, 10, 20, 0.5)", borderColor: "rgba(139,58,10,0.2)"}}>
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-x-reverse" style={{borderColor: "rgba(139,58,10,0.2)"}}>
               {[
                 { icon: Shield, text: "اشتراكات اصلية" },
                 { icon: Clock, text: "ضمان دائم" },
                 { icon: Phone, text: "دعم 24 ساعة للعملاء" },
                 { icon: Zap, text: "توصيل فوري للطلبات" }
               ].map((f, i) => (
                 <div key={i} className="flex flex-col items-center justify-center text-center gap-3 p-2">
                    <div className="p-3 rounded-full" style={{background: "rgba(139,58,10,0.1)", border: "1px solid rgba(224,90,20,0.15)"}}>
                      <f.icon className="w-6 h-6 text-primary" style={{filter: "drop-shadow(0 0 5px rgba(224,90,20,0.5))"}} />
                    </div>
                    <span className="font-bold text-sm md:text-base text-foreground/90">{f.text}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} setReviews={setReviews} />

        {/* Order Form */}
        <section id="order" className="py-20" style={{background: "transparent"}}>
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="shadow-2xl rounded-[2rem] overflow-hidden" style={{background: "rgba(20,10,5,0.95)", border: "1px solid rgba(224,90,20,0.2)", backdropFilter: "blur(10px)"}}>
              <div className="border-b p-8 text-center" style={{background: "rgba(0,0,0,0.2)", borderColor: "rgba(224,90,20,0.15)"}}>
                <h2 className="text-2xl md:text-3xl font-black" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>إتمام الطلب السريع</h2>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">سجل بياناتك أدناه وسيتم تفعيل اشتراكك فوراً بعد الدفع</p>
              </div>
              <CardContent className="p-6 md:p-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-foreground">الاسم الكامل</FormLabel>
                            <FormControl>
                              <Input placeholder="أحمد محمد" className="h-12 text-white placeholder:text-muted-foreground transition-colors" style={{background: "rgba(15,8,4,0.8)", border: "1px solid rgba(139,58,10,0.3)"}} {...field} data-testid="input-order-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-foreground">رقم الجوال (يفضل واتساب)</FormLabel>
                            <FormControl>
                              <Input placeholder="05xxxxxxxx" type="tel" className="h-12 text-white placeholder:text-muted-foreground transition-colors text-right" style={{background: "rgba(15,8,4,0.8)", border: "1px solid rgba(139,58,10,0.3)"}} dir="ltr" {...field} data-testid="input-order-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-foreground">البريد الإلكتروني (المراد تفعيله)</FormLabel>
                          <FormControl>
                            <Input placeholder="example@gmail.com" type="email" className="h-12 text-white placeholder:text-muted-foreground transition-colors text-right" style={{background: "rgba(15,8,4,0.8)", border: "1px solid rgba(139,58,10,0.3)"}} dir="ltr" {...field} data-testid="input-order-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="rounded-xl p-4 flex items-center gap-3" style={{background: "rgba(139,58,10,0.1)", border: "1px solid rgba(139,58,10,0.25)"}}>
                      <Badge className="bg-primary text-white text-base px-4 py-1.5 font-black shrink-0">4 ر.س</Badge>
                      <span className="text-foreground font-medium text-sm">اشتراك يوتيوب بريميوم | على ايميلك</span>
                      <span className="text-zinc-500 line-through text-sm mr-auto">29 ر.س</span>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl mt-6 transition-all hover:-translate-y-0.5" style={{boxShadow: "0 0 20px rgba(224,90,20,0.4)"}} data-testid="button-order-submit">
                      <Send className="w-5 h-5 ml-2 rotate-180" />
                      إرسال الطلب
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SupportPage() {
  const whatsappNumber = "966500708427";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #0d0805, #1a1535, #0d0805)"}}>

      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{background: "linear-gradient(135deg, rgba(224,90,20,0.2), rgba(139,58,10,0.2))", border: "2px solid rgba(224,90,20,0.3)", boxShadow: "0 0 40px rgba(224,90,20,0.2)"}}>
              <Phone className="w-9 h-9" style={{color: "#e05a14"}} />
            </div>
            <h1 className="text-4xl font-black mb-3" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
              الدعم الفني
            </h1>
            <p className="text-muted-foreground text-lg">فريقنا متاح لمساعدتك على مدار الساعة</p>
          </div>

          {/* Contact Cards */}
          <div className="space-y-4 mb-12">
            {/* WhatsApp Card */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-5 p-6 rounded-2xl cursor-pointer group"
              style={{background: "rgba(20,10,5,0.9)", border: "1px solid rgba(37,211,102,0.25)", backdropFilter: "blur(10px)"}}
              data-testid="link-whatsapp-support"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{background: "rgba(37,211,102,0.15)", boxShadow: "0 0 20px rgba(37,211,102,0.2)"}}>
                <svg className="w-8 h-8" fill="#25d366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.845L.057 23.571a.75.75 0 00.919.921l5.796-1.44A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.628 0 12 0zm0 21.75a9.74 9.74 0 01-4.964-1.358l-.354-.21-3.674.913.942-3.585-.232-.369A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-foreground">واتساب</p>
                <p className="text-muted-foreground text-sm">تواصل معنا مباشرة عبر واتساب</p>
              </div>
              <div className="text-left">
                <p className="font-black text-xl" style={{color: "#25d366"}}>0500708427</p>
                <p className="text-xs text-muted-foreground">اضغط للتواصل</p>
              </div>
            </motion.a>

            {/* Response time card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-5 p-6 rounded-2xl"
              style={{background: "rgba(20,10,5,0.9)", border: "1px solid rgba(224,90,20,0.15)", backdropFilter: "blur(10px)"}}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: "rgba(224,90,20,0.1)", boxShadow: "0 0 20px rgba(224,90,20,0.15)"}}>
                <Clock className="w-7 h-7" style={{color: "#e05a14"}} />
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">أوقات الدعم</p>
                <p className="text-muted-foreground text-sm">متاح 24 ساعة / 7 أيام في الأسبوع</p>
              </div>
            </motion.div>

            {/* Activation speed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-5 p-6 rounded-2xl"
              style={{background: "rgba(20,10,5,0.9)", border: "1px solid rgba(139,58,10,0.2)", backdropFilter: "blur(10px)"}}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: "rgba(139,58,10,0.1)", boxShadow: "0 0 20px rgba(139,58,10,0.15)"}}>
                <Zap className="w-7 h-7" style={{color: "#8b3a0a"}} />
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">سرعة الرد</p>
                <p className="text-muted-foreground text-sm">متوسط وقت الرد أقل من 10 دقائق</p>
              </div>
            </motion.div>
          </div>

          {/* Big WhatsApp CTA at bottom */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-xl text-white"
            style={{background: "linear-gradient(135deg, #25d366, #128c5e)", boxShadow: "0 0 30px rgba(37,211,102,0.35)"}}
            data-testid="button-whatsapp-cta"
          >
            <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.845L.057 23.571a.75.75 0 00.919.921l5.796-1.44A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.628 0 12 0zm0 21.75a9.74 9.74 0 01-4.964-1.358l-.354-.21-3.674.913.942-3.585-.232-.369A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
            تواصل عبر واتساب — 0500708427
          </motion.a>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen font-sans text-foreground overflow-x-hidden flex flex-col bg-transparent">

      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl overflow-hidden" style={{background: "rgba(20,10,5,0.8)", border: "1px solid rgba(139,58,10,0.3)", backdropFilter: "blur(10px)"}}>
              <div className="border-b p-8" style={{background: "rgba(0,0,0,0.2)", borderColor: "rgba(224,90,20,0.15)"}}>
                <h1 className="text-3xl md:text-4xl font-black text-center" style={{background: "linear-gradient(135deg, #e05a14, #8b3a0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>{title}</h1>
              </div>
              <CardContent className="p-6 md:p-10 space-y-6 text-muted-foreground leading-relaxed font-medium">
                {children}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ReturnsPage() {
  return (
    <PolicyPage title="سياسة الاسترداد والإسترجاع">
      <h3 className="text-xl font-bold text-white mb-2">آلية عمل الاشتراك:</h3>
      <p>يعمل الاشتراك عبر إرسال دعوة انضمام لمجموعة عائلة جوجل على بريدك الإلكتروني من جوجل مباشرةً، وما إن تقبل الدعوة حتى يبدأ اشتراكك تلقائياً.</p>
      
      <h3 className="text-xl font-bold text-white mt-8 mb-2">شروط الاسترداد:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>في حال عدم قبول دعوة الانضمام خلال 24 ساعة من إرسالها، لا يحق لك طلب استرداد كامل المبلغ.</li>
        <li>بعد قبول الدعوة، لا يمكن استرداد المبلغ تحت أي ظرف.</li>
        <li>في حال كان البريد الإلكتروني قد انضم مسبقاً إلى مجموعة عائلة خلال آخر 12 شهراً، ولم تُبلغنا بذلك مسبقاً، لا يحق لك الاسترداد. الحل هو استخدام بريد إلكتروني مختلف لم يكن في مجموعة عائلة خلال الـ 12 شهراً الماضية.</li>
        <li>في حال وجود سبب تقني مثبت من جانبنا، سيتم استرداد المبلغ كاملاً.</li>
      </ul>

      <h3 className="text-xl font-bold text-amber-500 mt-8 mb-2">ملاحظة مهمة:</h3>
      <p>إذا كنت قد انضممت لمجموعة عائلة خلال آخر 12 شهراً، فأنت بحاجة لتزويدنا ببريد إلكتروني آخر (جديد أو بديل) لم يُستخدم في مجموعة عائلة خلال تلك الفترة.</p>

      <h3 className="text-xl font-bold text-white mt-8 mb-2">للتواصل بشأن الاسترداد:</h3>
      <p>تواصل معنا عبر واتساب: <span dir="ltr" className="text-primary font-bold">0500708427</span></p>
    </PolicyPage>
  );
}

function TermsPage() {
  return (
    <PolicyPage title="الشروط والأحكام">
      <h3 className="text-xl font-bold text-white mb-2">آلية الاشتراك:</h3>
      <p>يعمل اشتراك يوتيوب بريميوم عبر نظام مجموعة العائلة من جوجل. بعد إتمام الطلب، تصلك رسالة رسمية من جوجل على بريدك الإلكتروني تدعوك للانضمام لمجموعة عائلة. ما عليك سوى قبول الدعوة والاستمتاع بجميع مميزات يوتيوب بريميوم.</p>
      
      <h3 className="text-xl font-bold text-white mt-8 mb-2">شروط الاستخدام:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>يجب قبول دعوة الانضمام خلال 24 ساعة من تاريخ إرسالها. بعد انتهاء المهلة، لا يمكن إعادة إرسال الدعوة أو استرداد المبلغ.</li>
        <li>لا يمكن لأي بريد إلكتروني الانضمام لأكثر من مجموعة عائلة واحدة كل 12 شهراً. إذا كنت قد انضممت لمجموعة عائلة في الأشهر الـ 12 الماضية، يجب تزويدنا ببريد إلكتروني آخر لم يُستخدم في مجموعة عائلة خلال تلك المدة.</li>
        <li>لا يُسمح بمشاركة الاشتراك مع أطراف خارجية.</li>
        <li>الاشتراك شخصي ولا يُحوَّل.</li>
        <li>نحتفظ بالحق في إنهاء الاشتراك في حال ثبوت إساءة الاستخدام دون استرداد.</li>
      </ul>

      <h3 className="text-xl font-bold text-white mt-8 mb-2">مدة التفعيل:</h3>
      <p>تتراوح مدة التفعيل بين 10 و30 دقيقة من إتمام الطلب بإذن الله.</p>
    </PolicyPage>
  );
}

function PrivacyPage() {
  return (
    <PolicyPage title="سياسة الخصوصية">
      <h3 className="text-xl font-bold text-white mb-2">المعلومات التي نجمعها:</h3>
      <p>نجمع فقط البريد الإلكتروني الذي تزودنا به لغرض إرسال دعوة مجموعة العائلة. لا نطلب ولا نخزن كلمات المرور تحت أي ظرف.</p>
      
      <h3 className="text-xl font-bold text-white mt-8 mb-2">كيف نستخدم معلوماتك:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>يُستخدم بريدك الإلكتروني حصراً لإرسال دعوة انضمام يوتيوب بريميوم عبر جوجل.</li>
        <li>رقم جوالك يُستخدم للتواصل معك عند الحاجة عبر واتساب فقط.</li>
        <li>لا نشارك بياناتك مع أي طرف ثالث.</li>
      </ul>

      <h3 className="text-xl font-bold text-white mt-8 mb-2">أمان بياناتك:</h3>
      <p>نلتزم بحفظ بياناتك وعدم الإفصاح عنها لأي جهة خارجية. تواصلنا معك يكون عبر واتساب فقط، ولن نطلب منك أي كلمة مرور أو معلومة حساسة.</p>
    </PolicyPage>
  );
}

function AboutPage() {
  return (
    <PolicyPage title="من نحن">
      <h3 className="text-xl font-bold text-white mb-2">متجر يوتيوب بريميوم</h3>
      <p>متجرنا متخصص في توفير اشتراكات يوتيوب بريميوم الأصلية بأسعار منافسة توفر أكثر من 50% مقارنة بالسعر الرسمي.</p>
      
      <h3 className="text-xl font-bold text-white mt-8 mb-2">كيف يعمل اشتراكنا؟</h3>
      <p>نعمل عبر نظام مجموعة العائلة الرسمي من جوجل. بعد طلبك، نضيفك لمجموعة العائلة عبر بريدك الإلكتروني مباشرةً. ستصلك رسالة رسمية من جوجل تطلب منك الانضمام، وما إن تقبلها حتى تبدأ الاستمتاع بجميع مميزات يوتيوب بريميوم دون أي خطوات إضافية.</p>

      <h3 className="text-xl font-bold text-amber-500 mt-8 mb-2">ملاحظة بخصوص البريد الإلكتروني:</h3>
      <p>يُشترط ألا يكون البريد الإلكتروني المقدَّم قد انضم لمجموعة عائلة خلال آخر 12 شهراً. إذا كان كذلك، يرجى تزويدنا ببريد إلكتروني بديل.</p>

      <h3 className="text-xl font-bold text-white mt-8 mb-2">لماذا نحن؟</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>توفير أكثر من 50% من سعر الاشتراك الرسمي</li>
        <li>اشتراكات أصلية 100% عبر جوجل</li>
        <li>تفعيل على بريدك مباشرة دون طلب كلمة المرور</li>
        <li>دعم عملاء فوري 24/7 عبر واتساب</li>
        <li>لا يحتاج تجديداً تلقائياً</li>
      </ul>

      <h3 className="text-xl font-bold text-white mt-8 mb-2">تواصل معنا:</h3>
      <p>واتساب: <span dir="ltr" className="text-primary font-bold">0500708427</span></p>
    </PolicyPage>
  );
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{backdropFilter: "blur(18px)", background: "rgba(13,8,5,0.88)"}}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <motion.img
          src="/logo.png"
          alt="3YN"
          className="w-52 h-auto object-contain"
          style={{filter: "drop-shadow(0 0 30px rgba(224,90,20,0.8)) drop-shadow(0 0 60px rgba(224,90,20,0.4))"}}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-1 rounded-full"
          style={{background: "linear-gradient(90deg, #8b3a0a, #e05a14, #8b3a0a)", boxShadow: "0 0 12px rgba(224,90,20,0.6)"}}
          initial={{ width: 0 }}
          animate={{ width: 180 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

const WhatsAppFloat = () => (
  <a
    href="https://wa.me/966500708427"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-110 active:scale-95"
    style={{background: "linear-gradient(135deg, #25d366, #128c5e)", boxShadow: "0 0 25px rgba(37,211,102,0.5), 0 4px 15px rgba(0,0,0,0.3)"}}
    aria-label="واتساب"
  >
    <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.845L.057 23.571a.75.75 0 00.919.921l5.796-1.44A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.628 0 12 0zm0 21.75a9.74 9.74 0 01-4.964-1.358l-.354-.21-3.674.913.942-3.585-.232-.369A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
  </a>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  return (
    <UserContext.Provider value={{ user, setUser, showLogin, setShowLogin }}>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <LoginModal />
      <Switch>
        <Route path="/product" component={ProductDetail} />
        <Route path="/support" component={SupportPage} />
        <Route path="/policy/returns" component={ReturnsPage} />
        <Route path="/policy/terms" component={TermsPage} />
        <Route path="/policy/privacy" component={PrivacyPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/">
          {() => <Home reviews={reviews} setReviews={setReviews} />}
        </Route>
        <Route>
          {() => <Home reviews={reviews} setReviews={setReviews} />}
        </Route>
      </Switch>
      <WhatsAppFloat />
      <Toaster />
    </UserContext.Provider>
  );
}
