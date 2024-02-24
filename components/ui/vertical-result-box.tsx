'use client';

import { useState, useEffect } from 'react';
import { BentoSkeleton } from '@/components/ui/skeletons/bento-skeleton';
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Cell,
  LabelList,
  Label,
} from 'recharts';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function VerticalResultBox({
  ratioName,
  value,
}: {
  ratioName: string;
  value: number[][];
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const data = [
    {
      name: value[1][1] ? value[1][1] : 'previous',
      uv: value[1][0],
      max: 1,
    },
    {
      name: value[0][1] ? value[0][1] : 'current',
      uv: value[0][0],
      max: 1,
    },
  ];

  let barColor = 'white';
  if (value[0][0] > value[1][0]) {
    barColor = 'url(#greenGradient)';
  } else if (value[0][0] === value[1][0]) {
    barColor = 'grey';
  } else {
    barColor = 'url(#redGradient)';
  }

  const ratioDescriptions: { [key: string]: string } = {
    CR: 'Current Ratio (CR) is a financial metric that is used to evaluate the liquidity of a company...',
    QR: 'Quick Ratio (QR) is a measure of how well a company can meet its short-term financial liabilities...',
    // Add more descriptions for each ratioName
  };

  return isLoading ? (
    <BentoSkeleton />
  ) : (
    <div className="row-span-2 overflow-auto gap-1 md:px-4 lg:px-6 xl:px-2 2xl:px-3 bg-secondary rounded-2xl flex flex-col items-center justify-between outline outline-zinc-700 outline-1 shadow-md shadow-zinc-900">
      <div className="text-left w-full px-2 md:px-0 py-2 text-lg md:text-3xl lg:text-4xl xl:text-4xl flex flex-row items-center gap-2">
        <span>{ratioName ? ratioName : 'null'}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                size={22}
                color="rgb(203 213 225)"
                strokeWidth={1}
                className="cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent style={{ maxWidth: '400px' }}>
              <p>{ratioDescriptions[ratioName]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data ? data : []}
          barCategoryGap={4}
          layout="horizontal"
          margin={{ top: 20, bottom: 2, left: 8, right: 8 }}
        >
          <defs>
            <linearGradient
              id="greenGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="50%"
                style={{ stopColor: 'hsla(120, 65%, 53%, 1)' }}
              />
              <stop
                offset="100%"
                style={{ stopColor: 'hsla(120, 100%, 37%, 1)' }}
              />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="50%"
                style={{ stopColor: 'hsla(0, 100%, 50%, 1)' }}
              />
              <stop
                offset="100%"
                style={{ stopColor: 'hsla(0, 100%, 37%, 1)' }}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" type="category">
            <Label offset={0} position="outside" />
          </XAxis>
          <YAxis type="number" domain={[0, 1]} hide />
          <Bar dataKey="uv" radius={[8, 8, 8, 8]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? 'white' : barColor}
              />
            ))}
            <LabelList
              dataKey="uv"
              position="top"
              content={(props) => {
                const { x, y, value } = props;
                return (
                  <text
                    x={(x as number) + 15}
                    y={y}
                    dy={-4}
                    fill={props.index === 0 ? 'grey' : 'white'}
                    textAnchor="middle"
                  >
                    {value ? value : 0}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
