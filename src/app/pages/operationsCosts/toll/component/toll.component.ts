import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Rate} from "../../../customers/rate/models/rate.model";
import {Observable} from "rxjs";
import {Customer} from "../../../customers/customer/models/customer.model";
import {Route} from "../../../customers/route/models/route.model";
import {RateService} from "../../../customers/rate/services/rate.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {RouteService} from "../../../customers/route/services/route.service";
import {CustomerService} from "../../../customers/customer/services/customer.service";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Toll} from "../models/toll.model";
import {TollService} from "../services/toll.service";

@Component({
  selector: 'app-toll',
  templateUrl: './toll.component.html',
  styleUrls: ['./toll.component.scss']
})
export class TollComponent implements OnInit {

  idTollOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  tollForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  tolls?: any;
  test: Toll[] = [];
  tollList!: Observable<Toll[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: TollService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.tollList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Costo operaciones' }, { label: 'Peajes', active: true }];

    /**
     * Form Validation
     */
    this.tollForm = this.formBuilder.group({
      id: ['0'],
      place: [''],
      configuration: [''],
      cost: [''],
      btnSave: []
    });

    this.tollList.subscribe(x => {
      this.content = this.tolls;
      this.tolls = Object.assign([], x);
    });
    this.idTollOuput = 0;

    this.listToll();

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
          this.deleteToll(id);
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
      size: 'lg'
    };
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.tollForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.tollForm.valid) {
      this.pipe = new DatePipe('en-US');
      const place = this.tollForm.get('place')?.value;
      const configuration = this.tollForm.get('configuration')?.value;
      const cost = this.tollForm.get('cost')?.value;

      let toll = new Toll();

      toll.place = place;
      toll.configuration = configuration;
      toll.cost = cost;


      const id = this.tollForm.get('id')?.value;

      if (id == '0') {
        this.registerToll(toll);
      } else {
        toll.id = id;
        this.updateToll(toll);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.tollForm.reset();
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

    this.modalService.open(content, { size: 'lg', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar peajes';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.tolls.filter((data: { id: any; }) => data.id === id);
    this.tollForm.controls['id'].setValue(listData[0].id);
    this.tollForm.controls['place'].setValue(listData[0].place);
    this.tollForm.controls['configuration'].setValue(listData[0].configuration);
    this.tollForm.controls['cost'].setValue(listData[0].cost);
    this.idTollOuput = id;
  }

  listToll() {
    this.service.listTolls()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.tollDto;
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

  registerToll(toll) {
    this.service.registerToll(toll)
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
              this.listToll();
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

  updateToll(toll) {
    this.service.updateToll(toll)
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
              this.listToll();
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
    this.tollForm.controls['id'].setValue("0");
    this.tollForm.controls['place'].setValue("");
    this.tollForm.controls['configuration'].setValue("");
    this.tollForm.controls['cost'].setValue("");


  }
  enableInputs() {
    this.tollForm.controls['id'].enable();
    this.tollForm.controls['place'].enable();
    this.tollForm.controls['configuration'].enable();
    this.tollForm.controls['cost'].enable();

  }

  deleteToll(id) {
    this.service.deleteToll(id)
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
              this.listToll();
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
