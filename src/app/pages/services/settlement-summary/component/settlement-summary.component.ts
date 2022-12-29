import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TruckFleet} from "../../../vehicles/truck-fleet/models/truck-fleet.model";
import {Observable} from "rxjs";
import {TruckFleetService} from "../../../vehicles/truck-fleet/services/truck-fleet.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {SettlementSummary} from "../models/settlement-summary.model";
import {SettlementSummaryService} from "../services/settlement-summary.service";

@Component({
  selector: 'app-settlement-summary',
  templateUrl: './settlement-summary.component.html',
  styleUrls: ['./settlement-summary.component.scss']
})
export class SettlementSummaryComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  settlementSummaryForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  settlementSummary?: any;
  test: SettlementSummary[] = [];
  settlementSummaryList!: Observable<SettlementSummary[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: SettlementSummaryService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.settlementSummaryList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Liquidacion de servicio', active: true }];

    /**
     * Form Validation
     */
    this.settlementSummaryForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      trackingServiceId: ['', [Validators.required]],
      expenseTypeId: ['', [Validators.required]],
      settlementDate: ['', [Validators.required]],
      detail: ['', [Validators.required]],
      totalExpense: ['', [Validators.required]],
    });

    this.settlementSummaryList.subscribe(x => {
      this.content = this.settlementSummary;
      this.settlementSummary = Object.assign([], x);
    });

    this.listSettlementSummary();
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
          this.deleteSettlementSummary(id);
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
    return this.settlementSummaryForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.settlementSummaryForm.valid) {
      this.pipe = new DatePipe('en-US');
      const trackingServiceId = 7;//this.settlementSummaryForm.get('trackingServiceId')?.value;
      const expenseTypeId = this.settlementSummaryForm.get('expenseTypeId')?.value;
      const settlementDate = this.settlementSummaryForm.get('settlementDate')?.value;
      const fortmatSettlementDate = this.pipe.transform(settlementDate, 'yyyy-MM-dd');
      const detail = this.settlementSummaryForm.get('detail')?.value;
      const totalExpense = this.settlementSummaryForm.get('totalExpense')?.value;

      let settlementSummary = new SettlementSummary();
      settlementSummary.trackingServiceId = trackingServiceId;
      settlementSummary.expenseTypeId = expenseTypeId;
      settlementSummary.settlementDate = fortmatSettlementDate;
      settlementSummary.detail = detail;
      settlementSummary.totalExpense = totalExpense;

      const id = this.settlementSummaryForm.get('id')?.value;
      console.log(settlementSummary);
      console.log(id);
      if (id == '0') {
        this.registerSettlementSummary(settlementSummary);
      } else {
        settlementSummary.id = id;
        this.updateSettlementSummary(settlementSummary);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.settlementSummaryForm.reset();
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
    modelTitle.innerHTML = 'Actualizar liquidacion servicio';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.settlementSummary.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.settlementSummaryForm.controls['id'].setValue(listData[0].id);
    this.settlementSummaryForm.controls['trackingServiceId'].setValue(listData[0].trackingServiceId);
    this.settlementSummaryForm.controls['expenseTypeId'].setValue(listData[0].expenseTypeId);
    this.settlementSummaryForm.controls['settlementDate'].setValue(fortmatFabricationDate);
    this.settlementSummaryForm.controls['detail'].setValue(listData[0].detail);
    this.settlementSummaryForm.controls['totalExpense'].setValue(listData[0].totalExpense);

  }

  listSettlementSummary() {
    this.service.listSettlementSummary()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.settlementsSummary;
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

  registerSettlementSummary(settlementSummary) {
    this.service.registerSettlementSummary(settlementSummary)
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
              this.listSettlementSummary();
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

  updateSettlementSummary(settlementSummary) {
    this.service.updateSettlementSummary(settlementSummary)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listSettlementSummary();
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

  deleteSettlementSummary(id) {
    this.service.deleteSettlementSummary(id)
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
              this.listSettlementSummary();
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
