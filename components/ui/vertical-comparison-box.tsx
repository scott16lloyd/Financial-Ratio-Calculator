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
  Tooltip,
} from 'recharts';
import { Info } from 'lucide-react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  ROADescription,
  RTDescription,
  ROEDescription,
} from '@/lib/ratioDescriptions';

type RatioName = 'ROA' | 'RT' | 'ROE';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

interface RatioEntry {
  year: number;
  companyA: number | null;
  companyB: number | null;
  companyAName: string;
  companyBName: string;
}

export function VerticalComparisonBox({
  ratioName,
  ratioValues,
}: {
  ratioName: string;
  ratioValues: RatioEntry[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [barCategoryGap, setBarCategoryGap] = useState(10);

  // Use the first entry to get company names, or provide defaults
  const companyAName =
    ratioValues.length > 0 ? ratioValues[0].companyAName : '';
  const companyBName =
    ratioValues.length > 0 ? ratioValues[0].companyBName : '';

  // Sort array by year
  ratioValues.sort((a, b) => a.year - b.year);

  // Function to update the barCategoryGap based on window width
  const updateBarCategoryGap = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth > 1800) {
      setBarCategoryGap(80);
    } else if (windowWidth > 1200) {
      setBarCategoryGap(40);
    } else if (windowWidth > 768) {
      setBarCategoryGap(20);
    } else {
      setBarCategoryGap(10);
    }
  };

  // Run on mount and when window is resized
  useEffect(() => {
    updateBarCategoryGap(); // Set initial gap

    window.addEventListener('resize', updateBarCategoryGap);

    return () => window.removeEventListener('resize', updateBarCategoryGap); // Cleanup listener on unmount
  }, []);

  const getBarColor = (
    a: number | null,
    b: number | null,
    isCompanyA: boolean
  ) => {
    if (a === null || b === null) return 'white';
    if (a > b) {
      return isCompanyA ? 'url(#greenGradient)' : 'white';
    } else if (a < b) {
      return isCompanyA ? 'white' : 'url(#greenGradient)';
    }
    return 'white'; // Set the smaller value's bar to white
  };

  // Select description based on selected ratio
  const ratioDescriptions: Record<RatioName, string[][]> = {
    ROA: ROADescription,
    RT: RTDescription,
    ROE: ROEDescription,
  };

  // Custom Tooltip component
  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '16px',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          <p>{`${label}`}</p>
          <p>{`${companyAName}: ${payload[0]?.value ?? 'N/A'}`}</p>
          <p>{`${companyBName}: ${payload[1]?.value ?? 'N/A'}`}</p>
        </div>
      );
    }

    return null;
  };

  return isLoading ? (
    <BentoSkeleton />
  ) : (
    <div className="w-full row-span-2 overflow-auto gap-1 md:px-4 lg:px-6 xl:px-2 2xl:px-3 bg-secondary rounded-2xl flex flex-col items-center justify-between outline outline-zinc-700 outline-1 shadow-md shadow-zinc-900 scrollbar-hide">
      <div className="text-left w-full px-2 md:px-0 py-2 text-lg md:text-3xl lg:text-4xl xl:text-4xl flex flex-row items-center gap-2">
        <span>{ratioName ? ratioName : 'null'}</span>
        <Drawer>
          <DrawerTrigger>
            <Info
              size={22}
              color="rgb(203 213 225)"
              strokeWidth={1}
              className="cursor-pointer"
            />
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-5xl overflow-y-scroll scrollbar-hide">
              <DrawerHeader>
                <DrawerTitle>
                  {ratioName in ratioDescriptions
                    ? ratioDescriptions[ratioName as RatioName][0][0]
                    : 'Default Title'}
                </DrawerTitle>
                <DrawerDescription>
                  <Markdown
                    className={'text-lg sm:text-base'}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    children={
                      ratioName in ratioDescriptions
                        ? ratioDescriptions[ratioName as RatioName][1][0]
                        : 'Default title'
                    }
                  />
                </DrawerDescription>
              </DrawerHeader>
            </div>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={ratioValues.slice(0, 2)}
          barCategoryGap={barCategoryGap}
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
          <XAxis dataKey="year">
            <Label offset={0} position="outside" />
          </XAxis>
          <YAxis type="number" domain={[0, 1]} hide />
          <Tooltip content={<CustomTooltip />} />
          {/* Pass the acutal name of the stock to name e.g. Apple */}
          <Bar dataKey="companyA" name={companyAName} radius={[8, 8, 8, 8]}>
            {/* console.log("RATIO VALUES" + ratioValues); */}
            {ratioValues.map(
              (entry, index) => (
                console.log(entry.companyA),
                (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.companyA, entry.companyB, true)}
                  />
                )
              )
            )}
            <LabelList
              dataKey="companyA"
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
          <Bar dataKey="companyB" name={companyBName} radius={[8, 8, 8, 8]}>
            {ratioValues.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.companyA, entry.companyB, false)}
              />
            ))}
            <LabelList
              dataKey="companyB"
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
                    {value ?? 'N/A'}
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
