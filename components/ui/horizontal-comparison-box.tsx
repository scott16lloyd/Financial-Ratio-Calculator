import { ArrowRight } from 'lucide-react';
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
import Markdown from 'react-markdown';
import { Info } from 'lucide-react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { Button } from '@/components/ui/button';
import {
  CRDescription,
  QuickRatioDescription,
  DebtToEquityRatioDescription,
  PERatioDescription,
  PSRatioDescription,
  PBRatioDescription,
} from '@/lib/ratioDescriptions';

interface ComparisonItem {
  year: number;
  companyA: number | null;
  companyB: number | null;
  companyAName: string;
  companyBName: string;
}

interface HorizontalComparisonBoxProps {
  ratioName: string;
  items: ComparisonItem[];
}

export default function HorizontalComparisonBox({
  ratioName,
  items,
}: HorizontalComparisonBoxProps) {
  // Logic to determine text color based on value
  const colorRules: Record<string, (value: number) => string> = {
    CR: (value: number) => {
      if (value >= 2) return 'text-gradient';
      if (value < 1) return 'danger-gradient';
      return 'warning-gradient';
    },
    QR: (value: number) => (value >= 1 ? 'text-gradient' : 'danger-gradient'),
    DE: (value: number) => {
      if (value < 1) return 'text-gradient';
      if (value === 1) return 'warning-gradient';
      return 'danger-gradient';
    },
    PE: (value: number) => {
      if (value < 15) return 'text-gradient';
      if (value >= 15 && value < 20) return 'warning-gradient';
      return 'danger-gradient';
    },
    PSR: (value: number) => {
      if (value < 2) return 'text-gradient';
      if (value >= 2 && value < 5) return 'warning-gradient';
      return 'danger-gradient';
    },
    PBR: (value: number) => (value < 1 ? 'text-gradient' : 'danger-gradient'),
  };

  // Select color class based on value and its ratio
  const getColorClass = (value: number, ratioName: string): string => {
    return colorRules[ratioName](value);
  };

  type RatioName = 'CR' | 'QR' | 'DE' | 'PE' | 'PSR' | 'PBR';

  // Select description based on selected ratio
  const ratioDescriptions: Record<RatioName, string[][]> = {
    CR: CRDescription,
    QR: QuickRatioDescription,
    DE: DebtToEquityRatioDescription,
    PE: PERatioDescription,
    PSR: PSRatioDescription,
    PBR: PBRatioDescription,
  };

  console.log(items);

  // Transform data array into more easily indexible array for horizontal comparison box
  const transformItems = (items: ComparisonItem[]) => {
    const companyData =
      items.length > 0
        ? [
            {
              companyName: items[0].companyAName,
              data: items.map((item) => ({
                year: item.year,
                value: item.companyA,
              })),
            },
            {
              companyName: items[0].companyBName,
              data: items.map((item) => ({
                year: item.year,
                value: item.companyB,
              })),
            },
          ]
        : [];
    return companyData;
  };

  const transformedItems = transformItems(items);
  console.log(transformedItems);

  return (
    <div className="bg-secondary flex flex-col items-center p-2 rounded-lg w-full outline outline-zinc-700 outline-1 shadow-md shadow-zinc-900 scrollbar-hide">
      <h2 className="w-full gap-2 flex flex-row items-center text-lg sm md:text-3xl lg:text-4xl xl:text-4xl mb-4 self-start">
        {ratioName}
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
      </h2>
      {transformedItems && transformedItems.length > 0 ? (
        transformedItems
          .filter((company) => company.companyName)
          .map((company, index) => (
            <div
              key={company.companyName}
              className={
                index !== 0
                  ? 'mt-4 pt-4 border-t border-zinc-700 w-full px-4'
                  : 'w-full px-4'
              }
            >
              {/* Display the company name */}
              <div className="text-lg md:text-2xl lg:text-3xl font-medium">
                {company.companyName}
              </div>

              {/* Display the years and values for the current and previous year */}
              <div className="flex items-center justify-between mt-2 lg:px-16 lg:py-2">
                {/* Previous year's data */}
                <div className="flex flex-col items-center">
                  <span className="text-sm md:text-lg lg:text-xl xl:text-2xl text-gray-400">
                    {company.data[1]?.year}
                  </span>
                  <span
                    className={`text-3xl md:text-4xl xl:text-5xl font-bold ${getColorClass(
                      company.data[1]?.value || 0,
                      ratioName
                    )}`}
                  >
                    {company.data[1]?.value !== null
                      ? company.data[1].value.toFixed(2)
                      : 'N/A'}
                  </span>
                </div>

                {/* Arrow icon */}
                <ArrowRight className="text-gray-400 mx-4 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />

                {/* Current year's data */}
                <div className="flex flex-col items-center">
                  <span className="text-sm md:text-lg lg:text-xl xl:text-2xl text-gray-400">
                    {company.data[0]?.year}
                  </span>
                  <span
                    className={`text-3xl md:text-4xl xl:text-5xl font-bold ${getColorClass(
                      company.data[0]?.value || 0,
                      ratioName
                    )}`}
                  >
                    {company.data[0]?.value !== null
                      ? company.data[0].value.toFixed(2)
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
      ) : (
        <p className="text-gray-400">No comparison data available.</p>
      )}
    </div>
  );
}
