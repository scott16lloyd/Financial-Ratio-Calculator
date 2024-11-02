'use client';

import { TopNavBar } from '@/components/ui/top-nav-bar';
import { ComparisonSelector } from '@/components/ui/comparison-selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { VerticalComparisonBox } from '@/components/ui/vertical-comparison-box';
import HorizontalComparisonBox from '@/components/ui/horizontal-comparison-box';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SelectedStock {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

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

export default function ComparePage() {
  const [selectedFirstStock, setSelectedFirstStock] =
    useState<SelectedStock | null>(null);
  const [selectedSecondStock, setSelectedSecondStock] =
    useState<SelectedStock | null>(null);
  const [firstStockRatios, setFirstStockRatios] = useState<RatiosData[] | null>(
    null
  );
  const [secondStockRatios, setSecondStockRatios] = useState<
    RatiosData[] | null
  >(null);

  const getComparisonData = (
    ratioName: keyof RatiosData
  ): {
    year: number;
    companyA: number | null;
    companyB: number | null;
    companyAName: string;
    companyBName: string;
  }[] => {
    const years = new Set([
      ...(firstStockRatios?.map((r) => Number(r.calendarYear)) || []),
      ...(secondStockRatios?.map((r) => Number(r.calendarYear)) || []),
    ]);

    // Sort years in descending order
    const sortedYears = Array.from(years).sort((a, b) => b - a);

    // Latest year and previous year
    const yearsToShow = sortedYears.slice(0, 2);

    // Parse ratio value into a number or null
    const parseRatioValue = (
      value: string | number | undefined | null
    ): number | null => {
      if (value === undefined || value === null) return null;
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      return isNaN(numValue) ? null : numValue;
    };

    return yearsToShow.map((year) => {
      // Get the ratios for the specified year
      const firstStockRatio = firstStockRatios?.find(
        (r) => Number(r.calendarYear) === year
      );
      const secondStockRatio = secondStockRatios?.find(
        (r) => Number(r.calendarYear) === year
      );
      return {
        year,
        companyA: parseRatioValue(firstStockRatio?.[ratioName]),
        companyB: parseRatioValue(secondStockRatio?.[ratioName]),
        companyAName: selectedFirstStock?.name || '',
        companyBName: selectedSecondStock?.name || '',
      };
    });
  };

  console.log('First stock ratios: ', firstStockRatios);
  let g = getComparisonData('returnOnAssets');
  console.log('Comparison data: ', g);

  return (
    <main className="w-full h-full flex flex-col justify-start items-center gap-4 pb-4">
      <TopNavBar />
      <div className="w-full flex flex-col items-center lg:items-start justify-center lg:flex-row gap-4 lg:px-8">
        <ComparisonSelector
          index={1}
          onStockSelect={setSelectedFirstStock}
          onRatiosDataUpdate={setFirstStockRatios}
        />
        <ComparisonSelector
          index={2}
          onStockSelect={setSelectedSecondStock}
          onRatiosDataUpdate={setSecondStockRatios}
        />
      </div>
      {selectedFirstStock ||
      (selectedSecondStock && (firstStockRatios || secondStockRatios)) ? (
        <div className="w-11/12 md:w-7/12 lg:w-full lg:px-8 xl:w-8/12 xl:px-2 h-fit flex flex-col items-center">
          <Tabs defaultValue="roa" className="w-full gap-2">
            <TabsList className="w-full">
              <TabsTrigger value="roa" className="w-full">
                ROA
              </TabsTrigger>
              <TabsTrigger value="rt" className="w-full">
                RT
              </TabsTrigger>
              <TabsTrigger value="roe" className="w-full">
                ROE
              </TabsTrigger>
            </TabsList>
            <TabsContent value="roa" className="h-96 flex-grow">
              <div className="w-full h-full flex flex-grow justify-center">
                <VerticalComparisonBox
                  ratioName="ROA"
                  ratioValues={getComparisonData('returnOnAssets')}
                />
              </div>
            </TabsContent>
            <TabsContent value="rt" className="h-96 flex-grow">
              <div className="w-full h-full flex flex-grow justify-center">
                <VerticalComparisonBox
                  ratioName="RT"
                  ratioValues={getComparisonData('receivablesTurnover')}
                />
              </div>
            </TabsContent>
            <TabsContent value="roe" className="h-96 flex-grow">
              <div className="w-full h-full flex flex-grow justify-center">
                <VerticalComparisonBox
                  ratioName="ROE"
                  ratioValues={getComparisonData('returnOnEquity')}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
      <div className="w-11/12 md:w-7/12 lg:w-full lg:px-8 xl:w-8/12 xl:px-2">
        <HorizontalComparisonBox
          ratioName="CR"
          items={getComparisonData('currentRatio')}
        />
      </div>
    </main>
  );
}
