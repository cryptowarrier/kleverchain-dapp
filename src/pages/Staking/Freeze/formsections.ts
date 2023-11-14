import { ISection } from 'components/Form';
import { IDropdownItem } from 'components/Form/FormInput/Select';

const sections = (assets: IDropdownItem[]): ISection[] => {
  const section = [] as ISection[];
  const parsedAssets = assets;

  const klv = parsedAssets.find(asset => asset.value === 'KLV');

  if (!klv) {
    parsedAssets.unshift({
      label: 'KLV',
      value: 'KLV',
    });
  }
  section.push({
    fields: [
      {
        label: 'Asset Id',
        props: {
          type: 'dropdown',
          options: parsedAssets,
          required: true,
          tooltip: 'Defaults to KLV',
        },
      },
      {
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip: 'Amount to be frozen (with precision)',
        },
      },
    ],
  });

  return section;
};

export default sections;
