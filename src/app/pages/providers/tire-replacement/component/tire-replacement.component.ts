import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {TireReplacement} from "../models/tire-replacement.model";
import {TireReplacementService} from "../services/tire-replacement.service";
import {Providers} from "../../provider/models/providers.model";
import {ProviderService} from "../../provider/services/provider.service";

@Component({
  selector: 'app-tire-replacement',
  templateUrl: './tire-replacement.component.html',
  styleUrls: ['./tire-replacement.component.scss']
})
export class TireReplacementComponent implements OnInit {

  idTireReplacementOuput: number = 0;

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

  providers:Providers[]=[];
  selectProvider=null;

  constructor(public service: TireReplacementService,
              private modalService: NgbModal,
              private serviceProvider:ProviderService,
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
      provider: ['', [Validators.required]],
      replacementDate: ['', [Validators.required]],
      tireQuantity: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.tireReplacementList.subscribe(x => {
      this.content = this.tireReplacement;
      this.tireReplacement = Object.assign([], x);
    });
    this.idTireReplacementOuput = 0;
    console.log(this.idTireReplacementOuput);

    this.listProviders();
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
    this.clear();
    this.submitted = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    };
    this.selectProvider=null;
    this.modalService.open(content, ngbModalOptions);
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
      const providerId = this.selectProvider.id;
      const replacementDate = this.tireReplacementForm.get('replacementDate')?.value;
      const fortmatreplacementDate = this.pipe.transform(replacementDate, 'yyyy-MM-dd');
      const tireQuantity = this.tireReplacementForm.get('tireQuantity')?.value;
      const unitPrice = this.tireReplacementForm.get('unitPrice')?.value;
      const brand = this.tireReplacementForm.get('brand')?.value;
      const model = this.tireReplacementForm.get('model')?.value;
      const observation = this.tireReplacementForm.get('observation')?.value;


      let tireReplacement = new TireReplacement();
      let providers=new Providers();

      providers.id=providerId;

      tireReplacement.provider = providers;
      tireReplacement.replacementDate = fortmatreplacementDate;
      tireReplacement.tireQuantity = tireQuantity;
      tireReplacement.unitPrice = unitPrice;
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
    this.modalService.open(content, { size: 'lg', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar proveedores llantas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.tireReplacement.filter((data: { id: any; }) => data.id === id);
    const replacementDate = listData[0].replacementDate.substring(0, 10);
    const fortmatreplacementDate = this.pipe.transform(replacementDate, 'yyyy-MM-dd');
    this.tireReplacementForm.controls['id'].setValue(listData[0].id);
    this.tireReplacementForm.controls['provider'].setValue(listData[0].provider);
    this.tireReplacementForm.controls['replacementDate'].setValue(fortmatreplacementDate);
    this.tireReplacementForm.controls['tireQuantity'].setValue(listData[0].tireQuantity);
    this.tireReplacementForm.controls['unitPrice'].setValue(listData[0].unitPrice);
    this.tireReplacementForm.controls['brand'].setValue(listData[0].brand);
    this.tireReplacementForm.controls['model'].setValue(listData[0].model);
    this.tireReplacementForm.controls['observation'].setValue(listData[0].observation);
    this.selectProvider=listData[0].providers.businessName;

    this.idTireReplacementOuput = id;
  }

  listTireReplacement() {
    this.service.listTireReplacement()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.tiresReplacement;
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
              Swal.fire(
                '¡Actualizado!',
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

  clear() {
    this.tireReplacementForm.controls['id'].setValue("0");
    this.tireReplacementForm.controls['provider'].setValue("");
    this.tireReplacementForm.controls['replacementDate'].setValue("");
    this.tireReplacementForm.controls['tireQuantity'].setValue("");
    this.tireReplacementForm.controls['unitPrice'].setValue("");
    this.tireReplacementForm.controls['brand'].setValue("");
    this.tireReplacementForm.controls['model'].setValue("");
    this.tireReplacementForm.controls['observation'].setValue("");
  }

  enableInputs() {
    this.tireReplacementForm.controls['id'].enable();
    this.tireReplacementForm.controls['provider'].enable();
    this.tireReplacementForm.controls['replacementDate'].enable();
    this.tireReplacementForm.controls['tireQuantity'].enable();
    this.tireReplacementForm.controls['unitPrice'].enable();
    this.tireReplacementForm.controls['brand'].enable();
    this.tireReplacementForm.controls['model'].enable();
    this.tireReplacementForm.controls['observation'].enable();
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


  listProviders() {
    this.serviceProvider.listProviders()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.providers = response.datos.providers;
              console.log(this.providers);
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
}
