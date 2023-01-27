import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first, retry } from 'rxjs/operators';
import { Menu } from 'src/app/core/models/menu-response.model';
import { Employee } from 'src/app/pages/employees/employee/models/employee.model';
import { EmployeeService } from 'src/app/pages/employees/employee/services/employee.service';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

interface Tree {
  root: TreeNode;
}

interface TreeNode {
  label: string;
  check?: boolean;
  children: TreeNode[];
}


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {


  idUserOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  userForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  users?: any;
  test: User[] = [];
  usersList!: Observable<User[]>;
  total: Observable<number>;
  pipe: any;
  menu: Menu[] = [];
  idsSubItem: number[] = [];
  subItmens: Menu[] = [];
  employees: Employee[] = [];
  public data: Menu[];
  public selectedTreeNode: Menu | null;
  selectedEmployee: any;

  constructor(public service: UserService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    public employeeService: EmployeeService) {
    this.usersList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Administración' }, { label: 'Usuarios', active: true }];

    /**
     * Form Validation
     */
    this.userForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      idEmployee: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      active: ['', [Validators.required]]
    });

    this.usersList.subscribe(x => {
      this.content = this.users;
      this.users = Object.assign([], x);
    });
    this.idUserOuput = 0;
    console.log(this.idUserOuput);
    this.listMenus();
    this.listUsers();
    this.listEmployees();
  }

  /**
   * Open modal
   * @param content modal content
   */
  openViewModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  delete(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Está seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          this.deleteUser(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.clear();
    this.submitted = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.userForm.controls;
  }

  /**
   * Save user
   */
  validation() {

    /*if (!this.userForm.valid) {
      Swal.fire({
        icon: config.ERROR,
        title: "Debe Completar todos los datos del Usuario",
        showConfirmButton: false,
      });
      return false;
    }

    if (this.idsSubItem.length <= 0) {
      Swal.fire({
        icon: config.ERROR,
        title: "Debe seleccionar al menos una opción del menú",
        showConfirmButton: false,
      });
      return false;
    }*/

    return true;
  }

  saveUser() {
    this.submitted = true;
    if (this.validation()) {
      this.pipe = new DatePipe('en-US');
      const userName = this.userForm.get('userName')?.value;
      const password = this.userForm.get('password')?.value;
      const active = this.userForm.get('active')?.value;
      const idEmployee = this.userForm.get('idEmployee')?.value;
      let user = new User();
      let menu = [];
      user.userName = userName;
      user.password = password;
      user.active = active == "ACTIVO" ? true : false;
      user.employee = this.selectedEmployee;
      const id = this.userForm.get('id')?.value;

      this.idsSubItem.forEach(id => {
        this.subItmens.forEach(item => {
          if (item.id === id) {
            menu.push(item);
          }
        });
      });

      const idsParent = [...new Set(menu.map(item => item.idParent))];

      idsParent.forEach(id => {
        this.data.forEach(element => {
          if (id == element.idParent) {
            menu.push(element);
          }
        });
      });

      user.menus = menu;

      if (id == '0') {
        console.log("user");
        console.log(user);
        this.registerUsers(user);
      } else {
        user.id = id;
        this.updateUsers(user);
      }

      this.modalService.dismissAll();

      setTimeout(() => {
        this.userForm.reset();
      }, 2000);

    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.pipe = new DatePipe('en-US');

    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar Usuario';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";

    this.clear();
    this.enableInputs();
    this.userForm.reset();
    var listData = this.users.filter((data: { id: any; }) => data.id === id);

    this.userForm.controls['id'].setValue(listData[0].id);
    this.userForm.controls['idEmployee'].setValue(listData[0].employee.fullName);
    this.userForm.controls['userName'].setValue(listData[0].userName);
    this.userForm.controls['password'].setValue(listData[0].password);
    this.userForm.controls['active'].setValue(listData[0].active == true ? "ACTIVO" : "INACTIVO");
    this.idUserOuput = id;

  }

  listUsers() {
    this.service.listUsers()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.users;
              this.service.paginationTable(this.test);
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  registerUsers(users) {
    this.service.registerUser(users)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            console.log(response);
            if (response.datos) {
              Swal.fire(
                '¡Registrado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              const user = response.datos.user;
              this.idUserOuput = user.id;
              this.listUsers();
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
              showConfirmButton: false,
            });
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  updateUsers(user) {
    this.service.registerUser(user)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              Swal.fire(
                '¡Actualizado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
              showConfirmButton: false,
            });
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  deleteUser(id) {
    console.log(id);
    this.service.deleteUser(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.meta.mensajes[0].codigo == '0') {
              Swal.fire(
                '¡Eliminado!',
                'El usuario ha sido eliminado.',
                'success'
              );

              this.listUsers();
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
              showConfirmButton: false,
            });
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  listEmployees() {
    this.employeeService.listEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.employees = response.datos.employees;
            }
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  clear() {
    this.userForm.reset();
    this.userForm.controls['userName'].setValue("");
    this.userForm.controls['password'].setValue("");
    this.userForm.controls['idEmployee'].setValue(null);
    this.userForm.controls['active'].setValue(null);
  }

  enableInputs() {
    this.userForm.controls['id'].enable();
    this.userForm.controls['userName'].enable();
    this.userForm.controls['password'].enable();
  }

  listMenus() {
    this.service.listMenus()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.menu = response.datos.menus;
              this.data = this.menu;
              this.data.forEach(element => {
                element.subItems.forEach(subItem => {
                  this.subItmens.push(subItem);
                });
              });
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  public selectNode(node: Menu, value: boolean): void {
    this.check(node, value);
  }

  check(node: any, value: boolean) {
    node.check = value;
    node.subItems.forEach((x) => {
      x.check = value;
      if (value) {
        this.idsSubItem.push(x.id);
      } else {
        const index = this.idsSubItem.indexOf(x.id)
        if (index > -1) {
          this.idsSubItem.splice(index, 1);
        }
      }

    });
  }

  public selectParent(
    subItem: Menu,
    value: boolean,
    node: Menu[],
    parent: Menu
  ): void {
    subItem.check = value;
    if (value) {
      this.idsSubItem.push(subItem.id);
    } else {
      const index = this.idsSubItem.indexOf(subItem.id)
      if (index > -1) {
        this.idsSubItem.splice(index, 1);
      }
    }
    const availableOptions = node.filter(item => item.check === false).length;
    if (availableOptions === 0) {
      parent.check = true;
    } else {
      parent.check = false;
    }
  }


}
