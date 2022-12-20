import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {FuelSupply} from "../models/fuel-supply.model";
import {FuelSupplyService} from "../services/fuel-supply.service";

@Component({
  selector: 'app-fuel-supply',
  templateUrl: './fuel-supply.component.html',
  styleUrls: ['./fuel-supply.component.scss']
})
export class FuelSupplyComponent implements OnInit {

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

  constructor(public service: FuelSupplyService,
              private modalService: NgbModal,
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
      providerId: ['', [Validators.required]],
      dateFuel: ['', [Validators.required]],
      fuelQuantity: ['', [Validators.required]],
      gallonPrice: ['', [Validators.required]],
      totalPrice: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.fuelSuplyList.subscribe(x => {
      this.content = this.fuelSupply;
      this.fuelSupply = Object.assign([], x);
    });

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
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
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
      const providerId = 5;//this.fuelSupplyForm.get('providerId')?.value;
      const dateFuel = this.fuelSupplyForm.get('dateFuel')?.value;
      const fuelQuantity = this.fuelSupplyForm.get('fuelQuantity')?.value;
      const gallonPrice = this.fuelSupplyForm.get('gallonPrice')?.value;
      const totalPrice = this.fuelSupplyForm.get('totalPrice')?.value;
      const observation = this.fuelSupplyForm.get('observation')?.value;



      let fuelSupply = new FuelSupply();
      fuelSupply.providerId = providerId;
      fuelSupply.dateFuel = dateFuel;
      fuelSupply.fuelQuantity = fuelQuantity;
      fuelSupply.gallonPrice = gallonPrice;
      fuelSupply.totalPrice = totalPrice;
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
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.fuelSupplyForm.controls['id'].setValue(listData[0].id);
    this.fuelSupplyForm.controls['providerId'].setValue(listData[0].providerId);
    this.fuelSupplyForm.controls['dateFuel'].setValue(fortmatFabricationDate);
    this.fuelSupplyForm.controls['fuelQuantity'].setValue(listData[0].fuelQuantity);
    this.fuelSupplyForm.controls['gallonPrice'].setValue(listData[0].gallonPrice);
    this.fuelSupplyForm.controls['totalPrice'].setValue(listData[0].totalPrice);
    this.fuelSupplyForm.controls['observation'].setValue(listData[0].observation);
  }

  listFuelSupply() {
    this.service.listFuelSupply()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.fuelSupplyDtoList;
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
