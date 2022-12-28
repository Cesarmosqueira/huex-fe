import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, Provider } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { DocumentUnit } from '../models/document-unit.model';
import { DocumentUnitService } from '../services/document-unit.service';

@Component({
  selector: 'app-document-unit',
  templateUrl: './document-unit.component.html',
  styleUrls: ['./document-unit.component.scss']
})
export class DocumentUnitComponent implements OnInit {

  @Input() idTruckFleet: number;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  documentUnitForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  documentUnits?: any;
  documentUnitsResponse: DocumentUnit[] = [];
  documentUnitsList!: Observable<DocumentUnit[]>;
  total: Observable<number>;
  pipe: any;
  selectProvider = null;

  image: any;
  photoTechnicalReviewLocal: any;
  photoSoatLocal: any;
  photoMtcLocal: any;
  policyDocumentLocal: any;
  photoPolicyLocal: any;
  namePhotoTechnicalReviewLocal: any;
  namePhotoSoatLocal: any;
  namePhotoMtcLocal: any;
  namePolicyDocumentLocal: any;
  namePhotoPolicyLocal: any;

  file: File = null;
  new = false;
  textButton = "Registrar";

  constructor(public service: DocumentUnitService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder) {
    this.documentUnitsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {

    /**
     * Form Validation
     */
    this.documentUnitForm = this.formBuilder.group({
      id: ['0'],
      idTruckFleet: [''],
      fireExtinguisherExpiration: [''],
      firstAidKitExpiration: [''],
      technicalReviewExpiration: [''],
      photoTechnicalReview: [''],
      soatExpiration: [''],
      photoSoat: [''],
      mtcExpiration: [''],
      photoMtc: [''],
      policyDocument: [''],
      expirationPolicy: [''],
      photoPolicy: ['']
    });

    this.documentUnitsList.subscribe(x => {
      this.content = this.documentUnits;
      this.documentUnits = Object.assign([], x);
    });

    this.listDocumentUnitsByIdTruckFleet(this.idTruckFleet);
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
          this.deleteDocumentUnit(id);
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
  openModal(value) {
    this.new = value;
  }

  cancel() {
    this.clearControl();
    this.new = false;
    this.textButton = "Registrar";
  }

  /**
   * Form data get
   */
  get form() {
    return this.documentUnitForm.controls;
  }


  saveDocuments() {
    this.submitted = true
    if (this.documentUnitForm.valid) {
      this.pipe = new DatePipe('en-US');

      const id = this.documentUnitForm.get('id')?.value;
      const idTruckFleet = this.idTruckFleet;
      const fireExtinguisherExpiration = this.documentUnitForm.get('fireExtinguisherExpiration')?.value;
      const firstAidKitExpiration = this.documentUnitForm.get('firstAidKitExpiration')?.value;
      const technicalReviewExpiration = this.documentUnitForm.get('technicalReviewExpiration')?.value;
      const soatExpiration = this.documentUnitForm.get('soatExpiration')?.value;
      const mtcExpiration = this.documentUnitForm.get('mtcExpiration')?.value;
      const expirationPolicy = this.documentUnitForm.get('expirationPolicy')?.value;

      let documentUnit = new DocumentUnit();
      documentUnit.idTruckFleet = idTruckFleet;
      documentUnit.fireExtinguisherExpiration = this.pipe.transform(fireExtinguisherExpiration, 'yyyy-MM-dd');
      documentUnit.firstAidKitExpiration = this.pipe.transform(firstAidKitExpiration, 'yyyy-MM-dd');
      documentUnit.technicalReviewExpiration = this.pipe.transform(technicalReviewExpiration, 'yyyy-MM-dd');
      documentUnit.photoTechnicalReview = this.photoTechnicalReviewLocal.replace("data:image/jpeg;base64,", "");
      documentUnit.soatExpiration = this.pipe.transform(soatExpiration, 'yyyy-MM-dd');
      documentUnit.photoSoat = this.photoSoatLocal.replace("data:image/jpeg;base64,", "");
      documentUnit.mtcExpiration = this.pipe.transform(mtcExpiration, 'yyyy-MM-dd');
      documentUnit.photoMtc = this.photoMtcLocal.replace("data:image/jpeg;base64,", "");
      documentUnit.policy = this.policyDocumentLocal.replace("data:application/pdf;base64,", "");
      documentUnit.expirationPolicy = this.pipe.transform(expirationPolicy, 'yyyy-MM-dd');
      documentUnit.photoPolicy = this.photoPolicyLocal.replace("data:image/jpeg;base64,", "");
      documentUnit.namePhotoTechnicalReview = this.namePhotoTechnicalReviewLocal;
      documentUnit.nameSoatPhoto = this.namePhotoSoatLocal;
      documentUnit.namePhotoMtc = this.namePhotoMtcLocal;
      //documentUnit.namePolicyDocument=this.namePolicyDocumentLocal;
      documentUnit.namePhotoPolicy = this.namePhotoPolicyLocal;
      console.log(documentUnit);

      if (id == '0') {
        this.registerDocumentUnit(documentUnit);
      } else {
        documentUnit.id = id;
        this.updateDocumentUnit(documentUnit);
      }

      this.new = false;
      this.textButton = "Registrar";
      this.clearControl();
    }
  }

  clearControl() {
    this.documentUnitForm.controls['fireExtinguisherExpiration'].setValue("");
    this.documentUnitForm.controls['firstAidKitExpiration'].setValue("");
    this.documentUnitForm.controls['technicalReviewExpiration'].setValue("");
    this.documentUnitForm.controls['photoTechnicalReview'].setValue(null);
    this.documentUnitForm.controls['soatExpiration'].setValue("");
    this.documentUnitForm.controls['photoSoat'].setValue(null);
    this.documentUnitForm.controls['mtcExpiration'].setValue("");
    this.documentUnitForm.controls['photoMtc'].setValue(null);
    this.documentUnitForm.controls['policyDocument'].setValue(null);
    this.documentUnitForm.controls['expirationPolicy'].setValue("");
    this.documentUnitForm.controls['photoPolicy'].setValue(null);
  }
  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any) {
    this.new = true;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    var listData = this.documentUnits.filter((data: { id: any; }) => data.id === id);
    const fireExtinguisherExpiration = listData[0].fireExtinguisherExpiration.substring(0, 10);
    const firstAidKitExpiration = listData[0].firstAidKitExpiration.substring(0, 10);
    const technicalReviewExpiration = listData[0].technicalReviewExpiration.substring(0, 10);
    const soatExpiration = listData[0].soatExpiration.substring(0, 10);
    const mtcExpiration = listData[0].mtcExpiration.substring(0, 10);
    const expirationPolicy = listData[0].expirationPolicy.substring(0, 10);
    this.documentUnitForm.controls['fireExtinguisherExpiration'].setValue(this.pipe.transform(fireExtinguisherExpiration, 'yyyy-MM-dd'));
    this.documentUnitForm.controls['firstAidKitExpiration'].setValue(this.pipe.transform(firstAidKitExpiration, 'yyyy-MM-dd'));
    this.documentUnitForm.controls['technicalReviewExpiration'].setValue(this.pipe.transform(technicalReviewExpiration, 'yyyy-MM-dd'));
    this.documentUnitForm.controls['photoTechnicalReview'].setValue(null);
    this.documentUnitForm.controls['soatExpiration'].setValue(this.pipe.transform(soatExpiration, 'yyyy-MM-dd'));
    this.documentUnitForm.controls['photoSoat'].setValue(null);
    this.documentUnitForm.controls['mtcExpiration'].setValue(this.pipe.transform(mtcExpiration, 'yyyy-MM-dd'));
    this.documentUnitForm.controls['photoMtc'].setValue(null);
    this.documentUnitForm.controls['policyDocument'].setValue(null);
    this.documentUnitForm.controls['expirationPolicy'].setValue(this.pipe.transform(expirationPolicy, 'yyyy-MM-dd'));
    this.documentUnitForm.controls['photoPolicy'].setValue(null);
    this.documentUnitForm.controls['id'].setValue(id);
    this.textButton = "Actualizar";
  }

  listDocumentUnits() {
    this.service.listDocumentUnits()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.documentUnitsResponse = response.datos.documentUnitDtoList;
              console.log(this.documentUnitsResponse);
              this.service.paginationTable(this.documentUnitsResponse);
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
              title: "Ocurrio un error, comuniquese con el Banco",
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

  listDocumentUnitsByIdTruckFleet(id) {
    this.service.listByIdTruckFleet(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.documentUnitsResponse = response.datos.documentsUnit;
              console.log(this.documentUnitsResponse);
              this.service.paginationTable(this.documentUnitsResponse);
            } else {
              this.service.paginationTable([]);
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error, comuniquese con el Banco",
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

  registerDocumentUnit(documentUnit) {
    this.service.registerDocumentUnit(documentUnit)
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
              this.listDocumentUnitsByIdTruckFleet(this.idTruckFleet);
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
              title: "Ocurrio un error, comuniquese con el Banco",
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

  updateDocumentUnit(documentUnit) {
    this.service.updateDocumentUnit(documentUnit)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listDocumentUnitsByIdTruckFleet(this.idTruckFleet);
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
              title: "Ocurrio un error, comuniquese con el Banco",
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

  deleteDocumentUnit(id) {
    console.log(id);
    this.service.deleteDocumentUnit(id)
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

              this.listDocumentUnitsByIdTruckFleet(this.idTruckFleet);
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
              title: "Ocurrio un error, comuniquese con el Banco",
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

  saveDocumentOption(id: any, option) {
    var documentResponse = this.documentUnitsResponse.filter(c => c.id === id)[0];
    let document = "";
    let name = "";
    let ext = "data:image/jpeg;base64,";
    switch (option) {
      case 1:
        document = ext + documentResponse.photoTechnicalReview;
        name = documentResponse.namePhotoTechnicalReview;
        break;
      case 2:
        document = ext + documentResponse.photoSoat;
        name = documentResponse.nameSoatPhoto;
        break;
      case 3:
        document = ext + documentResponse.photoMtc;
        name = documentResponse.namePhotoMtc;
        break;
      case 4:
        document = ext + documentResponse.photoPolicy;
        name = documentResponse.namePhotoPolicy;
        break;
      case 5:
        document = "data:application/pdf;base64," + documentResponse.policy;
        name = "Póliza";
        break;
    }

    this.saveDocument(document, name);
  }

  saveDocument(file, name) {
    console.log("saveDocument" + file);
    const downloadLink = document.createElement("a");
    downloadLink.href = file;
    downloadLink.download = name;
    downloadLink.click();
  };

  viewDocumentOption(id: any, option) {
    var documentResponse = this.documentUnitsResponse.filter(c => c.id === id)[0];
    let document = "";
    let ext = "data:image/jpeg;base64,";
    let format = "image/jpeg";

    switch (option) {
      case 1:
        document = ext + documentResponse.photoTechnicalReview;
        break;
      case 2:
        document = ext + documentResponse.photoSoat;
        break;
      case 3:
        document = ext + documentResponse.photoMtc;
        break;
      case 4:
        document = ext + documentResponse.photoPolicy;
        break;
      case 5:
        document = "data:application/pdf;base64," + documentResponse.policy;
        format = "application/pdf";
        break;
    }

    this.viewDocument(document, format);
  }

  viewDocument(document, format) {
    console.log("viewDocument" + document);
    this.service.downloadPDF(document, format).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  getDocument(event, option) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    console.log(reader);
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      console.log(reader.result);
      switch (option) {
        case 1:
          this.photoTechnicalReviewLocal = reader.result;
          this.namePhotoTechnicalReviewLocal = this.file.name;
          break;
        case 2:
          this.photoSoatLocal = reader.result;
          this.namePhotoSoatLocal = this.file.name;
          break;
        case 3:
          this.photoMtcLocal = reader.result;
          this.namePhotoMtcLocal = this.file.name;
          break;
        case 4:
          this.photoPolicyLocal = reader.result;
          this.namePhotoPolicyLocal = this.file.name;
          break;
        case 5:
          this.policyDocumentLocal = reader.result;
          this.namePolicyDocumentLocal = this.file.name;
          break;
      }
    };
  }
}