import styled from 'styled-components';
import { Error500Icon } from '../components';
import { TitleH1 } from '../components/core/text';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  min-height: calc(100vh - 225px);
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

export default function Error500 () {
  return (
    <Container>
      <Error500Icon />
      <TitleH1>Internal server error</TitleH1>
      <Description>The server cannot process the request correctly.</Description>
    </Container>
  );
}
