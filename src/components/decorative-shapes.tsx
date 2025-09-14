
'use client';

import { cn } from "@/lib/utils";

const Shape = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("absolute opacity-70 dark:opacity-30", className)} {...props}>
        {children}
    </div>
);

export function DecorativeShapes() {
    return (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden z-10">
            {/* Shape 1: Filled Circle (teal) */}
            <Shape className="w-32 h-32 top-1/4 left-[-4rem]">
                <div className="w-full h-full rounded-full bg-[#2EC4B6]" />
            </Shape>

            {/* Shape 2: Outline Ring (coral) */}
            <Shape className="w-48 h-48 top-[5%] right-[-6rem]">
                 <div className="w-full h-full rounded-full border-8 border-[#FF6B6B]" />
            </Shape>

            {/* Shape 3: Filled Rounded Square (gold) */}
             <Shape className="w-24 h-24 top-[60%] left-[5%]">
                <div className="w-full h-full rounded-2xl bg-[#FFD166]" />
            </Shape>

            {/* Shape 4: Triangle outline (lavender) */}
            <Shape className="w-20 h-20 top-[80%] right-[10%] transform rotate-12">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,10 90,85 10,85" fill="none" stroke="#9B5DE5" strokeWidth="8" strokeLinejoin="round"></polygon>
                </svg>
            </Shape>

             {/* Shape 5: Blob (mint) */}
            <Shape className="w-64 h-64 top-[35%] right-[-5rem] transform -rotate-12">
                 <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M44.7,-44.1C57.9,-33.3,66.4,-16.6,64.7,-1.2C63,14.1,51,28.1,37.6,37.8C24.2,47.6,12.1,53.1,-0.2,53.5C-12.5,53.9,-25,49.2,-37.2,41.7C-49.5,34.2,-61.5,23.9,-63.3,11.8C-65,-0.4,-56.5,-14.6,-45.3,-25.1C-34.1,-35.6,-20.2,-42.5,-6,-47C8.2,-51.5,16.4,-53,44.7,-44.1Z" transform="translate(100 100) scale(0.9)" fill="#66D9A6"/>
                </svg>
            </Shape>

             {/* Shape 6: Star (orange) */}
            <Shape className="w-16 h-16 bottom-[10%] left-[2%] transform rotate-45">
                 <svg viewBox="0 0 100 100">
                    <polygon points="50,6 61,39 96,39 67,59 78,92 50,72 22,92 33,59 4,39 39,39" fill="#FF8C42" />
                </svg>
            </Shape>

             {/* Shape 7: Diamond outline (slate) */}
            <Shape className="w-28 h-28 top-[90%] left-[45%]">
                <div className="w-1/2 h-1/2 transform rotate-45 border-4 border-[#6C757D] rounded-sm mx-auto my-auto" />
            </Shape>

            {/* Shape 8: Hexagon outline (pink) */}
            <Shape className="w-24 h-24 top-[15%] right-[20%]">
                <svg viewBox="0 0 100 100">
                    <polygon points="50,6 86,27 86,73 50,94 14,73 14,27" fill="none" stroke="#FF66B3" strokeWidth="8" strokeLinejoin="round"/>
                </svg>
            </Shape>

        </div>
    );
}
