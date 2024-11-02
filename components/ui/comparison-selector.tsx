'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { fetchSearchResultsPerformant } from '@/hooks';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { SetStateAction, useEffect, useState } from 'react';
import { Separator } from './separator';
import { debounce } from 'lodash';
import { HorizontalBentoBox } from '@/components/ui/horizontal-bento-box';
import { fetchRatios, fetchCompantProfile } from '@/hooks/index';
import { HorizontalBarSkeleton } from '@/components/ui/skeletons/horizontal-bar-skeleton';
import { Label } from '@/components/ui/label';

interface ComparisonSelectorProps {
  index: number;
  onStockSelect: (stock: SelectedStock | null) => void;
  onRatiosDataUpdate: (data: RatiosData[] | null) => void;
}

interface SelectedStock {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

// Ratio data interface
interface RatiosData {
  symbol: string;
  date: string;
  calendarYear: string;
  period: string;
  currentRatio: number;
  quickRatio: number;
  returnOnEquity: number;
  returnOnAssets: number;
  receivablesTurnover: number;
  debtEquityRatio: number;
  priceEarningsRatio: number;
  priceToSalesRatio: number;
  priceToBookRatio: number;
}

// Define query options
type QueryResult = {
  isLoading: boolean;
  error: Error | null;
  data: any;
};

export function ComparisonSelector({
  index,
  onStockSelect,
  onRatiosDataUpdate,
}: ComparisonSelectorProps) {
  const [searchString, setSearchString] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<SelectedStock | null>(
    null
  );

  console.log(selectedStock);

  const handleSearchChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchString(event.target.value);
    debouncedRefetch();
    setIsOpen(true);
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['search', searchString],
    queryFn: fetchSearchResultsPerformant,
    enabled: true,
  });

  // Queries ratios data
  const queryRatio: UseQueryOptions<any, Error> = {
    queryKey: ['fetchRatios', selectedStock?.symbol],
    queryFn: fetchRatios,
  };

  const ratios: QueryResult = useQuery(queryRatio);
  console.log(ratios);

  // Queries company profile
  const queryProfile: UseQueryOptions<any, Error> = {
    queryKey: ['fetchProfile', selectedStock?.symbol],
    queryFn: fetchCompantProfile,
  };

  const profile: QueryResult = useQuery(queryProfile);
  console.log(profile);

  const debouncedRefetch = debounce(refetch, 500);

  // Round the values to two decimal places
  useEffect(() => {
    if (ratios.data) {
      const roundedData = ratios.data.map((item: RatiosData) => ({
        ...item,
        calendarYear:
          item.calendarYear !== null ? parseFloat(item.calendarYear) : 0,
        currentRatio:
          item.currentRatio !== null
            ? parseFloat(item.currentRatio.toFixed(1))
            : 0,
        quickRatio:
          item.quickRatio !== null ? parseFloat(item.quickRatio.toFixed(1)) : 0,
        returnOnEquity:
          item.returnOnEquity !== null
            ? parseFloat(item.returnOnEquity.toFixed(1))
            : 0,
        returnOnAssets:
          item.returnOnAssets !== null
            ? parseFloat(item.returnOnAssets.toFixed(1))
            : 0,
        receivablesTurnover:
          item.receivablesTurnover !== null
            ? parseFloat(item.receivablesTurnover.toFixed(1))
            : 0,
        debtEquityRatio:
          item.debtEquityRatio !== null
            ? parseFloat(item.debtEquityRatio.toFixed(1))
            : 0,
        priceEarningsRatio:
          item.priceEarningsRatio !== null
            ? parseFloat(item.priceEarningsRatio.toFixed(1))
            : 0,
        priceSalesRatio:
          item.priceToSalesRatio !== null
            ? parseFloat(item.priceToSalesRatio.toFixed(1))
            : 0,
        priceToBookValue:
          item.priceToBookRatio !== null
            ? parseFloat(item.priceToBookRatio.toFixed(1))
            : 0,
      }));
      onRatiosDataUpdate(roundedData);
    }
    console.log(ratios.data);
  }, [ratios.data, onRatiosDataUpdate]);

  useEffect(() => {
    setIsOpen(searchString.length > 0);
  }, [searchString]);

  const handleStockSelection = (selectedStock: SelectedStock) => {
    setSelectedStock(selectedStock);
    onStockSelect(selectedStock); // Lift the state up to the parent
    setIsOpen(false);
    setSearchString('');
  };

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className="flex flex-col w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 gap-2">
      <Popover open={isOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col w-full gap-1">
            <Label>Select stock {index}</Label>
            <div className="flex flex-row gap-2 h-full">
              <Input
                type="text"
                value={searchString}
                placeholder="Search with a ticker symbol e.g. APPL"
                className="min-h-11 h-full xs:text-xs md:text-lg"
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
              <Button onClick={() => null} className="min-h-11">
                <Search />
              </Button>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          sideOffset={4}
          align="start"
          style={{
            width: 'var(--radix-popover-trigger-width)',
            height: '30vh',
            overflowY: 'scroll',
          }}
          onPointerDownOutside={() => setIsOpen(false)}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <div className="flex flex-col justify-between lg:gap-4 overflow-hidden">
            {data?.map((result: any, index: number) => {
              return (
                <div key={index} onClick={() => handleStockSelection(result)}>
                  <div className="p-2 flex flex-row gap-2 text-md md:text-lg lg:text-2xl hover:cursor-pointer hover:bg-zinc-700 hover:rounded-sm">
                    <span className="font-normal">{result.symbol}</span>
                    <span className=" text-zinc-500 font-light truncate text-ellipsis">
                      {result.name}
                    </span>
                  </div>
                  <Separator />
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <div className="relative">
        {selectedStock && profile.data ? (
          <HorizontalBentoBox
            symbol={selectedStock.symbol}
            name={selectedStock.name}
            price={profile.data.price}
            industryOrChange={profile.data.changes}
          />
        ) : isLoading && selectedStock ? (
          <HorizontalBarSkeleton />
        ) : null}
      </div>
    </div>
  );
}
