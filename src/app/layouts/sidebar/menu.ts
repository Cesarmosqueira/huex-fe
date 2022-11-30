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
    }
];

