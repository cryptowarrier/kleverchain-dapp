import { Scope, SubmitHandler, FormHandles } from '@unform/core';
import React from 'react';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { parseData } from 'utils';

import Button from '../Button';
import FormInput from './FormInput';

import { ButtonContainer, FormBody, FormSection, SectionTitle } from './styles';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  span?: number;
  type?: string;

  array?: boolean;
  length?: number;
  options?: {
    label: string;
    value: any;
  }[];
  toggleOptions?: [string, string];
  bool?: boolean;
  required?: boolean;
  innerSection?: ISection;
  selectPlaceholder?: string;
  tooltip?: string;
}
export interface IFormField {
  label: string;
  props?: IInputProps;
}
export interface ISection {
  title?: string;
  inner?: boolean;
  innerPath?: string;
  fields: IFormField[];
}
interface IFormProps {
  sections: ISection[];
  onSubmit: (values: any) => void;
  buttonLabel?: string;
  cancelOnly?: boolean;
  children?: React.ReactNode;
}
const Form: React.FC<IFormProps> = ({
  sections: defaultSections,
  buttonLabel,
  onSubmit,
  children,
  cancelOnly,
}) => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const [sections, setSections] = useState(defaultSections);

  const addArrayItem = (
    field: IFormField,
    sectionIndex: number,
    fieldIndex: number,
  ) => {
    let length = sections[sectionIndex].fields[fieldIndex].props?.length;
    if (length) {
      length += 1;
    } else {
      length = 2;
    }

    const newSections = [...sections];

    newSections[sectionIndex].fields[fieldIndex].props = {
      ...newSections[sectionIndex].fields[fieldIndex].props,
      length,
    };

    setSections(newSections);
  };

  const removeArrayItem = (
    field: IFormField,
    sectionIndex: number,
    fieldIndex: number,
  ) => {
    let length = sections[sectionIndex].fields[fieldIndex].props?.length;

    if (length && length > 1) {
      length -= 1;
    }

    const newSections = [...sections];

    newSections[sectionIndex].fields[fieldIndex].props = {
      ...newSections[sectionIndex].fields[fieldIndex].props,
      length,
    };

    setSections(newSections);
  };

  const addFieldButton = (
    field: IFormField,
    sectionIndex: number,
    fieldIndex: number,
  ) => {
    return (
      field.props?.array && (
        <ButtonContainer>
          <Button
            onClick={() => addArrayItem(field, sectionIndex, fieldIndex)}
            type="button"
          >
            Add
          </Button>
        </ButtonContainer>
      )
    );
  };

  const removeFieldButton = (
    field: IFormField,
    sectionIndex: number,
    fieldIndex: number,
  ) => {
    const length = sections[sectionIndex]?.fields[fieldIndex]?.props?.length;

    return (
      field.props?.array &&
      length &&
      length > 1 && (
        <ButtonContainer>
          <Button
            onClick={() => removeArrayItem(field, sectionIndex, fieldIndex)}
            type="button"
          >
            Remove
          </Button>
        </ButtonContainer>
      )
    );
  };

  const getScopePath = (field: IFormField, index?: number) => {
    if (field.props?.innerSection) {
      const path =
        field.props.innerSection.innerPath &&
        field.props?.innerSection.innerPath;
      return path;
    }
  };

  const getSectionArrayInputs = (field: IFormField, sectionIndex?: number) => {
    const fields = [];

    if (field.props?.length) {
      for (let i = 0; i < field.props.length; i++) {
        fields.push(
          <Scope path={`${getScopePath(field)}[${i}]`} key={String(i)}>
            {getSectionInputs(field.props.innerSection, sectionIndex)}
          </Scope>,
        );
      }
    } else {
      fields.push(
        <Scope path={`${getScopePath(field)}[0]`} key={'0'}>
          {getSectionInputs(field.props?.innerSection, sectionIndex)}
        </Scope>,
      );
    }

    return fields;
  };

  const getArrayInputs = (field: IFormField, section: ISection) => {
    const fields = [];
    const len = field.props?.length ? field.props.length : 1;
    for (let i = 0; i < len; i++) {
      fields.push(
        <Scope path={`${section.title}[${i}]`} key={String(i)}>
          <FormInput
            title={field.label}
            name={field.label.replace(/\s/g, '')}
            {...field.props}
          />
        </Scope>,
      );
    }

    return fields;
  };

  const unCapitalize = (string: string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
  };

  const getInputField = (field: IFormField, section: ISection) => {
    if (field.props?.array && field.props?.length) {
      return getArrayInputs(field, section);
    } else {
      if (section.title && !section.inner) {
        return (
          <Scope path={unCapitalize(section.title.replace(/\s/g, ''))}>
            <FormInput
              title={field.label}
              name={`${unCapitalize(field.label.replace(/\s/g, ''))}`}
              {...field.props}
            />
          </Scope>
        );
      } else {
        return (
          <FormInput
            title={field.label}
            name={`${unCapitalize(field.label.replace(/\s/g, ''))}`}
            {...field.props}
          />
        );
      }
    }
  };

  const getSectionInputs: any = (section: ISection, sectionIndex: number) => {
    return section.fields.map((field, index) => {
      if (field.props?.innerSection && !field.props?.array) {
        return (
          <FormSection inner key={String(index)}>
            <SectionTitle>{field.label}</SectionTitle>
            <Scope path={String(getScopePath(field, index))}>
              {getSectionInputs(field.props?.innerSection)}
            </Scope>
          </FormSection>
        );
      } else if (field.props?.innerSection && field.props.array) {
        return (
          <FormSection inner key={String(index)}>
            <SectionTitle>{field.label}</SectionTitle>
            {getSectionArrayInputs(field, sectionIndex)}
            {addFieldButton(field, sectionIndex, index)}
            {removeFieldButton(field, sectionIndex, index)}
          </FormSection>
        );
      } else {
        return (
          <React.Fragment key={String(index)}>
            {getInputField(field, section)}
          </React.Fragment>
        );
      }
    });
  };

  const handleSubmit: SubmitHandler<FormData> = (data: any) => {
    parseData(data);

    onSubmit(data);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const formProps = {
    onSubmit: handleSubmit,
    ref: formRef,
  };

  return (
    <FormBody {...formProps}>
      {sections.map((section, index) => (
        <FormSection key={String(index)}>
          <SectionTitle>{section.title}</SectionTitle>
          {getSectionInputs(section, index)}
        </FormSection>
      ))}
      {children}
      <ButtonContainer submit>
        <Button onClick={handleGoBack} type="button">
          {'Cancel'}
        </Button>
        {!cancelOnly && (
          <Button type="submit">{buttonLabel ? buttonLabel : 'Create'}</Button>
        )}
      </ButtonContainer>
    </FormBody>
  );
};

export default Form;
