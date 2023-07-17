import { ElementType } from 'react';
import { Text } from '../text';

export type TTruncateProps<P = any> = {
  length: number
  text: string
  textElement?: ElementType<P>
  tooltipDisabled?: boolean
}

export const Truncate = ({
  length,
  text = '',
  textElement: TextElement = Text,
  tooltipDisabled = false
}) => {
  const displayText = text.length > length ? `${text.substring(0, length)}…` : text;
  return <>{displayText}</>;
};
