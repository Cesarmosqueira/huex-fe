import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {ExpenseType} from "../models/expense-type.model";
import {ExpenseTypeService} from "../services/expense-type.service";

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.scss']
})
export class ExpenseTypeComponent implements OnInit {

  idExpenseTypeOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  expenseTypeForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  expenseTypes?: any;
  test: ExpenseType[] = [];
  expenseTypesList!: Observable<ExpenseType[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: ExpenseTypeService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.expenseTypesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Tipo gastos', active: true }];

    /**
     * Form Validation
     */
    this.expenseTypeForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      expenseType: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.expenseTypesList.subscribe(x => {
      this.content = this.expenseTypes;
      this.expenseTypes = Object.assign([], x);
    });
    this.idExpenseTypeOuput = 0;
    console.log(this.idExpenseTypeOuput);

    this.listExpenseTypes();
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
          this.deleteExpenseType(id);
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
    this.enableInputs();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
    this.modalService.open(content, ngbModalOptions);  }

  /**
   * Form data get
   */
  get form() {
    return this.expenseTypeForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.expenseTypeForm.valid) {
      this.pipe = new DatePipe('en-US');
      const expenseType = this.expenseTypeForm.get('expenseType')?.value;
      const description = this.expenseTypeForm.get('description')?.value;


      let expenseType1 = new ExpenseType();
      expenseType1.expenseType = expenseType;
      expenseType1.description = description;
      const id = this.expenseTypeForm.get('id')?.value;

      console.log(expenseType1);
      console.log(id);
      if (id == '0') {
        this.registerExpenseType(expenseType1);
      } else {
        expenseType1.id = id;
        this.updateExpenseType(expenseType1);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.expenseTypeForm.reset();
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
    modelTitle.innerHTML = 'Actualizar Tipo gasto';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.expenseTypes.filter((data: { id: any; }) => data.id === id);
    this.expenseTypeForm.controls['id'].setValue(listData[0].id);
    this.expenseTypeForm.controls['expenseType'].setValue(listData[0].expenseType);
    this.expenseTypeForm.controls['description'].setValue(listData[0].description);
  }

  listExpenseTypes() {
    this.service.listExpenseType()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.expenseTypes;
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

  registerExpenseType(expenseType) {
    this.service.registerExpenseType(expenseType)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              Swal.fire(
                '¡Registrado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              this.listExpenseTypes();
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

  updateExpenseType(expenseType) {
    this.service.updateExpenseType(expenseType)
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
              this.listExpenseTypes();
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
    this.expenseTypeForm.controls['id'].setValue("0");
    this.expenseTypeForm.controls['expenseType'].setValue("");
    this.expenseTypeForm.controls['description'].setValue("");
  }

  enableInputs() {
    this.expenseTypeForm.controls['id'].enable();
    this.expenseTypeForm.controls['expenseType'].enable();
    this.expenseTypeForm.controls['description'].enable();
  }

  deleteExpenseType(id) {
    this.service.deleteExpenseType(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.meta.mensajes[0].codigo == '0') {
              Swal.fire(
                '¡Eliminado!',
                'Su archivo ha sido eliminado.',
                'success'
              );
              this.listExpenseTypes();
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
}
