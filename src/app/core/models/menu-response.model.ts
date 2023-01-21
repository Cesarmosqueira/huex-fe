export class Menu {
    id?: number;
    idParent?: number;
    idChild?: number;
    label?: string;
    link?: string;
    status?: string;
    icon?: string;
    update?: boolean;
    delete?: boolean;
    create?: boolean;
    subItems?: Menu[];
    badge?: any;
    check?: boolean;
}