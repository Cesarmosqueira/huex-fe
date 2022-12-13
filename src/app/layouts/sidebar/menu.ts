import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.VEHICLES.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 2,
                label: 'MENUITEMS.VEHICLES.LIST.TRUCKFLEET',
                link: '/vehicles/truck-fleet',
                parentId: 1
            }
        ]
    },
    {
          id: 2,
          label: 'MENUITEMS.CUSTOMERS.TEXT',
          icon: 'bx-store',
          subItems: [
            {
              id: 2,
              label: 'MENUITEMS.CUSTOMERS.LIST.ROUTES',
              link: '/customers/route',
              parentId: 1
            },
            {
              id: 2,
              label: 'MENUITEMS.CUSTOMERS.LIST.RATES',
              link: '/customers/rate',
              parentId: 1
            }
          ]
    }
];

