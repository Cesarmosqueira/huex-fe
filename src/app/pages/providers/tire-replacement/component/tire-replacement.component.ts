import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ProvinceEstivators} from "../../province-estivators/models/province-estivators.model";
import {Observable} from "rxjs";
import {ProvinceEstivatorsService} from "../../province-estivators/services/province-estivators.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {TireReplacement} from "../models/tire-replacement.model";
import {TireReplacementService} from "../services/tire-replacement.service";

@Component({
  selector: 'app-tire-replacement',
  templateUrl: './tire-replacement.component.html',
  styleUrls: ['./tire-replacement.component.scss']
})
export class TireReplacementComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  tireReplacementForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  tireReplacement?: any;
  test: TireReplacement[] = [];
  tireReplacementList!: Observable<TireReplacement[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: TireReplacementService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.tireReplacementList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Proveedores' }, { label: 'Proveedores llantas', active: true }];

    /**
     * Form Validation
     */
    this.tireReplacementForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      providerId: ['', [Validators.required]],
      replacementDate: ['', [Validators.required]],
      tireQuantity: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      totalPrice: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.tireReplacementList.subscribe(x => {
      this.content = this.tireReplacement;
      this.tireReplacement = Object.assign([], x);
    });

    this.listTireReplacement();
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
          this.deleteTireReplacement(id);
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
    return this.tireReplacementForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.tireReplacementForm.valid) {
      this.pipe = new DatePipe('en-US');
      const providerId = 5;//this.tireReplacementForm.get('providerId')?.value;
      const replacementDate = this.tireReplacementForm.get('replacementDate')?.value;
      const tireQuantity = this.tireReplacementForm.get('tireQuantity')?.value;
      const unitPrice = this.tireReplacementForm.get('unitPrice')?.value;
      const totalPrice = this.tireReplacementForm.get('totalPrice')?.value;
      const brand = this.tireReplacementForm.get('brand')?.value;
      const model = this.tireReplacementForm.get('model')?.value;
      const observation = this.tireReplacementForm.get('observation')?.value;


      let tireReplacement = new TireReplacement();
      tireReplacement.providerId = providerId;
      tireReplacement.replacementDate = replacementDate;
      tireReplacement.tireQuantity = tireQuantity;
      tireReplacement.unitPrice = unitPrice;
      tireReplacement.totalPrice = totalPrice;
      tireReplacement.brand = brand;
      tireReplacement.model = model;
      tireReplacement.observation = observation;

      const id = this.tireReplacementForm.get('id')?.value;
      console.log(tireReplacement);
      console.log(id);
      if (id == '0') {
        this.registerTireReplacement(tireReplacement);
      } else {
        tireReplacement.id = id;
        this.updateTireReplacement(tireReplacement);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.tireReplacementForm.reset();
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
    modelTitle.innerHTML = 'Actualizar proveedores llantas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.tireReplacement.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.tireReplacementForm.controls['id'].setValue(listData[0].id);
    this.tireReplacementForm.controls['providerId'].setValue(listData[0].providerId);
    this.tireReplacementForm.controls['replacementDate'].setValue(fortmatFabricationDate);
    this.tireReplacementForm.controls['tireQuantity'].setValue(listData[0].tireQuantity);
    this.tireReplacementForm.controls['unitPrice'].setValue(listData[0].unitPrice);
    this.tireReplacementForm.controls['totalPrice'].setValue(listData[0].totalPrice);
    this.tireReplacementForm.controls['brand'].setValue(listData[0].brand);
    this.tireReplacementForm.controls['model'].setValue(listData[0].model);
    this.tireReplacementForm.controls['observation'].setValue(listData[0].observation);

  }

  listTireReplacement() {
    this.service.listTireReplacement()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.tireReplacementsDtoList;
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

  registerTireReplacement(tireReplacement) {
    this.service.registerTireReplacement(tireReplacement)
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
              this.listTireReplacement();
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

  updateTireReplacement(tireReplacement) {
    this.service.updateTireReplacement(tireReplacement)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listTireReplacement();
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

  deleteTireReplacement(id) {
    this.service.deleteTireReplacement(id)
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
              this.listTireReplacement();
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
