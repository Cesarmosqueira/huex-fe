import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";
import { first } from "rxjs/operators";
import { config } from "../../../../shared/shared.config";
import { SettlementSummary } from "../models/settlement-summary.model";
import { SettlementSummaryService } from "../services/settlement-summary.service";
import { Tracking } from '../../tracking/models/tracking.model';
import { ExpenseTypeService } from '../../expense-type/services/expense-type.service';

@Component({
  selector: 'app-settlement-summary',
  templateUrl: './settlement-summary.component.html',
  styleUrls: ['./settlement-summary.component.scss']
})
export class SettlementSummaryComponent implements OnInit {

  @Input() tracking: Tracking;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  settlementSummaryForm!: UntypedFormGroup;
  submitted = false;
  register = true;
  selectExpenseType: any;
  transactions;

  // Table data
  content?: any;
  settlementSummary?: any;
  test: SettlementSummary[] = [];
  settlementSummaryList!: Observable<SettlementSummary[]>;
  total: Observable<number>;
  pipe: any;

  listExpenseType: any;

  sumaTotal: number = 0;

  new = false;
  textButton = "Registrar";

  constructor(public service: SettlementSummaryService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private serviceExpense: ExpenseTypeService) {
    this.settlementSummaryList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Liquidacion de servicio', active: true }];

    this.settlementSummaryForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      expenseTypeId: ['', [Validators.required]],
      settlementDate: ['', [Validators.required]],
      detail: ['', [Validators.required]],
      totalExpense: ['', [Validators.required]],
    });

    this.settlementSummaryList.subscribe(x => {
      this.content = this.settlementSummary;
      this.settlementSummary = Object.assign([], x);
    });

    this.listExpenseTypes();
    this.listSettlementSummaryByIdTracking(this.tracking.id);
  }

  get form() {
    return this.settlementSummaryForm.controls;
  }

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

  openModal(value) {
    this.new = value;
  }

  cancel() {
    this.clearControl();
    this.submitted = false;
    this.new = false;
    this.textButton = "Registrar";
  }

  clearControl() {
    this.settlementSummaryForm.controls['id'].setValue("0");
    this.settlementSummaryForm.controls['expenseTypeId'].setValue("");
    this.settlementSummaryForm.controls['settlementDate'].setValue("");
    this.settlementSummaryForm.controls['detail'].setValue("");
    this.settlementSummaryForm.controls['totalExpense'].setValue("");
  }

  saveUser() {
    this.submitted = true
    if (this.settlementSummaryForm.valid) {
      this.pipe = new DatePipe('en-US');
      const expenseTypeId = this.settlementSummaryForm.get('expenseTypeId')?.value;
      const settlementDate = this.settlementSummaryForm.get('settlementDate')?.value;
      const fortmatSettlementDate = this.pipe.transform(settlementDate, 'yyyy-MM-dd');
      const detail = this.settlementSummaryForm.get('detail')?.value;
      const totalExpense = this.settlementSummaryForm.get('totalExpense')?.value;

      let settlementSummary = new SettlementSummary();
      let tracking = new Tracking();
      tracking.id = this.tracking.id;
      settlementSummary.trackingService = tracking;
      settlementSummary.expenseType = expenseTypeId;
      settlementSummary.settlementDate = fortmatSettlementDate;
      settlementSummary.detail = detail;
      settlementSummary.totalExpense = totalExpense;

      const id = this.settlementSummaryForm.get('id')?.value;
      if (id == '0') {
        this.registerSettlementSummary(settlementSummary);
      } else {
        settlementSummary.id = id;
        this.updateSettlementSummary(settlementSummary);
      }

      this.new = false;
      this.textButton = "Registrar";
      this.clearControl();

    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any) {
    this.new = true;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    var listData = this.settlementSummary.filter((data: { id: any; }) => data.id === id);
    const settlementDate = listData[0].settlementDate.substring(0, 10);
    const fortmatSettlementDate = this.pipe.transform(settlementDate, 'yyyy-MM-dd');
    this.settlementSummaryForm.controls['id'].setValue(listData[0].id);
    this.settlementSummaryForm.controls['settlementDate'].setValue(fortmatSettlementDate);
    this.settlementSummaryForm.controls['detail'].setValue(listData[0].detail);
    this.settlementSummaryForm.controls['totalExpense'].setValue(listData[0].totalExpense);
    this.selectExpenseType = listData[0].expenseType;
    this.textButton = "Actualizar";
  }



  listSettlementSummaryByIdTracking(id) {
    this.service.listSettlementSummaryByIdTracking(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.settlementsSummary;
              this.sumaTotal = this.test.reduce((a, b) => a + b.totalExpense, 0);
              this.service.paginationTable(this.test);
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
              this.listSettlementSummaryByIdTracking(this.tracking.id);
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
              this.listSettlementSummaryByIdTracking(this.tracking.id);
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

  listExpenseTypes() {
    this.serviceExpense.listExpenseType()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listExpenseType = response.datos.expenseTypes;
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
              this.listSettlementSummaryByIdTracking(this.tracking.id);
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
