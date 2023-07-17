import styled from 'styled-components';
import { Error404Icon } from '../components/core/icons';
import { TitleH1 } from '../components/core/text';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  min-height: calc(100vh - 315px);
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-family: ${props => props.theme.font.family.serif};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
`;

export default function Error404 () {
  return (
    <Container>
      <Error404Icon />
      <TitleH1>Page couldn’t be found</TitleH1>
      <Description>Page doesn’t exist or URL has a mistake.</Description>
    </Container>
  );
}
