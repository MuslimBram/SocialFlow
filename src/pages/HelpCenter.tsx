import React from 'react';
import { 
  HelpCircle, 
  Link, 
  Calendar, 
  FileText, 
  Zap, 
  Image as ImageIcon, 
  Instagram, 
  BarChart3, 
  Globe, 
  Users, 
  Layers, 
  Scissors, 
  Rss, 
  Palette, 
  Chrome, 
  Layout as LayoutIcon, 
  AlertTriangle, 
  LifeBuoy, 
  UserCircle, 
  CreditCard, 
  Heart, 
  MessageSquare, 
  Video, 
  Users2,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface HelpTopic {
  title: string;
  description: string;
  icon: any;
  category: string;
}

const topics: HelpTopic[] = [
  { 
    title: "Lidhja e llogarive sociale", 
    description: "Gjithçka që duhet të dini rreth lidhjes së llogarive ose problemeve.", 
    icon: Link,
    category: "Lidhshmëria"
  },
  { 
    title: "Planifikimi i Postimeve", 
    description: "Merrni informacione të dobishme rreth planifikimit të të gjitha llojeve të postimeve.", 
    icon: Calendar,
    category: "Rrjedha e punës"
  },
  { 
    title: "Menaxhimi i Postimeve", 
    description: "Merrni informacione të dobishme mbi menaxhimin efektiv të të gjitha llojeve të postimeve.", 
    icon: FileText,
    category: "Rrjedha e punës"
  },
  { 
    title: "Ndihma e Inteligjencës Artificiale", 
    description: "Gjeneroni përmbajtje me lehtësi, plotësoni tekstin menjëherë, krijoni foto mahnitëse dhe përgjigjuni komenteve si një profesionist.", 
    icon: Zap,
    category: "Veglat AI"
  },
  { 
    title: "Biblioteka e mediave", 
    description: "Importoni dhe ruani media nga Google Drive, Dropbox dhe Unsplash.", 
    icon: ImageIcon,
    category: "Asetet"
  },
  { 
    title: "Lidhja e Instagramit në Bio", 
    description: "Jepi fuqi linkut tënd në Bio në Instagram.", 
    icon: Instagram,
    category: "Lidhshmëria"
  },
  { 
    title: "Analitika", 
    description: "Si të gjurmoni performancën e postimeve në intervale të ndryshme kohore.", 
    icon: BarChart3,
    category: "Analizat"
  },
  { 
    title: "Kalendari", 
    description: "Të gjitha postimet e krijuara në një pamje kalendarike.", 
    icon: LayoutIcon,
    category: "Rrjedha e punës"
  },
  { 
    title: "Eksploro Përmbajtjen", 
    description: "Zbuloni lajmet më të fundit të industrisë nga 150,000 burime në mbarë botën dhe automatizoni Burimet RSS.", 
    icon: Globe,
    category: "Përmbajtja"
  },
  { 
    title: "Hapësirat e punës", 
    description: "Caktoni role anëtarëve në Hapësirat e Punës të dedikuara për çdo projekt.", 
    icon: Users,
    category: "Organizimi"
  },
  { 
    title: "Opsionet e Postimit", 
    description: "Përdorni filigrana, nënshkurtime dhe opsione të tjera postimi.", 
    icon: Layers,
    category: "Rrjedha e punës"
  },
  { 
    title: "Shkurtuesit e Lidhjeve", 
    description: "Shkurtoni të gjitha lidhjet tuaja përmes Publer.", 
    icon: Scissors,
    category: "Lidhshmëria"
  },
  { 
    title: "Burimet RSS", 
    description: "Automatizoni artikujt e Burimit RSS në llogaritë tuaja sociale përmes Publer.", 
    icon: Rss,
    category: "Përmbajtja"
  },
  { 
    title: "Canva dhe VistaCreate", 
    description: "Dizenjoni foto dhe video profesionale me Canva dhe VistaCreate.", 
    icon: Palette,
    category: "Veglat AI"
  },
  { 
    title: "Zgjerimi i shfletuesit", 
    description: "Përdorni Zgjerimin për Chrome, Firefox, Edge, Opera dhe Safari.", 
    icon: Chrome,
    category: "Lidhshmëria"
  },
  { 
    title: "WordPress", 
    description: "Rrit trafikun e blogut tënd me planifikimin e postimeve në WordPress.", 
    icon: FileText,
    category: "Rrjedha e punës"
  },
  { 
    title: "Kufizime", 
    description: "Mësoni rreth kufizimeve dhe udhëzimeve të llogarisë që mund të ndikojnë në postimet tuaja.", 
    icon: AlertTriangle,
    category: "Politikat"
  },
  { 
    title: "Zgjidhja e problemeve", 
    description: "Zgjidh problemet që po hasni me Publer.", 
    icon: LifeBuoy,
    category: "Mbështetja"
  },
  { 
    title: "Cilësimet e Llogarisë së Publikuesit", 
    description: "Menaxho profilin/cilësimet e llogarisë tënde të Publer.", 
    icon: UserCircle,
    category: "Organizimi"
  },
  { 
    title: "Planet dhe Çmimet", 
    description: "Pyetje në lidhje me faturimin dhe çfarë ofron secili plan.", 
    icon: CreditCard,
    category: "Faturimi"
  },
  { 
    title: "Programi i Filialeve", 
    description: "Bëhuni një Ambasador i Publikuesit dhe përhapni fjalën!", 
    icon: Heart,
    category: "Organizimi"
  },
  { 
    title: "Jepni reagime", 
    description: "Votoni për kërkesat ekzistuese për veçori ose sugjeroni kërkesa të reja.", 
    icon: MessageSquare,
    category: "Mbështetja"
  },
  { 
    title: "Rezervoni një telefonatë mbështetjeje", 
    description: "Le të të ndihmojmë nëpërmjet ndarjes së ekranit.", 
    icon: Video,
    category: "Mbështetja"
  },
  { 
    title: "Bashkohuni me grupin tonë të mbështetjes", 
    description: "Bëni pyetje, ndani ide, merrni mbështetje ose edhe ndihmoni njëri-tjetrin.", 
    icon: Users2,
    category: "Mbështetja"
  },
];

export function HelpCenter() {
  const categories = Array.from(new Set(topics.map(t => t.category)));

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Qendra e Ndihmës</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-none opacity-60">
            SocialFlow Support Kernel & Documentation
          </p>
        </div>
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#3E63DD] transition-colors" />
          <input 
            type="text" 
            placeholder="Kërko për ndihmë..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#3E63DD]/50 focus:ring-1 focus:ring-[#3E63DD]/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {topics.map((topic, i) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className="bento-card group p-5 hover:border-[#3E63DD]/30 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center group-hover:scale-110 group-hover:border-[#3E63DD]/20 transition-all duration-500">
                <topic.icon className="w-5 h-5 text-zinc-400 group-hover:text-[#3E63DD] transition-colors" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700 opacity-40">
                SEG::{topic.category.substring(0, 3)}
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{topic.title}</h3>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-400 transition-colors">
                {topic.description}
              </p>
            </div>

            <div className="mt-auto pt-4 flex items-center gap-2 text-[#3E63DD] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
               <span className="text-[10px] font-black uppercase tracking-widest">Lexo më shumë</span>
               <ChevronRight className="w-3 h-3" />
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3E63DD]/5 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bento-card p-6 bg-gradient-to-br from-[#3E63DD]/10 to-transparent border-[#3E63DD]/20">
           <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#3E63DD]" />
              Ende keni nevojë për ndihmë?
           </h3>
           <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-6">
              Nëse nuk mund ta gjeni atë që kërkoni në dokumentacionin tonë, ekipi ynë i mbështetjes është gati t'ju ndihmojë 24/7.
           </p>
           <button className="bg-[#3E63DD] text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              Kontakto Mbështetjen
           </button>
        </div>

        <div className="bento-card p-6 border-dashed border-zinc-800 flex flex-col items-center justify-center text-center opacity-70">
           <Heart className="w-8 h-8 text-pink-500/50 mb-4" />
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Faleminderit që përdorni SocialFlow</p>
           <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">VERSION 4.2.1-STABLE</p>
        </div>
      </div>
    </div>
  );
}
