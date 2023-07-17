import LinkBase from 'next/link';
import { AnchorHTMLAttributes, FC, HTMLAttributeAnchorTarget } from 'react';
import styled from 'styled-components';

type TLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & Partial<{
  bold: boolean
  target?: HTMLAttributeAnchorTarget
}>

const Anchor = styled(LinkBase) <TLinkProps>`
  cursor: pointer;
  width: 100%;
`;

export const Link: FC<TLinkProps> = ({ children, href, ...rest }) => {
  return (
    <Anchor
      {...rest}
      href={href}>
      {children}
    </Anchor>
  );
};
