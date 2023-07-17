import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { SecondaryText, Text } from '../text';
import { SectionsComponent } from '../../features/accounts/details';
import { useOutsideClick } from 'tonviewer-web/hooks/useOutsideClick';

const UITextInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  
  .input-wrapper {
    border: 1px solid rgba(131, 137, 143, 0.32);
    background: ${props => props.theme.colors.background.active};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    min-width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 12px;
    border-radius: 8px;
    
    :hover {
      border: 1px solid rgba(131, 137, 143, 0.56);
    }

    :focus {
      border: 1px solid rgba(131, 137, 143, 0.56);
    }
    
    .clear-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 24px;
      span {
        font-size: 18px;
        color: ${props => props.theme.colors.text.secondary};
        
        :hover {
          opacity: 0.5;
          cursor: pointer;
        }
      }
    }

    input {
      height: 100%;
      width: 100%;
      padding: 0px 12px;
      background: transparent;
      border-radius: 0;
      border: none;
      outline: none;
      color: ${props => props.theme.colors.text.primary};
      
      :disabled {
        color: ${props => props.theme.colors.text.primary};
        opacity: 0.5;
      }

      ::placeholder {
        color: ${props => props.theme.colors.text.secondary};
      }

      :-ms-input-placeholder {
        color: ${props => props.theme.colors.text.secondary};
      }

      ::-ms-input-placeholder {
        color: ${props => props.theme.colors.text.secondary};
      }
    }
  }
  
  .error {
    border: 1px solid ${props => props.theme.colors.accent.destructive};
    background: rgba(245, 60, 54, 0.12);
    
    :hover {
      border: 1px solid ${props => props.theme.colors.accent.destructive} !important;
    }
  }
  
  .switch-type-wrapper {
    display: flex;
    flex-direction: row;
    border: 1px solid rgba(131, 137, 143, 0.32);
    background: ${props => props.theme.colors.background.active};
    border-radius: 8px;
    //overflow: hidden;
    position: relative;

    :hover {
      border: 1px solid rgba(131, 137, 143, 0.56);
    }

    :focus {
      border: 1px solid rgba(131, 137, 143, 0.56);
    }
    
    .switch-type {
      padding: 12px 16px;
      min-width: 164px;
      border-right: 1px solid ${props => props.theme.colors.separator.default};
      cursor: pointer;
      
      @media screen and (max-width: 768px) {
        min-width: 100px;
      }
      
      .selected-type {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .types-container {
        position: absolute;
        background: ${props => props.theme.colors.background.card};
        //top: 100px;
        min-width: 164px;
        z-index: 99;
        top: 50px;
        left: 0;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04), 0px 4px 20px rgba(0, 0, 0, 0.12);
        border-radius: 12px;
        overflow: hidden;
        padding: 8px;

        @media screen and (max-width: 768px) {
          min-width: 86px;
        }

        .item-type {
          padding: 12px 16px;
          user-select: none;
          border-radius: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          
          :hover {
            background: ${props => props.theme.colors.background.active};
          }
        }
        
        .active-section {
          background: ${props => props.theme.colors.background.active} !important;
        }
      }
    }
    
    .input-switch-type {
      width: 100%;
      border: none;
      border-radius: 8px;
    }
  }
  
  .uitext-input-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    
    .surely {
      color: #F53C36;
    }
  }
`;

interface UITextInput {
    type: 'text' | 'number' | any,
    value?: any,
    onChange?: any,
    placeholder?: string,
    className?: string
    label: string,
    disabled?: boolean,
    secondaryText?: string,
    step?: number,
    lang?: string,
    min?: number,
    sections?: any,
    selected?: any,
    setSelected?: any,
    selectedType?: string,
    setSelectedType?: (type: string) => void;
    arrayTypes?: Array<string>
    noLabel?: boolean
    error?: null | string
}

// eslint-disable-next-line no-redeclare
export const UITextInput: React.FC<UITextInput> = ({
  type,
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  className,
  secondaryText = '',
  step,
  lang,
  min,
  sections,
  selected,
  setSelected,
  selectedType,
  setSelectedType,
  arrayTypes = [],
  noLabel,
  error = null
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const idInput = label.split(' ')[0];

  const modalRef = useOutsideClick(() => setIsOpen(false));

  return (
        <UITextInputWrapper>
            {!noLabel && (
                <div className={'uitext-input-info'}>
                    <Text className={'l2'}>
                        <label htmlFor={idInput}>
                            {label.split('*')[0]}
                        </label>
                        {label.includes('*') && (
                            <span className={'surely'}>*</span>
                        )}
                    </Text>
                    {secondaryText !== '' && (
                        <SecondaryText className={'b3'}>
                            {secondaryText}
                        </SecondaryText>
                    )}
                </div>
            )}
            {type === 'sections' && (
                <SectionsComponent
                    sections={sections}
                    selected={selected}
                    setSelected={setSelected}
                />
            )}
            {type === 'switch-type-text' && (
                <div className={`switch-type-wrapper ${className}`}>
                    <div className={'switch-type'} onClick={() => setIsOpen(!isOpen)} ref={modalRef}>
                        <SecondaryText className={'selected-type b2'} onClick={() => setIsOpen(!isOpen)}>
                            {arrayTypes[selectedIdx]}
                            <span
                                className={'icon-ic-chevron-down-16'}
                                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            />
                        </SecondaryText>
                        {isOpen && (
                            <div className={'types-container'}>
                                {arrayTypes.map((item, idx) => {
                                  const isActive = selectedIdx === idx;
                                  return (
                                    <div
                                      className={!isActive ? 'item-type' : 'item-type active-section'}
                                      key={idx + item}
                                      onClick={() => {
                                        setSelectedIdx(idx);
                                        setSelectedType(arrayTypes[idx]);
                                        setIsOpen(!isOpen);
                                      }}>
                                        <Text className={'l2'}>
                                            {item}
                                        </Text>
                                        {isActive && (
                                            <span className={'icon-ic-done-16'}></span>
                                        )}
                                    </div>
                                  );
                                })}
                            </div>
                        )}
                    </div>
                    <div className={'input-wrapper input-switch-type'}>
                        <input
                            type={'text'}
                            value={value}
                            onChange={(event) => onChange(event.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}
            {(type !== 'sections' && type !== 'switch-type-text') && (
                <div className={`input-wrapper ${className} ${error !== null ? 'error' : ''}`}>
                    <input
                        id={idInput}
                        name={idInput}
                        type={type}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        min={min}
                        lang={lang}
                        step={step}
                    />
                    {value?.length > 0 && (
                        <div className={'clear-icon'} onClick={() => onChange('')}>
                            <span className={'icon-ic-xmark-circle-16'} />
                        </div>
                    )}
                </div>
            )}
        </UITextInputWrapper>
  );
};
