import { Scope } from '@unform/core';
import Button from 'components/Button';
import FormInput from 'components/Form/FormInput';
import {
  ButtonContainer,
  FormSection,
  SectionTitle,
} from 'components/Form/styles';
import { useState } from 'react';

const CustomITOForm: React.FC = () => {
  const [packItemQuantities, setPackItemQuantities] = useState<number[]>([1]);

  const handleAddItem = (index: number) => {
    const newPackItemQuantities = [...packItemQuantities];
    newPackItemQuantities[index] += 1;
    setPackItemQuantities(newPackItemQuantities);
  };

  const handleRemoveItem = (index: number) => {
    const newPackItemQuantities = [...packItemQuantities];
    newPackItemQuantities[index] -= 1;
    setPackItemQuantities(newPackItemQuantities);
  };

  const handleAddPack = () => {
    setPackItemQuantities([...packItemQuantities, 1]);
  };

  const handleRemovePack = () => {
    const newPackItemQuantities = [...packItemQuantities];
    newPackItemQuantities.pop();
    setPackItemQuantities(newPackItemQuantities);
  };

  const getPackItems = (outerIndex: number, itemsQuantity: number) => {
    const items = [];
    for (let innerIndex = 0; innerIndex < itemsQuantity; innerIndex++) {
      items.push(
        <Scope path={`pack[${outerIndex}].packItem[${innerIndex}]`}>
          <FormSection inner>
            <SectionTitle>Pack Item</SectionTitle>
            <FormInput
              title="Amount"
              name="amount"
              required
              tooltip={tooltipsMessages['Amount']}
            />
            <FormInput
              title="Price"
              name="price"
              required
              tooltip={tooltipsMessages['Price']}
            />
          </FormSection>
        </Scope>,
      );
    }
    items.push(
      <>
        <ButtonContainer>
          <Button type="button" onClick={() => handleAddItem(outerIndex)}>
            {' '}
            Add Item
          </Button>
        </ButtonContainer>
        {packItemQuantities[outerIndex] > 1 && (
          <ButtonContainer>
            <Button type="button" onClick={() => handleRemoveItem(outerIndex)}>
              {' '}
              Remove Item{' '}
            </Button>
          </ButtonContainer>
        )}
      </>,
    );
    return items;
  };

  const tooltipsMessages = {
    Amount:
      'For NFTs: Amount sold; For token: Min amount for that price to be applied (with precision)',
    Price: 'For NFTs: Price for that amount; For Tokens: Price of each token',
  };

  return (
    <FormSection>
      <SectionTitle>PackInfo</SectionTitle>

      {packItemQuantities.map((itemsQuantity, index) => {
        return (
          <FormSection inner>
            <SectionTitle>Pack</SectionTitle>
            <FormInput
              title="Pack Currency ID"
              name={`pack[${index}].packCurrencyID`}
              span={2}
              tooltip={'Defines the currency in which the packs will be sold.'}
            />
            {getPackItems(index, itemsQuantity)}
          </FormSection>
        );
      })}

      <ButtonContainer>
        <Button type="button" onClick={handleAddPack}>
          {' '}
          Add Pack
        </Button>
      </ButtonContainer>
      {packItemQuantities.length > 1 && (
        <ButtonContainer>
          <Button type="button" onClick={handleRemovePack}>
            {' '}
            Remove Pack{' '}
          </Button>
        </ButtonContainer>
      )}
    </FormSection>
  );
};

export default CustomITOForm;
