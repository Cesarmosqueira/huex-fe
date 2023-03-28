import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ProviderService } from 'src/app/pages/providers/provider/services/provider.service';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { TruckFleet } from '../../truck-fleet/models/truck-fleet.model';
import { CheckList } from '../models/check-list.model';
import { CheckListService } from '../services/check-list.service';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {
  @Input () idTruckFleet: number;
  
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  checkListForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  checkLists?: any;
  checkListsResponse: CheckList[] = [];
  checkListsList!: Observable<CheckList[]>;
  total: Observable<number>;
  pipe: any;
  selectProvider = null;

  image: any;
  file: File = null;
  new = false;
  textButton = "Registrar";

  constructor(public service: CheckListService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private serviceProvider: ProviderService) {
    this.checkListsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.checkListForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      documentDate: ['', [Validators.required]],
      document: ['', [Validators.required]]
    });

    this.checkListsList.subscribe(x => {
      this.content = this.checkLists;
      this.checkLists = Object.assign([], x);
    });
    this.listCheckListsByIdTruckFleet(this.idTruckFleet);
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
          this.deleteCheckList(id);
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

  cancel(){
    this.clearControl();
    this.new = false;
    this.textButton = "Registrar";
  }

  get form() {
    return this.checkListForm.controls;
  }

  saveUser() {
    this.submitted = true
    if (this.checkListForm.valid) {
      this.pipe = new DatePipe('en-US');
      const id = this.checkListForm.get('id')?.value;
      const idTruckFleet = this.idTruckFleet;
      const date = this.checkListForm.get('documentDate')?.value;
      const dateFormat = this.pipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.sssZ');
      let checkList = new CheckList();
      let truckFleet = new TruckFleet();
      truckFleet.id = this.idTruckFleet;
      checkList.truckFleet = truckFleet;
      checkList.date = dateFormat;
      checkList.namePhoto = this.file.name;
      checkList.photo = this.image.replace("data:application/pdf;base64,", "");

      if (id == '0') {
        this.registerCheckList(checkList);
      } else {
        checkList.id = id;
        this.updateCheckList(checkList);
      }

      this.new = false;
      this.textButton = "Registrar";
      this.clearControl();
    }
  }

  clearControl(){
    this.checkListForm.controls['documentDate'].setValue("");
    this.checkListForm.controls['document'].setValue(null);
  }

  editDataGet(id: any) {
    this.new = true;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    var listData = this.checkLists.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].date.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.checkListForm.controls['id'].setValue(listData[0].id);
    this.checkListForm.controls['documentDate'].setValue(fortmatFabricationDate);
    this.checkListForm.controls['document'].setValue(listData[0].photo);
    this.textButton = "Actualizar";
  }

  listCheckLists() {
    this.checkListsResponse = [];
    this.service.listCheckLists()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.checkListsResponse = response.datos.checkListDtoList;
              this.service.paginationTable(this.checkListsResponse);
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
              this.service.paginationTable([]);
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

  listCheckListsByIdTruckFleet(id) {
    this.service.listByIdTruckFleet(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.checkListsResponse = response.datos.checkLists;
              this.service.paginationTable(this.checkListsResponse);
            } else {
              this.service.paginationTable([]);
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

  registerCheckList(checkList) {
    this.service.registerCheckList(checkList)
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
              this.listCheckListsByIdTruckFleet(this.idTruckFleet);
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

  updateCheckList(checkList) {
    this.service.updateCheckList(checkList)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listCheckListsByIdTruckFleet(this.idTruckFleet);
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

  deleteCheckList(id) {
    this.service.deleteCheckList(id)
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
              
              this.listCheckListsByIdTruckFleet(this.idTruckFleet);
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

  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveByteArray(id: any) {
    var documentResponse = this.checkListsResponse.filter(c => c.id === id)[0];
    const linkSource = 'data:application/pdf;base64,' + documentResponse.photo;
    const downloadLink = document.createElement("a");
    const fileName = documentResponse.namePhoto;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  getDocument(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.image = reader.result;
    };
  }

  viewDocument(id){
    var documentResponse = this.checkListsResponse.filter(c => c.id === id)[0];
    const linkSource = 'data:application/pdf;base64,' + documentResponse.photo;
    this.service.downloadPDF(linkSource).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }
}

