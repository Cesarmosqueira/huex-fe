import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {FuelSupply} from "../models/fuel-supply.model";
import {FuelSupplyService} from "../services/fuel-supply.service";
import {Providers} from "../../provider/models/providers.model";
import {ProviderService} from "../../provider/services/provider.service";

@Component({
  selector: 'app-fuel-supply',
  templateUrl: './fuel-supply.component.html',
  styleUrls: ['./fuel-supply.component.scss']
})
export class FuelSupplyComponent implements OnInit {

  idFuelSupplyOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  fuelSupplyForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  fuelSupply?: any;
  test: FuelSupply[] = [];
  fuelSuplyList!: Observable<FuelSupply[]>;
  total: Observable<number>;
  pipe: any;

  providers:Providers[]=[];
  selectProvider=null;

  constructor(public service: FuelSupplyService,
              private modalService: NgbModal,
              private serviceProvider:ProviderService,
              private formBuilder: UntypedFormBuilder) {
    this.fuelSuplyList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Proveedores' }, { label: 'Proveedores Combustible', active: true }];

    /**
     * Form Validation
     */
    this.fuelSupplyForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      provider: ['', [Validators.required]],
      dateFuel: ['', [Validators.required]],
      fuelQuantity: ['', [Validators.required]],
      gallonPrice: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.fuelSuplyList.subscribe(x => {
      this.content = this.fuelSupply;
      this.fuelSupply = Object.assign([], x);
    });
    this.idFuelSupplyOuput = 0;
    console.log(this.idFuelSupplyOuput);
    this.listProviders();
    this.listFuelSupply();
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
          this.deleteFuelSupply(id);
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
    this.selectProvider=null;
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.fuelSupplyForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.fuelSupplyForm.valid) {
      this.pipe = new DatePipe('en-US');
      const providerId = this.selectProvider.id;
      const dateFuel = this.fuelSupplyForm.get('dateFuel')?.value;
      const fortmatdateFuel = this.pipe.transform(dateFuel, 'yyyy-MM-dd');
      const fuelQuantity = this.fuelSupplyForm.get('fuelQuantity')?.value;
      const gallonPrice = this.fuelSupplyForm.get('gallonPrice')?.value;
      const observation = this.fuelSupplyForm.get('observation')?.value;

      let fuelSupply = new FuelSupply();
      let providers=new Providers();
      providers.id=providerId;
      fuelSupply.provider = providers;
      fuelSupply.dateFuel = fortmatdateFuel;
      fuelSupply.fuelQuantity = fuelQuantity;
      fuelSupply.gallonPrice = gallonPrice;
      fuelSupply.observation = observation;


      const id = this.fuelSupplyForm.get('id')?.value;
      console.log(fuelSupply);
      console.log(id);
      if (id == '0') {
        this.registerFuelSupply(fuelSupply);
      } else {
        fuelSupply.id = id;
        this.updateFuelSupply(fuelSupply);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.fuelSupplyForm.reset();
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
    modelTitle.innerHTML = 'Actualizar proveedores combustible';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.fuelSupply.filter((data: { id: any; }) => data.id === id);
    const dateFuel = listData[0].dateFuel.substring(0, 10);
    const fortmatdateFuel = this.pipe.transform(dateFuel, 'yyyy-MM-dd');
    this.fuelSupplyForm.controls['id'].setValue(listData[0].id);
    this.fuelSupplyForm.controls['provider'].setValue(listData[0].provider);
    this.fuelSupplyForm.controls['dateFuel'].setValue(fortmatdateFuel);
    this.fuelSupplyForm.controls['fuelQuantity'].setValue(listData[0].fuelQuantity);
    this.fuelSupplyForm.controls['gallonPrice'].setValue(listData[0].gallonPrice);
    this.fuelSupplyForm.controls['observation'].setValue(listData[0].observation);
    this.selectProvider=listData[0].provider.businessName;
    this.idFuelSupplyOuput = id;
  }

  listFuelSupply() {
    this.service.listFuelSupply()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.fuelsSupply;
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

  registerFuelSupply(fuelSupply) {
    this.service.registerFuelSupply(fuelSupply)
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
              this.listFuelSupply();
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

  updateFuelSupply(fuelSupply) {
    this.service.updateFuelSupply(fuelSupply)
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
              this.listFuelSupply();
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
    this.fuelSupplyForm.controls['id'].setValue("0");
    this.fuelSupplyForm.controls['provider'].setValue("");
    this.fuelSupplyForm.controls['dateFuel'].setValue("");
    this.fuelSupplyForm.controls['fuelQuantity'].setValue("");
    this.fuelSupplyForm.controls['gallonPrice'].setValue("");
    this.fuelSupplyForm.controls['observation'].setValue("");

  }

  enableInputs() {
    this.fuelSupplyForm.controls['id'].enable();
    this.fuelSupplyForm.controls['provider'].enable();
    this.fuelSupplyForm.controls['dateFuel'].enable();
    this.fuelSupplyForm.controls['fuelQuantity'].enable();
    this.fuelSupplyForm.controls['gallonPrice'].enable();
    this.fuelSupplyForm.controls['observation'].enable();

  }

  deleteFuelSupply(id) {
    this.service.deleteFuelSupply(id)
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
              this.listFuelSupply();
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
