
'use client';

import { cn } from "@/lib/utils";

const Shape = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("absolute opacity-70 dark:opacity-30", className)} {...props}>
        {children}
    </div>
);

export function DecorativeShapes() {
    return (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
            {/* 30 shapes */}
            <Shape className="w-16 h-16 top-[5%] left-[10%] animate-float-slow">
                <div className="w-full h-full rounded-full bg-[#2EC4B6]" />
            </Shape>
            <Shape className="w-20 h-20 top-[12%] left-[30%] animate-float-fast">
                 <div className="w-full h-full rounded-full border-8 border-[#FF6B6B]" />
            </Shape>
            <Shape className="w-16 h-16 top-[18%] left-[60%] animate-float-fast">
                <div className="w-full h-full rounded-2xl bg-[#FFD166]" />
            </Shape>
            <Shape className="w-20 h-20 top-[20%] left-[80%] transform rotate-12">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,10 90,85 10,85" fill="none" stroke="#9B5DE5" strokeWidth="8" strokeLinejoin="round"></polygon>
                </svg>
            </Shape>
            <Shape className="w-16 h-16 top-[25%] left-[50%] transform rotate-45 animate-float-slow">
                 <svg viewBox="0 0 100 100">
                    <polygon points="50,6 61,39 96,39 67,59 78,92 50,72 22,92 33,59 4,39 39,39" fill="#FF8C42" />
                </svg>
            </Shape>
            <Shape className="w-24 h-24 top-[35%] left-[15%] animate-float-slow">
                <svg viewBox="0 0 100 100">
                    <polygon points="50,6 86,27 86,73 50,94 14,73 14,27" fill="none" stroke="#FF66B3" strokeWidth="6" strokeLinejoin="round"/>
                </svg>
            </Shape>
            <Shape className="w-20 h-20 top-[38%] left-[70%] transform rotate-45 animate-float-fast">
                <div className="w-1/2 h-1/2 border-4 border-[#6C757D] rounded-sm mx-auto my-auto" />
            </Shape>
            <Shape className="w-24 h-24 top-[10%] left-[90%] animate-float-slow">
                 <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M44.7,-44.1C57.9,-33.3,66.4,-16.6,64.7,-1.2C63,14.1,51,28.1,37.6,37.8C24.2,47.6,12.1,53.1,-0.2,53.5C-12.5,53.9,-25,49.2,-37.2,41.7C-49.5,34.2,-61.5,23.9,-63.3,11.8C-65,-0.4,-56.5,-14.6,-45.3,-25.1C-34.1,-35.6,-20.2,-42.5,-6,-47C8.2,-51.5,16.4,-53,44.7,-44.1Z" transform="translate(100 100) scale(0.9)" fill="#66D9A6"/>
                </svg>
            </Shape>

            {/* More hero shapes */}
            <Shape className="w-16 h-16 top-[8%] left-[45%] animate-float-fast">
                <div className="w-full h-full rounded-full bg-[#2EC4B6]" />
            </Shape>
            <Shape className="w-20 h-20 top-[15%] left-[5%]">
                 <div className="w-full h-full rounded-full border-8 border-[#FF6B6B]" />
            </Shape>
            <Shape className="w-14 h-14 top-[22%] left-[40%]">
                <div className="w-full h-full rounded-2xl bg-[#FFD166]" />
            </Shape>
            <Shape className="w-20 h-20 top-[28%] left-[75%] animate-float-slow">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,10 90,85 10,85" fill="none" stroke="#9B5DE5" strokeWidth="8" strokeLinejoin="round"></polygon>
                </svg>
            </Shape>
             <Shape className="w-16 h-16 top-[30%] left-[55%] transform rotate-45 animate-float-slower">
                 <svg viewBox="0 0 100 100">
                    <polygon points="50,6 61,39 96,39 67,59 78,92 50,72 22,92 33,59 4,39 39,39" fill="#FF8C42" />
                </svg>
            </Shape>
            <Shape className="w-24 h-24 top-[18%] left-[5%] animate-float-fast">
                <svg viewBox="0 0 100 100">
                    <polygon points="50,6 86,27 86,73 50,94 14,73 14,27" fill="none" stroke="#FF66B3" strokeWidth="6" strokeLinejoin="round"/>
                </svg>
            </Shape>
            <Shape className="w-20 h-20 top-[12%] left-[65%] transform rotate-45 animate-float-fast">
                <div className="w-1/2 h-1/2 border-4 border-[#6C757D] rounded-sm mx-auto my-auto" />
            </Shape>

             {/* Shapes across other sections */}
            <Shape className="w-16 h-16 top-[55%] left-[10%] animate-float-slow">
                <div className="w-full h-full rounded-full bg-[#2EC4B6]" />
            </Shape>
            <Shape className="w-24 h-24 top-[65%] right-[10%] animate-float-slower">
                 <div className="w-full h-full rounded-full border-8 border-[#FF6B6B]" />
            </Shape>
            <Shape className="w-14 h-14 top-[72%] left-[30%]">
                <div className="w-full h-full rounded-2xl bg-[#FFD166]" />
            </Shape>
            <Shape className="w-20 h-20 top-[85%] left-[50%] animate-float-fast">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,10 90,85 10,85" fill="none" stroke="#9B5DE5" strokeWidth="8" strokeLinejoin="round"></polygon>
                </svg>
            </Shape>
            <Shape className="w-16 h-16 top-[92%] left-[20%] transform rotate-45 animate-float-fast">
                 <svg viewBox="0 0 100 100">
                    <polygon points="50,6 61,39 96,39 67,59 78,92 50,72 22,92 33,59 4,39 39,39" fill="#FF8C42" />
                </svg>
            </Shape>
             <Shape className="w-24 h-24 top-[60%] left-[60%] animate-float-slow">
                 <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M44.7,-44.1C57.9,-33.3,66.4,-16.6,64.7,-1.2C63,14.1,51,28.1,37.6,37.8C24.2,47.6,12.1,53.1,-0.2,53.5C-12.5,53.9,-25,49.2,-37.2,41.7C-49.5,34.2,-61.5,23.9,-63.3,11.8C-65,-0.4,-56.5,-14.6,-45.3,-25.1C-34.1,-35.6,-20.2,-42.5,-6,-47C8.2,-51.5,16.4,-53,44.7,-44.1Z" transform="translate(100 100) scale(0.9)" fill="#66D9A6"/>
                </svg>
            </Shape>
            <Shape className="w-20 h-20 top-[78%] right-[20%] transform rotate-45 animate-float-slower">
                <div className="w-1/2 h-1/2 border-4 border-[#6C757D] rounded-sm mx-auto my-auto" />
            </Shape>
             <Shape className="w-24 h-24 top-[88%] left-[40%]">
                <svg viewBox="0 0 100 100">
                    <polygon points="50,6 86,27 86,73 50,94 14,73 14,27" fill="none" stroke="#FF66B3" strokeWidth="6" strokeLinejoin="round"/>
                </svg>
            </Shape>

             {/* Extra scattered shapes */}
            <Shape className="w-16 h-16 top-[45%] left-[25%] animate-float-slow">
                <div className="w-full h-full rounded-full bg-[#2EC4B6]" />
            </Shape>
            <Shape className="w-14 h-14 top-[48%] right-[15%] animate-float-slower">
                <div className="w-full h-full rounded-2xl bg-[#FFD166]" />
            </Shape>
            <Shape className="w-20 h-20 top-[52%] left-[55%]">
                 <div className="w-full h-full rounded-full border-8 border-[#FF6B6B]" />
            </Shape>
            <Shape className="w-16 h-16 top-[68%] left-[15%] transform rotate-45 animate-float-fast">
                 <svg viewBox="0 0 100 100">
                    <polygon points="50,6 61,39 96,39 67,59 78,92 50,72 22,92 33,59 4,39 39,39" fill="#FF8C42" />
                </svg>
            </Shape>
            <Shape className="w-20 h-20 top-[80%] right-[5%] animate-float-fast">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,10 90,85 10,85" fill="none" stroke="#9B5DE5" strokeWidth="8" strokeLinejoin="round"></polygon>
                </svg>
            </Shape>

        </div>
    );
}
