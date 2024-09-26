import { Box, Tabs, Typography } from '@interest-protocol/ui-kit';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 } from 'uuid';

import useEventListener from '@/hooks/use-event-listener';

import { FormFilterValue } from '../pool-card/pool-card.types';
import { FilterItemProps, FilterTypeEnum, PoolForm } from '../pools.types';
import CreatePoolButton from './create-pool-button';
import FindPoolButton from './find-pool-button';
import { HeaderProps } from './header.types';

const Header: FC<HeaderProps> = ({ currentTab, setTab }) => {
  const { setValue } = useFormContext<PoolForm>();
  const [showSearchField, setShowSearchField] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const { query } = router;

  const handleSetDesktop = useCallback(() => {
    const mediaIsMobile = !window.matchMedia('(min-width: 65em)').matches;
    !mediaIsMobile && setShowSearchField(false);
    setIsMobile(mediaIsMobile);
  }, []);

  useEventListener('resize', handleSetDesktop, true);

  const cleanInvalidFilters = useCallback(() => {
    const validFilters = { ...query };
    const validValues = Object.values(FormFilterValue);
    let updated = false;

    ['category', 'algorithm'].forEach((key) => {
      if (
        validFilters[key] &&
        !validValues.includes(validFilters[key] as FormFilterValue)
      ) {
        delete validFilters[key];
        updated = true;
      }
    });

    if (updated) {
      router.replace(
        { pathname: router.pathname, query: validFilters },
        undefined,
        { shallow: true }
      );
    }

    return validFilters;
  }, [query, router]);

  useEffect(() => {
    const validFilters = cleanInvalidFilters();
    const filters: Array<FilterItemProps> = [];

    ['category', 'algorithm'].forEach((key) => {
      if (validFilters[key]) {
        filters.push({
          type:
            key === 'category'
              ? FilterTypeEnum.CATEGORY
              : FilterTypeEnum.ALGORITHM,
          value: validFilters[key] as FormFilterValue,
        });
      }
    });

    setValue(
      'filterList',
      filters.length
        ? filters
        : currentTab
          ? []
          : [{ type: FilterTypeEnum.CATEGORY, value: FormFilterValue.official }]
    );
  }, [cleanInvalidFilters, setValue, currentTab]);

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      overflow="none"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box
        gap="s"
        width="100%"
        flexWrap="wrap"
        justifyContent="space-between"
        display={isMobile ? (showSearchField ? 'none' : 'flex') : 'flex'}
      >
        <Tabs
          type="square"
          onChangeTab={(index: number) => {
            setTab(index);
            setValue('isFindingPool', false);
            setValue('tokenList', []);
            setValue(
              'filterList',
              index
                ? []
                : [
                    {
                      type: FilterTypeEnum.CATEGORY,
                      value: FormFilterValue.official,
                    },
                  ]
            );
          }}
          defaultTabIndex={currentTab}
          items={['Pools', 'My Position'].map((tab) => (
            <Typography
              key={v4()}
              variant="label"
              size={isMobile ? 'small' : 'medium'}
            >
              {tab}
            </Typography>
          ))}
        />
        <Box display="flex" gap="s">
          <FindPoolButton />
          <CreatePoolButton />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
