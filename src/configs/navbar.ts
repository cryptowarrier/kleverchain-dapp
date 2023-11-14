import { GiFrozenOrb } from 'react-icons/gi';

export interface INavbarItem {
  name: string;
  pathTo: string;
  Icon: any;
  onClick?(): void;
}

export const heightLimit = 70; // pixels
export const navbarHeight = 5; // rem
export const navbarPadding = '1rem 17.5rem';

const navbarItems: INavbarItem[] = [
  {
    name: 'Staking',
    pathTo: '/staking',
    Icon: GiFrozenOrb,
  },
];

export { navbarItems };
