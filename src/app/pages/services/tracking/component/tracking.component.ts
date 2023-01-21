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

  transactions;

  // Table data
  content?: any;
  trackings?: any;
  test: Tracking[] = [];
  trackingsList!: Observable<Tracking[]>;
  total: Observable<number>;
  pipe: any;
  fileToUpload: any;
  imageUrl: any;
  fileList: FileList;
  myImageBaseUrl:string='../../../../../assets/images/huex/profile.jpg';

  constructor(public service: TrackingService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder) {
    this.trackingsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Trabajadores', active: true }];

    /**
     * Form Validation
     */
    this.trackingForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      dateService: ['', [Validators.required]],
      idTruckFleet: [0, [Validators.required]],
      volume: [0, [Validators.required]],
      requestedVolume: [0, [Validators.required]],
      bill: ['', [Validators.required]],
      destinationDetail: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      numberPoints: ['', [Validators.required]],
      serviceType: ['', [Validators.required]],
      additionalCost: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      guideNumber: ['', [Validators.required]],
      datePrecharge: ['', [Validators.required]],
      preloadStatus: ['', [Validators.required]],
      scheduledAppointment: ['', [Validators.required]],
      idRates: [0, [Validators.required]],
      idDriver: [0, [Validators.required]],
      idCopilot: [0, [Validators.required]],
      idStevedore: [0, [Validators.required]],
      dateTimeCompletion: ['', [Validators.required]],
      weightLoad: [0, [Validators.required]],
      moneyDelivered: [0, [Validators.required]],
      detailMoney: ['', [Validators.required]],
      operation: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      monitoring: ['', [Validators.required]],
      photoInsurance: [0, [Validators.required]]
    });

    this.trackingsList.subscribe(x => {
      this.content = this.trackings;
      this.trackings = Object.assign([], x);
    });

    this.idTrackingOuput = 0;
    console.log(this.idTrackingOuput);

    this.listTrackings();
  }

  getImage(event) {
    if (event.target.files && event.target.files.length) {
      const file = (event.target.files[0] as File);
      console.log(file);
      this.trackingForm.get('photoInsurance').setValue(file);
      this.fileList = event.target.files;
      this.fileToUpload = event.target.files.item(0);
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        console.log(this.imageUrl);
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
    this.submitted = false;
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
      const idTruckFleet = this.trackingForm.get('idTruckFleet')?.value;
      const volume = this.trackingForm.get('volume')?.value;
      const requestedVolume = this.trackingForm.get('requestedVolume')?.value;
      const bill = this.trackingForm.get('bill')?.value;
      const destinationDetail = this.trackingForm.get('destinationDetail')?.value;
      const zone = this.trackingForm.get('zone')?.value;
      const numberPoints = this.trackingForm.get('numberPoints')?.value;
      const serviceType = this.trackingForm.get('serviceType')?.value;
      const additionalCost = this.trackingForm.get('additionalCost')?.value;
      const observations = this.trackingForm.get('observations')?.value;
      const guideNumber = this.trackingForm.get('guideNumber')?.value;
      const datePrecharge = this.trackingForm.get('datePrecharge')?.value;
      const fortmatDatePrecharge = this.pipe.transform(datePrecharge, 'yyyy-MM-dd');
      const preloadStatus = this.trackingForm.get('preloadStatus')?.value;
      const scheduledAppointment = this.trackingForm.get('scheduledAppointment')?.value;
      const fortmatScheduledAppointment = this.pipe.transform(scheduledAppointment, 'yyyy-MM-dd');
      const idRates = this.trackingForm.get('preloadStatus')?.value;
      const idDriver = this.trackingForm.get('preloadStatus')?.value;
      const idCopilot = this.trackingForm.get('preloadStatus')?.value;
      const idStevedore = this.trackingForm.get('preloadStatus')?.value;
      const dateTimeCompletion = this.trackingForm.get('dateTimeCompletion')?.value;
      const fortmatDateTimeCompletion = this.pipe.transform(dateTimeCompletion, 'yyyy-MM-dd');
      const weightLoad = this.trackingForm.get('weightLoad')?.value;
      const moneyDelivered = this.trackingForm.get('moneyDelivered')?.value;
      const detailMoney = this.trackingForm.get('detailMoney')?.value;
      const operation = this.trackingForm.get('operation')?.value;
      const condition = this.trackingForm.get('condition')?.value;
      const monitoring = this.trackingForm.get('monitoring')?.value;
      const photoInsurance = this.trackingForm.get('photoInsurance')?.value;
      const photoUrl = this.imageUrl.replace("data:image/jpeg;base64,", "");

      let tracking = new Tracking();
      tracking.dateService = fortmatDateService;
      tracking.idTruckFleet = idTruckFleet;
      tracking.volume = volume;
      tracking.requestedVolume = requestedVolume;
      tracking.bill = bill;
      tracking.destinationDetail = destinationDetail;
      tracking.zone = zone;
      tracking.numberPoints = numberPoints;
      tracking.serviceType = serviceType;
      tracking.additionalCost = additionalCost;
      tracking.observations = observations;
      tracking.guideNumber = guideNumber;
      tracking.datePrecharge = fortmatDatePrecharge;
      tracking.preloadStatus = preloadStatus;
      tracking.scheduledAppointment = fortmatScheduledAppointment;
      tracking.idRates = idRates;
      tracking.idDriver = idDriver;
      tracking.idCopilot = idCopilot;
      tracking.idStevedore = idStevedore;
      tracking.dateTimeCompletion = fortmatDateTimeCompletion;
      tracking.weightLoad = weightLoad;
      tracking.moneyDelivered = moneyDelivered;
      tracking.detailMoney = detailMoney;
      tracking.operation = operation;
      tracking.condition = condition;
      tracking.monitoring = monitoring;
      tracking.photoInsurance = photoInsurance;

      const id = this.trackingForm.get('id')?.value;

      if (id == '0') {
        this.registerTracking(tracking);
      } else {
        tracking.id = id;
        this.updateTracking(tracking);
      }

      this.imageUrl = null;

      this.modalService.dismissAll();
      setTimeout(() => {
        this.trackingForm.reset();
      }, 2000);

    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any, action: any) {
    this.imageUrl = null;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    this.modalService.open(content, { size: 'xl', centered: true });
    if(action){
      var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
      modelTitle.innerHTML = 'Detalle Empleados';
      this.disableInputs();
      document.getElementById('add-btn').setAttribute("disabled","disabled");
    } else {
      this.enableInputs();
      document.getElementById('add-btn').removeAttribute("disabled");
      var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
      modelTitle.innerHTML = 'Actualizar Empleados';
      var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
      updateBtn.innerHTML = "Actualizar";
    }
    var listData = this.trackings.filter((data: { id: any; }) => data.id === id);
    const dateService = listData[0].birthDate.substring(0, 10);
    const fortmatDateService = this.pipe.transform(dateService, 'yyyy-MM-dd');
    this.trackingForm.controls['dateService'].setValue(fortmatDateService);
    this.trackingForm.controls['idTruckFleet'].setValue(listData[0].idTruckFleet);
    this.trackingForm.controls['volume'].setValue(listData[0].volume);
    this.trackingForm.controls['requestedVolume'].setValue(listData[0].requestedVolume);
    this.trackingForm.controls['bill'].setValue(listData[0].bill);
    this.trackingForm.controls['destinationDetail'].setValue(listData[0].destinationDetail);
    this.trackingForm.controls['zone'].setValue(listData[0].zone);
    this.trackingForm.controls['numberPoints'].setValue(listData[0].numberPoints);
    this.trackingForm.controls['serviceType'].setValue(listData[0].serviceType);
    this.trackingForm.controls['additionalCost'].setValue(listData[0].additionalCost);
    this.trackingForm.controls['observations'].setValue(listData[0].observations);
    this.trackingForm.controls['guideNumber'].setValue(listData[0].guideNumber);
    const datePrecharge = listData[0].birthDate.substring(0, 10);
    const fortmatDatePrecharge = this.pipe.transform(datePrecharge, 'yyyy-MM-dd');
    this.trackingForm.controls['datePrecharge'].setValue(fortmatDatePrecharge);
    this.trackingForm.controls['preloadStatus'].setValue(listData[0].preloadStatus);
    const scheduledAppointment = listData[0].birthDate.substring(0, 10);
    const fortmatScheduledAppointment = this.pipe.transform(scheduledAppointment, 'yyyy-MM-dd');
    this.trackingForm.controls['scheduledAppointment'].setValue(fortmatScheduledAppointment);
    this.trackingForm.controls['idRates'].setValue(listData[0].idRates);
    this.trackingForm.controls['idDriver'].setValue(listData[0].idDriver);
    this.trackingForm.controls['idCopilot'].setValue(listData[0].idCopilot);
    this.trackingForm.controls['idStevedore'].setValue(listData[0].idStevedore);
    const dateTimeCompletion = listData[0].birthDate.substring(0, 10);
    const fortmatDateTimeCompletion = this.pipe.transform(dateTimeCompletion, 'yyyy-MM-dd');
    this.trackingForm.controls['dateTimeCompletion'].setValue(fortmatDateTimeCompletion);
    this.trackingForm.controls['weightLoad'].setValue(listData[0].weightLoad);
    this.trackingForm.controls['moneyDelivered'].setValue(listData[0].moneyDelivered);
    this.trackingForm.controls['detailMoney'].setValue(listData[0].detailMoney);
    this.trackingForm.controls['operation'].setValue(listData[0].operation);
    this.trackingForm.controls['condition'].setValue(listData[0].condition);
    this.trackingForm.controls['monitoring'].setValue(listData[0].monitoring);
    this.trackingForm.controls['photoInsurance'].setValue(listData[0].photoInsurance);
    this.idTrackingOuput = id;
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
    this.service.listTrackings()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.trackings;
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
            console.log(response);
            if (response.datos) {
              Swal.fire(
                '¡Registrado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              const trackingsDto = response.datos.tracking;
              this.idTrackingOuput = trackingsDto.id;
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
    this.trackingForm.controls['idTruckFleet'].setValue("");
    this.trackingForm.controls['volume'].setValue("");
    this.trackingForm.controls['requestedVolume'].setValue("");
    this.trackingForm.controls['bill'].setValue("");
    this.trackingForm.controls['destinationDetail'].setValue("");
    this.trackingForm.controls['zone'].setValue("");
    this.trackingForm.controls['numberPoints'].setValue("");
    this.trackingForm.controls['serviceType'].setValue("");
    this.trackingForm.controls['additionalCost'].setValue("");
    this.trackingForm.controls['observations'].setValue("");
    this.trackingForm.controls['guideNumber'].setValue("");
    this.trackingForm.controls['datePrecharge'].setValue("");
    this.trackingForm.controls['preloadStatus'].setValue("");
    this.trackingForm.controls['scheduledAppointment'].setValue("");
    this.trackingForm.controls['idRates'].setValue("");
    this.trackingForm.controls['idDriver'].setValue("");
    this.trackingForm.controls['idCopilot'].setValue("");
    this.trackingForm.controls['idStevedore'].setValue("");
    this.trackingForm.controls['dateTimeCompletion'].setValue("");
    this.trackingForm.controls['weightLoad'].setValue("");
    this.trackingForm.controls['moneyDelivered'].setValue("");
    this.trackingForm.controls['detailMoney'].setValue("");
    this.trackingForm.controls['operation'].setValue("");
    this.trackingForm.controls['condition'].setValue("");
    this.trackingForm.controls['monitoring'].setValue("");
    this.trackingForm.controls['photoInsurance'].setValue("");
    this.imageUrl = null;
  }

  disableInputs() {
    this.trackingForm.controls['id'].disable();
    this.trackingForm.controls['dateService'].disable();
    this.trackingForm.controls['idTruckFleet'].disable();
    this.trackingForm.controls['volume'].disable();
    this.trackingForm.controls['requestedVolume'].disable();
    this.trackingForm.controls['bill'].disable();
    this.trackingForm.controls['destinationDetail'].disable();
    this.trackingForm.controls['zone'].disable();
    this.trackingForm.controls['numberPoints'].disable();
    this.trackingForm.controls['serviceType'].disable();
    this.trackingForm.controls['additionalCost'].disable();
    this.trackingForm.controls['observations'].disable();
    this.trackingForm.controls['guideNumber'].disable();
    this.trackingForm.controls['datePrecharge'].disable();
    this.trackingForm.controls['preloadStatus'].disable();
    this.trackingForm.controls['scheduledAppointment'].disable();
    this.trackingForm.controls['idRates'].disable();
    this.trackingForm.controls['idDriver'].disable();
    this.trackingForm.controls['idCopilot'].disable();
    this.trackingForm.controls['idStevedore'].disable();
    this.trackingForm.controls['dateTimeCompletion'].disable();
    this.trackingForm.controls['weightLoad'].disable();
    this.trackingForm.controls['moneyDelivered'].disable();
    this.trackingForm.controls['detailMoney'].disable();
    this.trackingForm.controls['operation'].disable();
    this.trackingForm.controls['condition'].disable();
    this.trackingForm.controls['monitoring'].disable();
    this.trackingForm.controls['photoInsurance'].disable();
  }

  enableInputs() {
    this.trackingForm.controls['id'].setValue("0");
    this.trackingForm.controls['dateService'].enable();
    this.trackingForm.controls['idTruckFleet'].enable();
    this.trackingForm.controls['volume'].enable();
    this.trackingForm.controls['requestedVolume'].enable();
    this.trackingForm.controls['bill'].enable();
    this.trackingForm.controls['destinationDetail'].enable();
    this.trackingForm.controls['zone'].enable();
    this.trackingForm.controls['numberPoints'].enable();
    this.trackingForm.controls['serviceType'].enable();
    this.trackingForm.controls['additionalCost'].enable();
    this.trackingForm.controls['observations'].enable();
    this.trackingForm.controls['guideNumber'].enable();
    this.trackingForm.controls['datePrecharge'].enable();
    this.trackingForm.controls['preloadStatus'].enable();
    this.trackingForm.controls['scheduledAppointment'].enable();
    this.trackingForm.controls['idRates'].enable();
    this.trackingForm.controls['idDriver'].enable();
    this.trackingForm.controls['idCopilot'].enable();
    this.trackingForm.controls['idStevedore'].enable();
    this.trackingForm.controls['dateTimeCompletion'].enable();
    this.trackingForm.controls['weightLoad'].enable();
    this.trackingForm.controls['moneyDelivered'].enable();
    this.trackingForm.controls['detailMoney'].enable();
    this.trackingForm.controls['operation'].enable();
    this.trackingForm.controls['condition'].enable();
    this.trackingForm.controls['monitoring'].enable();
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

}
