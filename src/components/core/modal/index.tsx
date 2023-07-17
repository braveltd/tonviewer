import { useResponsive } from '@farfetch/react-context-responsive';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { IoIosClose } from 'react-icons/io';
import ModalBase from 'react-modal';
import { useToggle } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { VoidCallback } from '../../../types/common';
import { Box } from '../box';
import { Column } from '../column';
import { Grid, GridItem } from '../grid';
import { Spacer } from '../spacer';
import { Subtitle } from '../text';

type TTModalSize = 'small' | 'medium' | 'large'

const SMALL_MODAL_SIZE = '400px';
const MEDIUM_MODAL_SIZE = '600px';
const LARGE_MODAL_SIZE = '800px';

type TModalProps = {
  // header of modal window
  title?: ReactNode
  // click on this element to open modal
  content: ReactNode
  cancelBtn?: ReactNode
  submitBtn?: ReactNode
  size?: TTModalSize
  onSubmit?: VoidCallback
  onClose?: VoidCallback
  isToken?: boolean
}

const TitleBox = styled(Box) <{ isToken?: boolean }>`
  width: 100%;
  margin-bottom: ${props => props.isToken ? '22px' : '8px'};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;

  .ButtonItem {
    display: flex;
    width: 100%;
    gap: 12px;

    button {
      width: 100%;
    }

    .GenerateTokenBtn {
      width: 100%;
    }
  }
`;

export const Modal: FC<PropsWithChildren<TModalProps>> = ({
  cancelBtn,
  submitBtn,
  children,
  content,
  title,
  size = 'medium',
  onSubmit,
  onClose,
  isToken
}) => {
  const theme = useTheme();
  const [open, toggle] = useToggle(false);
  const responsive = useResponsive();

  const customStyles = {
    content: {
      background: theme.colors.background.card,
      border: 'none',
      borderRadius: theme.borderRadius.small,
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: responsive.lessThan.sm
        ? '350px'
        : size === 'large'
          ? LARGE_MODAL_SIZE
          : size === 'small'
            ? SMALL_MODAL_SIZE
            : MEDIUM_MODAL_SIZE,
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      position: 'relative',
      padding: 0
    },
    overlay: {
      background: 'rgba(21, 21, 21, 0.75)',
      zIndex: 9999
    }
  };

  return (
    <>
      <Box onClick={() => toggle(true)}>
        {content}
      </Box>
      <ModalBase
        isOpen={open}
        style={customStyles}
        ariaHideApp={false}
        onRequestClose={(e) => {
          toggle(false);
          onClose?.();
        }}
      >
        <Box position='absolute' top={theme.spacing.small} right={theme.spacing.small}>
          <Column
            align='center'
            cursor='pointer'
            justify='center'
            onClick={() => toggle(false)}
          >
            <IoIosClose color={theme.colors.text.primary} size='24px' />
          </Column>
        </Box>
        {title && (
          <TitleBox isToken={isToken}>
            <Spacer pt={'32px'}>
              <Subtitle
                color={theme.colors.text.primary}
                style={{ textAlign: 'center' }}
              >
                {title}
              </Subtitle>
            </Spacer>
          </TitleBox>
        )}
        <Spacer p={'8px 32px 32px 32px'}>
          <Grid gap={theme.spacing.medium}>
            <GridItem>
              {children}
            </GridItem>
            {(cancelBtn || submitBtn) && (
              <GridItem>
                <ButtonContainer>
                  <Box
                    className={'ButtonItem'}
                    onClick={() => {
                      onClose?.();
                      toggle(false);
                    }}
                  >
                    {cancelBtn}
                  </Box>
                  <Box
                    className={'ButtonItem'}
                    onClick={() => {
                      onSubmit?.();
                      toggle(false);
                    }}>
                    {submitBtn}
                  </Box>
                </ButtonContainer>
              </GridItem>
            )}
          </Grid>
        </Spacer>
      </ModalBase>
    </>
  );
};
