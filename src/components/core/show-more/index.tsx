import { Box } from '../box';
import { FC, PropsWithChildren } from 'react';
import { Column } from '../column';
import { Truncate, TTruncateProps } from '../truncate';
import { Text } from '../text';
import { useTheme } from 'styled-components';
import { useToggle } from 'react-use';

type TShowMoreProps = TTruncateProps & {
  defaultExpanded?: boolean
}

export const ShowMore: FC<PropsWithChildren<TShowMoreProps>> = ({
  children,
  defaultExpanded = false,
  ...truncateProps
}) => {
  const theme = useTheme();
  const [expanded, toggle] = useToggle(defaultExpanded);

  return (
    <Column>
      <Truncate
        length={expanded ? Number.MAX_SAFE_INTEGER : truncateProps.length}
        tooltipDisabled
      />
      {truncateProps.text.length > truncateProps.length && (
        <Box
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
        >
          <Text color={theme.colors.accent.address}>{expanded ? 'Show less' : 'Show more'}</Text>
        </Box>
      )}
    </Column>
  );
};
