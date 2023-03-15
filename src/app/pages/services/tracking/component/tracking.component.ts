import { DatePipe } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { Tracking } from "../models/tracking.model";
import { TrackingService } from "../services/tracking.service";
import { Customer } from "../../../customers/customer/models/customer.model";
import { TruckFleet } from "../../../vehicles/truck-fleet/models/truck-fleet.model";
import { Rate } from "../../../customers/rate/models/rate.model";
import { Employee } from "../../../employees/employee/models/employee.model";
import { TruckFleetService } from "../../../vehicles/truck-fleet/services/truck-fleet.service";
import { RateService } from "../../../customers/rate/services/rate.service";
import { EmployeeService } from "../../../employees/employee/services/employee.service";
import * as XLSX from 'xlsx';
import { TrackingExcel } from '../models/tracking-excel.model';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  idTrackingOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  trackingForm!: UntypedFormGroup;
  submitted = false;
  register = true;
  textButton = "Registrar";

  transactions;

  // Table data
  content?: any;
  trackings?: any;
  test: Tracking[] = [];
  tracking: Tracking;
  trackingsList!: Observable<Tracking[]>;
  total: Observable<number>;
  pipe: any;

  truckFleets: TruckFleet[] = [];
  selectTruckFleet = null;

  rates: Rate[] = [];
  selectRates = null;

  employees: Employee[] = [];
  tipoServicio: string[] = ['Local', 'Provincia'];
  estado: string[] = ['En cochera', 'En ruta','Esperando descarga', 'Retornando', 'Cargando', 'Descargando', 'Finalizo'];
  invoiced: string[] = ['Facturado', 'Pendiente'];
  charge: string[] = ['Cobrado', 'Pendiente'];
  documentaryStatus: string[] = ['Pendiente', 'Recepcionado','Enviado'];
  volumen:string[]=['60','70','80','90','100','110','120'];
  weightLoad:string[]=['10','15','20','25','30','35'];

  selectDriver = null;

  selectCopilot = null;

  selectStevedore = null;

  fileToUpload: any;
  imageUrl: any;
  fileList: FileList;
  myImageBaseUrl: string = '../../../../../assets/images/huex/profile.jpg';

  image: any;
  file: File = null;

  action = 0;

  newTruck = false;

  trackingOutput: Tracking;

  trackingExcel: TrackingExcel[] = [];

  fileName= 'TrackingService.xlsx';

  constructor(public service: TrackingService,
    private modalService: NgbModal,
    private serviceTruckFlett: TruckFleetService,
    private servicesRate: RateService,
    private serviceEmployee: EmployeeService,
    private formBuilder: UntypedFormBuilder) {
    this.trackingsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Tracking', active: true }];

    /**
     * Form Validation
     */
    this.trackingForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      dateService: [''],
      truckFleet: [0, [Validators.required]],
      destinationDetail: [''],
      numberPoints: [''],
      serviceType: [''],
      additionalCost: [''],
      observations: [''],
      guideNumber: [''],
      datePrecharge: [''],
      preloadStatus: [''],
      scheduledAppointment: [''],
      rate: [0, [Validators.required]],
      driver: [0, [Validators.required]],
      copilot: [0],
      stevedore: [0],
      dateTimeCompletion: [''],
      moneyDelivered: [0],
      detailMoney: [''],
      operation: [''],
      invoiced: [''],
      charge: [''],
      photoInsurance: [''],
      documentaryStatus: ['']

    });

    this.trackingsList.subscribe(x => {
      this.content = this.trackings;
      this.trackings = Object.assign([], x);
    });

    this.idTrackingOuput = 0;

    this.listTrackings();
    this.listRates();
    this.listEmployees();
    this.listTruckFleet();
  }

  getImage(event) {
    if (event.target.files && event.target.files.length) {
      const file = (event.target.files[0] as File);
      this.trackingForm.get('photoInsurance').setValue(file);
      this.fileList = event.target.files;
      this.fileToUpload = event.target.files.item(0);
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
  }

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
          this.deleteTracking(id);
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


  openModal(content: any) {
    this.clear();
    this.action = 1;
    this.newTruck = false;
    this.submitted = false;
    this.textButton = "Registrar";
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    };
    this.modalService.open(content, ngbModalOptions);
  }


  get form() {
    return this.trackingForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true;
    if (this.trackingForm.valid) {
      this.pipe = new DatePipe('en-US');
      const dateService = this.trackingForm.get('dateService')?.value;
      const fortmatDateService = this.pipe.transform(dateService, 'yyyy-MM-dd');
      const idTruckFleet = this.trackingForm.get('truckFleet')?.value;
      const destinationDetail = this.trackingForm.get('destinationDetail')?.value;
      const numberPoints = this.trackingForm.get('numberPoints')?.value;
      const serviceType = this.trackingForm.get('serviceType')?.value;
      const additionalCost = this.trackingForm.get('additionalCost')?.value;
      const observations = this.trackingForm.get('observations')?.value;
      const guideNumber = this.trackingForm.get('guideNumber')?.value;
      const datePrecharge = this.trackingForm.get('datePrecharge')?.value;
      const fortmatDatePrecharge = this.pipe.transform(datePrecharge, 'yyyy-MM-ddTHH:mm:ss');
      const preloadStatus = this.trackingForm.get('preloadStatus')?.value;
      const scheduledAppointment = this.trackingForm.get('scheduledAppointment')?.value;
      const fortmatScheduledAppointment = this.pipe.transform(scheduledAppointment, 'yyyy-MM-ddTHH:mm:ss');
      const idRates = this.trackingForm.get('rate')?.value;
      const idDriver = this.trackingForm.get('driver')?.value;
      const idCopilot = this.trackingForm.get('copilot')?.value;
      const idStevedore = this.trackingForm.get('stevedore')?.value;
      const dateTimeCompletion = this.trackingForm.get('dateTimeCompletion')?.value;
      const fortmatDateTimeCompletion = this.pipe.transform(dateTimeCompletion, 'yyyy-MM-ddTHH:mm:ss');
      const moneyDelivered = this.trackingForm.get('moneyDelivered')?.value;
      const detailMoney = this.trackingForm.get('detailMoney')?.value;
      const operation = this.trackingForm.get('operation')?.value;
      const invoiced = this.trackingForm.get('invoiced')?.value;
      const charge = this.trackingForm.get('charge')?.value;
      const documentaryStatus = this.trackingForm.get('documentaryStatus')?.value;


      //const condition = this.trackingForm.get('condition')?.value;

      let tracking = new Tracking();
      tracking.dateService = fortmatDateService;
      tracking.truckFleet = idTruckFleet;
      tracking.destinationDetail = destinationDetail;
      tracking.numberPoints = numberPoints;
      tracking.serviceType = serviceType;
      tracking.additionalCost = additionalCost;
      tracking.observations = observations;
      tracking.guideNumber = guideNumber;
      tracking.datePrecharge = fortmatDatePrecharge;
      tracking.preloadStatus = preloadStatus;
      tracking.scheduledAppointment = fortmatScheduledAppointment;
      tracking.rate = idRates;
      tracking.driver = idDriver;
      tracking.copilot = idCopilot;
      tracking.stevedore = idStevedore;
      tracking.dateTimeCompletion = fortmatDateTimeCompletion;
      tracking.moneyDelivered = moneyDelivered;
      tracking.detailMoney = detailMoney;
      tracking.operation = operation;
      tracking.charge = charge;
      tracking.invoiced = invoiced;
      tracking.documentaryStatus = documentaryStatus;


      //tracking.condition = condition;
      if (this.imageUrl != null || this.imageUrl != undefined) {
        tracking.photoInsurance = this.imageUrl.replace("data:image/jpeg;base64,", "");
      }


      const id = this.trackingForm.get('id')?.value;
      if (id == '0') {
        this.registerTracking(tracking);
      } else {
        tracking.id = id;
        this.updateTracking(tracking);
      }

      this.imageUrl = null;

    }
  }

  getDocument(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }



  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(tracking: any, content: any, action: any) {
    this.imageUrl = null;
    this.submitted = false;
    this.action = 2;
    this.newTruck = true;
    this.pipe = new DatePipe('en-US');
    this.textButton = "Actualizar";
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    };
    this.modalService.open(content, ngbModalOptions);
    if (action) {
      this.disableInputs();
    } else {
      this.enableInputs();
    }

    this.trackingForm.controls['id'].setValue(tracking.id);
    if (tracking.dateService != null || tracking.dateService != undefined) {
      const dateService = tracking.dateService.substring(0, 10);
      const fortmatDateService = this.pipe.transform(dateService, 'yyyy-MM-dd');
      this.trackingForm.controls['dateService'].setValue(fortmatDateService);
    }

    this.selectTruckFleet = tracking.truckFleet;
    //this.trackingForm.controls['truckFleet'].setValue(tracking.truckFleet.tractPlate);
    this.trackingForm.controls['destinationDetail'].setValue(tracking.destinationDetail);
    this.trackingForm.controls['numberPoints'].setValue(tracking.numberPoints);
    this.trackingForm.controls['serviceType'].setValue(tracking.serviceType);
    this.trackingForm.controls['additionalCost'].setValue(tracking.additionalCost);
    this.trackingForm.controls['observations'].setValue(tracking.observations);
    this.trackingForm.controls['guideNumber'].setValue(tracking.guideNumber);
    if (tracking.datePrecharge != null || tracking.datePrecharge != undefined) {
      const datePrecharge = tracking.datePrecharge.substring(0, 10);
      const fortmatDatePrecharge = this.pipe.transform(tracking.datePrecharge, 'yyyy-MM-ddTHH:mm:ss');
      this.trackingForm.controls['datePrecharge'].setValue(fortmatDatePrecharge);
    }

    this.trackingForm.controls['preloadStatus'].setValue(tracking.preloadStatus);
    if (tracking.scheduledAppointment != null || tracking.scheduledAppointment != undefined) {
      const scheduledAppointment = tracking.scheduledAppointment.substring(0, 10);
      const fortmatScheduledAppointment = this.pipe.transform(tracking.scheduledAppointment, 'yyyy-MM-ddTHH:mm:ss');
      this.trackingForm.controls['scheduledAppointment'].setValue(fortmatScheduledAppointment);
    }

    let rate = this.rates.filter((data: { id: any; }) => data.id === tracking.rate.id);
    this.selectRates = rate[0];

    this.selectDriver = tracking.driver;
    this.selectCopilot = tracking.copilot;
    this.selectStevedore = tracking.stevedore;

    if (tracking.dateTimeCompletion != null || tracking.dateTimeCompletion != undefined) {
      const dateTimeCompletion = tracking.dateTimeCompletion.substring(0, 10);
      const fortmatDateTimeCompletion = this.pipe.transform(tracking.dateTimeCompletion, 'yyyy-MM-ddTHH:mm:ss');
      this.trackingForm.controls['dateTimeCompletion'].setValue(fortmatDateTimeCompletion);
    }

    this.trackingForm.controls['moneyDelivered'].setValue(tracking.moneyDelivered);
    this.trackingForm.controls['detailMoney'].setValue(tracking.detailMoney);
    this.trackingForm.controls['operation'].setValue(tracking.operation);
    this.trackingForm.controls['invoiced'].setValue(tracking.invoiced);
    this.trackingForm.controls['charge'].setValue(tracking.charge);
    this.trackingForm.controls['documentaryStatus'].setValue(tracking.documentaryStatus);

    if (tracking.photoInsurance != null || tracking.photoInsurance != undefined) {
      this.imageUrl = 'data:image/jpeg;base64,' + tracking.photoInsurance;
      this.trackingForm.get('photoInsurance').setValue(this.dataURLtoFile(this.imageUrl, 'foto.jpeg'));
    }
    this.idTrackingOuput = tracking.id;
    this.trackingOutput = tracking;
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  listTrackings() {
    console.log("entroooooooo");
    this.service.listTrackings()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.trackingsService;
              this.trackingExcel = response.datos.trackingsService;
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

  registerTracking(trackings) {
    this.service.registerTracking(trackings)
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
              const trackingsDto = response.datos.trackingService;
              this.idTrackingOuput = trackingsDto.id;
              this.trackingOutput = trackingsDto;
              this.action = 0;
              this.newTruck = true;
              this.listTrackings();
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

  updateTracking(trackings) {
    this.service.updateTracking(trackings)
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
              this.listTrackings();
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
    this.trackingForm.controls['id'].setValue("0");
    this.trackingForm.controls['dateService'].setValue("");
    this.trackingForm.controls['truckFleet'].setValue("");
    this.trackingForm.controls['destinationDetail'].setValue("");
    this.trackingForm.controls['numberPoints'].setValue("");
    this.trackingForm.controls['serviceType'].setValue("");
    this.trackingForm.controls['additionalCost'].setValue("");
    this.trackingForm.controls['observations'].setValue("");
    this.trackingForm.controls['guideNumber'].setValue("");
    this.trackingForm.controls['datePrecharge'].setValue("");
    this.trackingForm.controls['preloadStatus'].setValue("");
    this.trackingForm.controls['scheduledAppointment'].setValue("");
    this.trackingForm.controls['rate'].setValue("");
    this.trackingForm.controls['driver'].setValue("");
    this.trackingForm.controls['copilot'].setValue("");
    this.trackingForm.controls['stevedore'].setValue("");
    this.trackingForm.controls['dateTimeCompletion'].setValue("");
    this.trackingForm.controls['moneyDelivered'].setValue("");
    this.trackingForm.controls['detailMoney'].setValue("");
    this.trackingForm.controls['operation'].setValue("");
    this.trackingForm.controls['invoiced'].setValue("");
    this.trackingForm.controls['charge'].setValue("");
    this.trackingForm.controls['documentaryStatus'].setValue("");
    this.selectRates = null;
    this.selectDriver = null;
    this.selectCopilot = null;
    this.selectStevedore = null;
    this.selectTruckFleet = null;
    this.trackingForm.controls['photoInsurance'].setValue("");
    this.imageUrl = null;
  }

  disableInputs() {
    this.trackingForm.controls['id'].disable();
    this.trackingForm.controls['dateService'].disable();
    this.trackingForm.controls['truckFleet'].disable();
    this.trackingForm.controls['destinationDetail'].disable();
    this.trackingForm.controls['numberPoints'].disable();
    this.trackingForm.controls['serviceType'].disable();
    this.trackingForm.controls['additionalCost'].disable();
    this.trackingForm.controls['observations'].disable();
    this.trackingForm.controls['guideNumber'].disable();
    this.trackingForm.controls['datePrecharge'].disable();
    this.trackingForm.controls['preloadStatus'].disable();
    this.trackingForm.controls['scheduledAppointment'].disable();
    this.trackingForm.controls['rate'].disable();
    this.trackingForm.controls['driver'].disable();
    this.trackingForm.controls['driver'].disable();
    this.trackingForm.controls['stevedore'].disable();
    this.trackingForm.controls['dateTimeCompletion'].disable();
    this.trackingForm.controls['moneyDelivered'].disable();
    this.trackingForm.controls['detailMoney'].disable();
    this.trackingForm.controls['operation'].disable();
    this.trackingForm.controls['invoiced'].disable();
    this.trackingForm.controls['charge'].disable();
    this.trackingForm.controls['documentaryStatus'].disable();

    //this.trackingForm.controls['condition'].disable();
    this.trackingForm.controls['photoInsurance'].disable();
  }

  enableInputs() {
    this.trackingForm.controls['id'].setValue("0");
    this.trackingForm.controls['dateService'].enable();
    this.trackingForm.controls['truckFleet'].enable();
    this.trackingForm.controls['destinationDetail'].enable();
    this.trackingForm.controls['numberPoints'].enable();
    this.trackingForm.controls['serviceType'].enable();
    this.trackingForm.controls['additionalCost'].enable();
    this.trackingForm.controls['observations'].enable();
    this.trackingForm.controls['guideNumber'].enable();
    this.trackingForm.controls['datePrecharge'].enable();
    this.trackingForm.controls['preloadStatus'].enable();
    this.trackingForm.controls['scheduledAppointment'].enable();
    this.trackingForm.controls['rate'].enable();
    this.trackingForm.controls['driver'].enable();
    this.trackingForm.controls['copilot'].enable();
    this.trackingForm.controls['stevedore'].enable();
    this.trackingForm.controls['dateTimeCompletion'].enable();
    this.trackingForm.controls['moneyDelivered'].enable();
    this.trackingForm.controls['detailMoney'].enable();
    this.trackingForm.controls['operation'].enable();
    this.trackingForm.controls['invoiced'].enable();
    this.trackingForm.controls['charge'].enable();
    this.trackingForm.controls['documentaryStatus'].enable();

    //this.trackingForm.controls['condition'].enable();
    this.trackingForm.controls['photoInsurance'].enable();
  }

  deleteTracking(id) {
    this.service.deleteTracking(id)
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
              this.listTrackings();
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

  listTruckFleet() {
    this.serviceTruckFlett.listTruckFleets()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.truckFleets = response.datos.truckFleets;
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

  listRates() {
    this.servicesRate.listRates()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.rates = response.datos.rates;
              this.rates.forEach(element => {
                let cus = new Customer();
                cus = element.customer;
                cus.name = element.customer.socialReason + "/" + element.routeDetail+"/M3 "
                  + element.volume+"/TN "+ element.tonNumber;

                element.customer = cus;

              });
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

  listEmployees() {
    this.serviceEmployee.listEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.employees = response.datos.employees;
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

  retrieveTracking(id: any, content: any, action: any) {
    this.service.retrieveTracking(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.tracking = response.datos.trackingService;
              console.log(this.tracking);
              this.editDataGet(this.tracking, content, action);
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

  viewDocument(id) {
    var documentResponse = this.test.filter(c => c.id === id)[0];
    const linkSource = 'data:image/jpeg;base64,' + documentResponse.photoInsurance;
    this.service.downloadImage(linkSource).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  saveByteArray(id: any) {
    var documentResponse = this.test.filter(c => c.id === id)[0];
    const linkSource = 'data:image/jpeg;base64,' + documentResponse.photoInsurance;
    const downloadLink = document.createElement("a");
    const fileName = "Seguro";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  exportexcel(): void {
    /* pass here the table id */
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.trackingExcel);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

}
