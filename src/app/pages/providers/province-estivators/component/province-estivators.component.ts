import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Route} from "../../../customers/route/models/route.model";
import {Observable} from "rxjs";
import {RouteService} from "../../../customers/route/services/route.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {ProvinceEstivators} from "../models/province-estivators.model";
import {ProvinceEstivatorsService} from "../services/province-estivators.service";

@Component({
  selector: 'app-province-estivators',
  templateUrl: './province-estivators.component.html',
  styleUrls: ['./province-estivators.component.scss']
})
export class ProvinceEstivatorsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  provinceEstivatorForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  provinceEstivator?: any;
  test: ProvinceEstivators[] = [];
  provinceEstivatorsList!: Observable<ProvinceEstivators[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: ProvinceEstivatorsService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.provinceEstivatorsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Proveedores' }, { label: 'Proveedores estivadores', active: true }];

    /**
     * Form Validation
     */
    this.provinceEstivatorForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      routeId: ['', [Validators.required]],
      providerId: ['', [Validators.required]],
      costM3: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.provinceEstivatorsList.subscribe(x => {
      this.content = this.provinceEstivator;
      this.provinceEstivator = Object.assign([], x);
    });

    this.listProvinceEstivators();
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
          this.deleteProvinceEstivators(id);
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
    return this.provinceEstivatorForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.provinceEstivatorForm.valid) {
      this.pipe = new DatePipe('en-US');
      const routeId = 5;//this.provinceEstivatorForm.get('routeId')?.value;
      const providerId =4; //this.provinceEstivatorForm.get('providerId')?.value;
      const costM3 = this.provinceEstivatorForm.get('costM3')?.value;
      const observation = this.provinceEstivatorForm.get('observation')?.value;

      let provinceEstivators = new ProvinceEstivators();
      provinceEstivators.routeId = routeId;
      provinceEstivators.providerId = providerId;
      provinceEstivators.costM3 = costM3;
      provinceEstivators.observation = observation;
      const id = this.provinceEstivatorForm.get('id')?.value;
      console.log(provinceEstivators);
      console.log(id);
      if (id == '0') {
        this.registerProvinceEstivators(provinceEstivators);
      } else {
        provinceEstivators.id = id;
        this.updateProvinceEstivators(provinceEstivators);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.provinceEstivatorForm.reset();
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
    modelTitle.innerHTML = 'Actualizar estivadores';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.provinceEstivator.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.provinceEstivatorForm.controls['id'].setValue(listData[0].id);
    this.provinceEstivatorForm.controls['routeId'].setValue(listData[0].routeId);
    this.provinceEstivatorForm.controls['providerId'].setValue(listData[0].providerId);
    this.provinceEstivatorForm.controls['costM3'].setValue(listData[0].costM3);
    this.provinceEstivatorForm.controls['observation'].setValue(listData[0].observation);
  }

  listProvinceEstivators() {
    this.service.listProvinceEstivators()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.provinceEstivatorsDtoList;
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

  registerProvinceEstivators(provinceEstivators) {
    this.service.registerProvinceEstivators(provinceEstivators)
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
              this.provinceEstivator();
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

  updateProvinceEstivators(provinceEstivators) {
    this.service.updateProvinceEstivators(provinceEstivators)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listProvinceEstivators();
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

  deleteProvinceEstivators(id) {
    this.service.deleteProvinceEstivators(id)
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
              this.listProvinceEstivators();
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
