import { Box } from '@interest-protocol/ui-kit';
import { v4 } from 'uuid';

import {
  POOL_COMPOSITION,
  POOL_INFORMATION,
  POOL_STATISTICS,
} from './additional-info.data';
import Accordion from './components/accordion';
import {
  PoolDetailAccordionItemCoinProps,
  PoolDetailAccordionItemStandardProps,
} from './components/accordion/accordion.type';
import ItemStandard from './components/accordion/item-standard';
import ItemToken from './components/accordion/item-token';

const PoolDetail = () => (
  <Box>
    <Accordion title={POOL_INFORMATION.title}>
      {(
        POOL_INFORMATION.data as Array<PoolDetailAccordionItemStandardProps>
      ).map(({ label, content, popupInfo, isCopyClipBoard }) => (
        <ItemStandard
          key={v4()}
          label={label}
          content={content}
          isCopyClipBoard={isCopyClipBoard}
          popupInfo={popupInfo}
        />
      ))}
    </Accordion>
    <Accordion title={POOL_STATISTICS.title}>
      {(
        POOL_STATISTICS.data as Array<PoolDetailAccordionItemStandardProps>
      ).map(({ label, content, popupInfo, isCopyClipBoard }) => (
        <ItemStandard
          key={v4()}
          label={label}
          content={content}
          isCopyClipBoard={isCopyClipBoard}
          popupInfo={popupInfo}
        />
      ))}
    </Accordion>
    <Accordion title={POOL_COMPOSITION.title} noBorder>
      {(POOL_COMPOSITION.data as Array<PoolDetailAccordionItemCoinProps>).map(
        ({ Icon, coinName, conversion, percentage, value }) => (
          <ItemToken
            key={v4()}
            Icon={Icon}
            value={value}
            coinName={coinName}
            percentage={percentage}
            conversion={conversion}
          />
        )
      )}
      {POOL_COMPOSITION.total && (
        <ItemStandard
          label="USD Total"
          labelColor="outline"
          popupInfo="USD TOTAL"
          content={POOL_COMPOSITION.total}
        />
      )}
    </Accordion>
  </Box>
);

export default PoolDetail;