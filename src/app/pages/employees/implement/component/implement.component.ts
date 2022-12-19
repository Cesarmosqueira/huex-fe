import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Implement} from "../models/implement.model";
import {ImplementService} from "../services/implement.service";

@Component({
  selector: 'app-implement',
  templateUrl: './implement.component.html',
  styleUrls: ['./implement.component.scss']
})
export class ImplementComponent implements OnInit {


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  implementForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  implement?: any;
  test: Implement[] = [];
  implementsList!: Observable<Implement[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: ImplementService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.implementsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Implementos', active: true }];

    /**
     * Form Validation
     */
    this.implementForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      available: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });

    this.implementsList.subscribe(x => {
      this.content = this.implement;
      this.implement = Object.assign([], x);
    });

    this.listImplements();
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
          this.deleteImplement(id);
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
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.implementForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.implementForm.valid) {
      this.pipe = new DatePipe('en-US');
      const name = this.implementForm.get('name')?.value;
      const description = this.implementForm.get('description')?.value;
      const available = this.implementForm.get('available')?.value;
      const stock = this.implementForm.get('stock')?.value;

      let implement = new Implement();
      implement.name = name;
      implement.description = description;
      implement.available = available;
      implement.stock = stock;
      const id = this.implementForm.get('id')?.value;
      console.log(implement);
      console.log(id);
      if (id == '0') {
        this.registerImplement(implement);
      } else {
        implement.id = id;
        this.updateImplement(implement);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.implementForm.reset();
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
    modelTitle.innerHTML = 'Actualizar implementos';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.implement.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.implementForm.controls['id'].setValue(listData[0].id);
    this.implementForm.controls['name'].setValue(listData[0].name);
    this.implementForm.controls['description'].setValue(listData[0].description);
    this.implementForm.controls['available'].setValue(listData[0].available);
    this.implementForm.controls['stock'].setValue(listData[0].stock);
  }

  listImplements() {
    this.service.listImplements()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.implementDtoList;
              this.service.paginationTable(this.test);
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
              title: "Ocurrio un error, comuniquese con el Encargado",
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

  registerImplement(implement) {
    this.service.registerImplement(implement)
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
              this.implement();
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
              title: "Ocurrio un error, comuniquese con el encargado",
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

  updateImplement(implement) {
    this.service.updateImplement(implement)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listImplements();
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
              title: "Ocurrio un error, comuniquese con el encargado",
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

  deleteImplement(id) {
    this.service.deleteImplement(id)
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
              this.listImplements();
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
              title: "Ocurrio un error, comuniquese con el encargado",
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
