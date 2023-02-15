import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";
import { first } from "rxjs/operators";
import { config } from "../../../../shared/shared.config";
import { ServiceMonitoring } from "../models/service-monitoring.model";
import { ServiceMonitoringService } from "../services/service-monitoring.service";
import { Tracking } from '../../tracking/models/tracking.model';

@Component({
  selector: 'app-service-monitoring',
  templateUrl: './service-monitoring.component.html',
  styleUrls: ['./service-monitoring.component.scss']
})
export class ServiceMonitoringComponent implements OnInit {

  @Input() idTracking: number;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  serviceMonitoringForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  serviceMonitoring?: any;
  test: ServiceMonitoring[] = [];
  serviceMonitoringList!: Observable<ServiceMonitoring[]>;
  total: Observable<number>;
  pipe: any;

  imageUrl: any;
  fileList: FileList;
  myImageBaseUrl: string = '';
  fileToUpload: any;

  new = false;
  textButton = "Registrar";

  constructor(public service: ServiceMonitoringService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder) {
    this.serviceMonitoringList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Monitoreo servicios', active: true }];


    this.serviceMonitoringForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      dateHour: ['', [Validators.required]],
      status: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      photoMonitoring: ['', [Validators.required]],
    });

    this.serviceMonitoringList.subscribe(x => {
      this.content = this.serviceMonitoring;
      this.serviceMonitoring = Object.assign([], x);
    });

    this.listServiceMonitoringByIdTracking(this.idTracking)
  }


  openViewModal(content: any) {
    this.modalService.open(content, { centered: true });
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
          this.deleteServiceMonitoring(id);
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
    this.serviceMonitoringForm.controls['id'].setValue("0");
    this.serviceMonitoringForm.controls['dateHour'].setValue("");
    this.serviceMonitoringForm.controls['status'].setValue("");
    this.serviceMonitoringForm.controls['observation'].setValue("");
    this.serviceMonitoringForm.controls['photoMonitoring'].setValue("");
  }

  get form() {
    return this.serviceMonitoringForm.controls;
  }


  saveUser() {
    this.submitted = true
    if (this.serviceMonitoringForm.valid) {
      this.pipe = new DatePipe('en-US');
      const dateHour = this.serviceMonitoringForm.get('dateHour')?.value;
      const status = this.serviceMonitoringForm.get('status')?.value;
      const observation = this.serviceMonitoringForm.get('observation')?.value;
      const photoMonitoring = this.imageUrl.replace("data:image/jpeg;base64,", "");

      let tracking = new Tracking();
      tracking.id = this.idTracking;

      let serviceMonitoring = new ServiceMonitoring();
      serviceMonitoring.trackingService = tracking;
      serviceMonitoring.dateHour = dateHour;
      serviceMonitoring.status = status;
      serviceMonitoring.observation = observation;
      serviceMonitoring.photoMonitoring = photoMonitoring;

      const id = this.serviceMonitoringForm.get('id')?.value;
      if (id == '0') {
        this.registerServiceMonitoring(serviceMonitoring);
      } else {
        serviceMonitoring.id = id;
        this.updateServiceMonitoring(serviceMonitoring);
      }

      this.new = false;
      this.textButton = "Registrar";
      this.clearControl();

    }
  }

  getImage(event) {
    if (event.target.files && event.target.files.length) {
      const file = (event.target.files[0] as File);
      this.serviceMonitoringForm.get('photoMonitoring').setValue(file);
      this.fileList = event.target.files;
      this.fileToUpload = event.target.files.item(0);
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
  }

  viewDocument(id) {
    var documentResponse = this.test.filter(c => c.id === id)[0];
    const linkSource = 'data:image/jpeg;base64,' + documentResponse.photoMonitoring;
    this.service.downloadImage(linkSource).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  saveByteArray(id: any) {
    var documentResponse = this.test.filter(c => c.id === id)[0];
    const linkSource = 'data:image/jpeg;base64,' + documentResponse.photoMonitoring;
    const downloadLink = document.createElement("a");
    const fileName = "GPS";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  editDataGet(id: any) {
    this.new = true;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    var listData = this.serviceMonitoring.filter((data: { id: any; }) => data.id === id);
    const dateHour = listData[0].dateHour.substring(0, 10);
    const fortmatdateHour = this.pipe.transform(dateHour, 'yyyy-MM-dd');
    this.serviceMonitoringForm.controls['id'].setValue(listData[0].id);
    this.serviceMonitoringForm.controls['dateHour'].setValue(fortmatdateHour);
    this.serviceMonitoringForm.controls['status'].setValue(listData[0].status);
    this.serviceMonitoringForm.controls['observation'].setValue(listData[0].observation);
    this.imageUrl = 'data:image/jpeg;base64,' + listData[0].photoMonitoring;
    this.serviceMonitoringForm.get('photoMonitoring').setValue(this.dataURLtoFile(this.imageUrl, 'foto.jpeg'));
    this.textButton = "Actualizar";
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

  listServiceMonitoring() {
    this.service.listServiceMonitoring()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.serviceMonitoring;
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

  listServiceMonitoringByIdTracking(id) {
    this.service.listServiceMonitoringByIdTracking(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.serviceMonitoring;
              this.service.paginationTable(this.test);
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

  registerServiceMonitoring(serviceMonitoring) {
    this.service.registerServiceMonitoring(serviceMonitoring)
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
              this.listServiceMonitoringByIdTracking(this.idTracking);
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

  updateServiceMonitoring(serviceMonitoring) {
    this.service.updateServiceMonitoring(serviceMonitoring)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listServiceMonitoringByIdTracking(this.idTracking);
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

  deleteServiceMonitoring(id) {
    this.service.deleteServiceMonitoring(id)
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
              this.listServiceMonitoringByIdTracking(this.idTracking);
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
