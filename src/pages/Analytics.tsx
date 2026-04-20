import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Share2, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Zap,
  Activity,
  Globe,
  MessageSquare,
  Heart,
  Eye,
  Info
} from 'lucide-react';
import * as d3 from 'd3';
import { cn } from '../lib/utils';

export function Analytics() {
  const { activeWorkspace } = useWorkspace();
  const chartRef = useRef<SVGSVGElement>(null);
  const [activeRange, setActiveRange] = useState<'7D' | '30D' | '90D'>('7D');

  useEffect(() => {
    if (!chartRef.current) return;

    // Simulated data for the area chart
    const data = [
      { date: 'Mon', value: 2400, engagements: 400 },
      { date: 'Tue', value: 1398, engagements: 300 },
      { date: 'Wed', value: 9800, engagements: 1200 },
      { date: 'Thu', value: 3908, engagements: 800 },
      { date: 'Fri', value: 4800, engagements: 900 },
      { date: 'Sat', value: 3800, engagements: 700 },
      { date: 'Sun', value: 5300, engagements: 1100 },
    ];

    const margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Gradients
    const defs = svg.append("defs");
    
    const gradient = defs.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3E63DD")
      .attr("stop-opacity", 0.4);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3E63DD")
      .attr("stop-opacity", 0);

    const x = d3.scalePoint()
      .range([0, width])
      .domain(data.map(d => d.date))
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    // Grid lines (y-axis)
    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.03)
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => "")
      );

    // Area
    const area = d3.area<any>()
      .x(d => x(d.date) || 0)
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveCardinal);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    // Line
    const line = d3.line<any>()
      .x(d => x(d.date) || 0)
      .y(d => y(d.value))
      .curve(d3.curveCardinal);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3E63DD")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height + 15})`)
      .call(d3.axisBottom(x))
      .attr("font-size", "10px")
      .attr("font-family", "JetBrains Mono")
      .attr("color", "#666")
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").remove());

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".1s")))
      .attr("font-size", "10px")
      .attr("font-family", "JetBrains Mono")
      .attr("color", "#666")
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").remove());

    // Data points
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.date) || 0)
      .attr("cy", d => y(d.value))
      .attr("r", 4)
      .attr("fill", "#09090b")
      .attr("stroke", "#3E63DD")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 0 4px rgba(62, 99, 221, 0.5))");

  }, [activeRange]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Network Resonance</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none">High-fidelity engagement telemetry</p>
        </div>
        
        <div className="flex bg-[#0d0f13] p-1 rounded-xl border border-zinc-900 shadow-xl self-start md:self-center">
           {(['7D', '30D', '90D'] as const).map((r) => (
             <button 
               key={r}
               onClick={() => setActiveRange(r)}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-[10px] font-black tracking-[0.1em] transition-all uppercase cursor-pointer",
                 activeRange === r ? "bg-zinc-900 text-[#3E63DD] border border-zinc-800" : "text-zinc-600 hover:text-zinc-400"
               )}
             >
               {r}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <MetricCard 
           label="Aggregate Reach" 
           value="842.2k" 
           trend="+14.2%" 
           positive={true}
           icon={<Users className="w-4 h-4 text-blue-500" />} 
           subValue="12.4k AVG_DAILY"
         />
         <MetricCard 
           label="Resonance Score" 
           value="4.8%" 
           trend="+0.4%" 
           positive={true}
           icon={<Zap className="w-4 h-4 text-amber-500" />} 
           subValue="H-FIDELITY_ACTIVE"
         />
         <MetricCard 
           label="Signal Amplification" 
           value="1,402" 
           trend="-2.1%" 
           positive={false}
           icon={<Share2 className="w-4 h-4 text-sky-500" />} 
           subValue="NODES_DISTRIBUTED"
         />
         <MetricCard 
           label="Net Pulse" 
           value="24.8k" 
           trend="+8.9%" 
           positive={true}
           icon={<Activity className="w-4 h-4 text-pink-500" />} 
           subValue="SYS_UPTIME_99.9%"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Main Chart */}
         <div className="lg:col-span-8 bento-card p-8 bg-[#0d0f13] border-zinc-900 relative overflow-hidden group/chart">
            <div className="absolute top-0 right-0 p-8 flex gap-4 opacity-40">
               <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-[#3E63DD]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3E63DD]" /> REACH_INDEX
               </div>
            </div>
            
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Deployment Performance Timeline</h2>
                  <div className="flex items-baseline gap-2">
                     <span className="text-3xl font-black tracking-tighter">98.4%</span>
                     <span className="text-[10px] font-bold text-green-500 uppercase">Resonance Gain</span>
                  </div>
               </div>
            </div>
            
            <div className="w-full">
               <svg ref={chartRef} className="w-full h-auto min-h-[300px]" />
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-900/50 flex items-center justify-between text-[9px] font-mono text-zinc-600">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> NODE_EUR_W1</div>
                  <div className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> LATENCY_12ms</div>
               </div>
               <div className="flex items-center gap-2 group-hover/chart:text-[#3E63DD] transition-colors cursor-pointer">
                  DETAILED_REPORT <ArrowUpRight className="w-3 h-3 text-[#3E63DD]" />
               </div>
            </div>
         </div>

         {/* Side Stats */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bento-card p-6 bg-[#0d0f13] border-zinc-900">
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-8 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" /> Platform Distribution
               </h2>
               <div className="space-y-6">
                  <ChannelStat label="Instagram" value={64} color="#E1306C" count="12.4k" />
                  <ChannelStat label="LinkedIn" value={22} color="#0077B5" count="4.8k" />
                  <ChannelStat label="Twitter (X)" value={14} color="#3E63DD" count="2.1k" />
               </div>
            </div>

            <div className="bento-card p-6 bg-[#3E63DD]/5 border-[#3E63DD]/20 group hover:border-[#3E63DD]/40 transition-all cursor-default">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-[#3E63DD]/10 flex items-center justify-center border border-[#3E63DD]/20 group-hover:scale-110 transition-transform">
                     <Zap className="w-5 h-5 text-[#3E63DD]" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3E63DD]">AI_SYNAPSE_INSIGHT</div>
                     <p className="text-[9px] text-[#3E63DD]/60 font-bold uppercase tracking-widest mt-0.5">Optimization Protocol 2.1</p>
                  </div>
               </div>
               <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                 "Deployment window identified: <span className="text-white font-black">WED_14:30_GMT</span>. Historical latency suggests high node response during this segment."
               </p>
               <div className="mt-6 flex items-center justify-between">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-lg bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-black text-[#3E63DD]">
                           X{i}
                        </div>
                     ))}
                  </div>
                  <button className="text-[9px] font-black text-[#3E63DD] uppercase tracking-[0.1em] hover:underline cursor-pointer">
                     Apply Heuristic
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <EngagementFactor icon={<Heart />} label="Liking Rate" value="1.2k" subLabel="+12% Gain" color="text-pink-500" />
         <EngagementFactor icon={<MessageSquare />} label="Reply Depth" value="442" subLabel="Stable" color="text-blue-500" />
         <EngagementFactor icon={<Eye />} label="Optical Reach" value="28k" subLabel="+22% Gain" color="text-amber-500" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, icon, subValue, positive }: { label: string, value: string, trend: string, icon: any, subValue: string, positive: boolean }) {
  return (
    <div className="bento-card relative group p-6 bg-[#0d0f13] border-zinc-900 hover:border-[#3E63DD]/40 transition-all active:scale-[0.98]">
      <div className="flex items-start justify-between mb-8">
        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-900 group-hover:border-[#3E63DD]/20 group-hover:bg-[#3E63DD]/5 transition-all">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border",
          positive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
        )}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      
      <div>
        <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1 group-hover:text-zinc-500 transition-colors">{label}</h3>
        <div className="text-3xl font-black tracking-tighter mb-4">{value}</div>
        <div className="text-[9px] font-mono text-zinc-700 tracking-wider font-bold">
           ROOT::{subValue}
        </div>
      </div>
    </div>
  );
}

function ChannelStat({ label, value, color, count }: { label: string, value: number, color: string, count: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</span>
        </div>
        <div className="text-[10px] font-mono text-white/80 font-bold">{count} ({value}%)</div>
      </div>
      <div className="h-2 w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-lg relative"
          style={{ backgroundColor: color }}
        >
           <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

function EngagementFactor({ icon, label, value, subLabel, color }: { icon: any, label: string, value: string, subLabel: string, color: string }) {
   return (
      <div className="bento-card p-5 bg-[#0d0f13] border-zinc-900 flex items-center justify-between group hover:border-zinc-800 transition-all">
         <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center transition-all group-hover:scale-110", color)}>
               {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <div>
               <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{label}</div>
               <div className="text-lg font-black tracking-tight">{value}</div>
            </div>
         </div>
         <div className="text-right">
            <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mb-1">Delta</div>
            <div className="text-[10px] font-black text-green-500 uppercase tracking-tighter">{subLabel}</div>
         </div>
      </div>
   );
}
