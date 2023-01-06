import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Employee } from 'src/app/pages/employees/employee/models/employee.model';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
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

  constructor(public service: UserService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder) {
    this.usersList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cliente' }, { label: 'Rutas de clientes', active: true }];

    /**
     * Form Validation
     */
    this.userForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      idEmployee: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
      active: ['', [Validators.required]]
    });

    this.usersList.subscribe(x => {
      this.content = this.users;
      this.users = Object.assign([], x);
    });
    this.idUserOuput = 0;
    console.log(this.idUserOuput);

    this.listUsers();
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
          //this.deleteUser(id);
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
  saveUser() {
    this.submitted = true
    if (this.userForm.valid) {
      this.pipe = new DatePipe('en-US');
      const userName = this.userForm.get('userName')?.value;
      const password = this.userForm.get('password')?.value;
      const role = this.userForm.get('role')?.value;
      const active = this.userForm.get('active')?.value;
      const idEmployee = this.userForm.get('idEmployee')?.value;
      let user = new User();
      user.userName = userName;
      user.password = password;
      user.role = 1;
      user.active = true;
      let employee = new Employee();
      employee.id = 1;
      user.employee = employee;
      const id = this.userForm.get('id')?.value;

      console.log(user);
      console.log(id);
      if (id == '0') {
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
    this.enableInputs();

    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar rutas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.users.filter((data: { id: any; }) => data.id === id);
    this.userForm.controls['id'].setValue(listData[0].id);
    this.userForm.controls['userStart'].setValue(listData[0].userStart);
    this.userForm.controls['userEnd'].setValue(listData[0].userEnd);
    this.userForm.controls['zone'].setValue(listData[0].zone);
    this.userForm.controls['distanceKM'].setValue(listData[0].distanceKM);
    this.userForm.controls['gallons'].setValue(listData[0].gallons);
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

  clear() {
    this.userForm.controls['id'].setValue("0");
    this.userForm.controls['userName'].setValue("");
    this.userForm.controls['password'].setValue("");
    this.userForm.controls['role'].setValue("");
    this.userForm.controls['idEmployee'].setValue(null);
  }

  enableInputs() {
    this.userForm.controls['id'].enable();
    this.userForm.controls['userName'].enable();
    this.userForm.controls['password'].enable();
    this.userForm.controls['role'].enable();
  }
}
